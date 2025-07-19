import { providerClient } from '../config/clients.js';
import { USER_AGENT_HEADER } from '../provider/index.js';
import { Decrypter } from '../utils/decrypt.js';
import { getClientKey } from '../utils/getClientKey.js';

export type sources = {
  url: string;
  isM3U8: boolean;
  type: string;
};

export type subtitles = {
  url: string;
  lang: string;
  default?: boolean;
};

export type ExtractedData = {
  subtitles: subtitles[];
  sources: sources[];
};

class VidCloud {
  ///ill have to define the keyfetcher functions here
  extract = async (videoUrl: URL, referer: string = 'https://flixhq.to/') => {
    const Options = {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        Referer: videoUrl.href,
        'User-Agent': USER_AGENT_HEADER,
      },
    };
    const extractedData: ExtractedData = {
      subtitles: [],
      sources: [],
    };

    const match = /\/([^\/\?]+)(?:\?|$)/.exec(videoUrl.href);
    const sourceId = match?.[1];
    if (!sourceId) {
      console.error('Failed to extract source ID from:', videoUrl.href);
      return { error: 'Could not extract source ID from video URL.' };
    }

    const fullPathname = videoUrl.pathname;
    const lastSlashIndex = fullPathname.lastIndexOf('/');
    const basePathname = fullPathname.substring(0, lastSlashIndex);
    const clientkey = await getClientKey(videoUrl.href, referer);
    if (!clientkey) {
      return { error: 'Could not obtain client key.' };
    }
    console.log(clientkey);

    const sourcesUrl = `${videoUrl.origin}${basePathname}/getSources?id=${sourceId}&_k=${clientkey}`;

    try {
      const { data: initialResponse } = await providerClient.get(sourcesUrl, Options);
      console.log('API Response:', initialResponse);

      if (initialResponse.encrypted) {
        // implement keyfetching avoid static stuff
        const secret = 'PeLEW04UckjTFKg0x5xKO1WdhtDxvHBTxwiUWrztwWs3O7dc8cd9w';
        const decryptor = new Decrypter(clientkey, secret);
        const decrypted = decryptor.decrypt(initialResponse.sources);
        const sources = JSON.parse(decrypted);

        if (!Array.isArray(sources)) {
          console.error('Decrypted sources is not an array:', sources);
          throw new Error('Decrypted sources is not an array');
        }
        extractedData.sources = sources.map((s: any) => ({
          url: s.file,
          isM3U8: s.type === 'hls',
          type: s.type,
        }));
      } else {
        if (initialResponse.sources && Array.isArray(initialResponse.sources)) {
          extractedData.sources = initialResponse.sources.map((s: any) => ({
            url: s.file,
            isM3U8: s.type === 'hls',
            type: s.type,
          }));
        } else {
          console.warn('No sources found or sources is not an array:', initialResponse.sources);
        }
      }

      // Handle subtitles (never encrypted, process in both states)
      if (initialResponse.tracks && Array.isArray(initialResponse.tracks) && initialResponse.tracks.length > 0) {
        extractedData.subtitles = initialResponse.tracks.map((track: any) => ({
          url: track.file,
          lang: track.label || track.kind || 'Unknown',
          default: track.default || false,
        }));
      } else {
        console.warn('No subtitles found or tracks is invalid:', initialResponse.tracks);
      }

      return extractedData;
    } catch (error) {
      console.error('Extraction error:', error);
      return error instanceof Error ? error.message : 'Could not fetch or decrypt sources';
    }
  };
}

export default VidCloud;
