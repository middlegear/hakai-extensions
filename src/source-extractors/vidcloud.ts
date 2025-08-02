import axios from 'axios';
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
  private primaryKeyUrl = 'https://raw.githubusercontent.com/yogesh-hacker/MegacloudKeys/refs/heads/main/keys.json';
  async fetchKey(url: string): Promise<string> {
    try {
      const response = await axios.get(url);
      const jsonData = response.data;
      if (typeof jsonData === 'object' && jsonData !== null && 'rabbit' in jsonData) {
        const key = jsonData.rabbit;
        if (typeof key === 'string' && key.length > 0) {
          return key;
        }
      }

      throw new Error(`Invalid 'rabbit' field or key not found in JSON from ${url}.`);
    } catch (error) {
      throw new Error(`Failed to fetch key from ${url}: ${(error as Error).message}`);
    }
  }

  async extract(videoUrl: URL, referer: string = 'https://flixhq.to/'): Promise<ExtractedData | string> {
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
      return new Error('Failed to fetch sourceId').message;
    }

    const fullPathname = videoUrl.pathname;
    const lastSlashIndex = fullPathname.lastIndexOf('/');
    const basePathname = fullPathname.substring(0, lastSlashIndex);

    try {
      const clientkey = await getClientKey(videoUrl.href, referer);
      if (!clientkey) {
        throw new Error('Failed to fetch ClientKey').message;
      }

      const sourcesUrl = `${videoUrl.origin}${basePathname}/getSources?id=${sourceId}&_k=${clientkey}`;

      const { data: initialResponse } = await providerClient.get(sourcesUrl, Options);

      if (initialResponse.encrypted) {
        const key = await this.fetchKey(this.primaryKeyUrl);
        const decryptor = new Decrypter();
        const decrypted = decryptor.decrypt(initialResponse.sources, clientkey, key);
        const sources = JSON.parse(decrypted);

        if (!Array.isArray(sources)) {
          throw new Error('Decrypted sources is not a valid array');
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
        }
      }

      if (initialResponse.tracks && Array.isArray(initialResponse.tracks) && initialResponse.tracks.length > 0) {
        extractedData.subtitles = initialResponse.tracks.map((track: any) => ({
          url: track.file,
          lang: track.label || track.kind || 'Unknown',
          default: track.default || false,
        }));
      }

      return extractedData;
    } catch (error) {
      return error instanceof Error ? error.message : 'Fatal Error';
    }
  }
}

export default VidCloud;
