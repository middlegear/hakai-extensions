import { providerClient, USER_AGENT_HEADER, zoroBaseUrl } from '../provider/index.js';
import type { ASource } from '../types/types.js';
import { getClientKey } from '../utils/getClientKey.js';
import { MegacloudDecryptor } from '../utils/megaclouddecrypt.js';

class MegaCloud {
  readonly referer: string = `${zoroBaseUrl}/`;

  async extract(videoUrl: URL) {
    const Options = {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        Referer: videoUrl.href,
        'User-Agent': USER_AGENT_HEADER,
      },
    };
    const extractedData: ASource = {
      intro: {
        start: 0,
        end: 0,
      },
      outro: {
        start: 0,
        end: 0,
      },
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
    const clientkey = await getClientKey(videoUrl.href, this.referer);
    if (!clientkey) {
      return { error: 'Could not obtain client key.' };
    }
    console.log(clientkey);

    const sourcesUrl = `${videoUrl.origin}${basePathname}/getSources?id=${sourceId}&_k=${clientkey}`;

    try {
      const { data: initialResponse } = await providerClient.get(sourcesUrl, Options);
      console.log('API Response:', initialResponse);

      if (initialResponse.encrypted) {
        const decode = new MegacloudDecryptor();
        const secret = ''; /// idk this shit
        const nonce = ''; ///
        const keyphrase = secret + nonce;
        const decoded = decode.decrypt(initialResponse.sources, keyphrase);

        const sources = JSON.parse(decoded);

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
  }
}
export default MegaCloud;
