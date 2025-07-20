import axios from 'axios';
import { providerClient, USER_AGENT_HEADER, zoroBaseUrl } from '../provider/index.js';
import type { ASource } from '../types/types.js';
import { getClientKey } from '../utils/getClientKey.js';
import { MegacloudDecryptor } from '../utils/megaclouddecrypt.js';

class MegaCloud {
  readonly referer: string = `${zoroBaseUrl}/`;

  async fetchKey(): Promise<string | null> {
    const url = 'https://raw.githubusercontent.com/yogesh-hacker/MegacloudKeys/refs/heads/main/keys.json';
    try {
      const response = await axios.get(url);
      const jsonData = response.data;
      if (typeof jsonData === 'object' && jsonData !== null && 'mega' in jsonData) {
        const key = jsonData.mega;
        if (typeof key === 'string' && key.length > 0) {
          return key;
        }
        console.warn(`'rabbit' field is empty or not a string from ${url}.`);
        return null;
      }
      console.warn(`JSON from ${url} does not contain an expected 'rabbit' field or is invalid.`);
      return null;
    } catch (error) {
      console.warn(`Failed to fetch key:`, (error as Error).message);
      return null;
    }
  }

  async extract(videoUrl: URL): Promise<ASource | string> {
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

    const options = {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        Referer: videoUrl.href,
        'User-Agent': USER_AGENT_HEADER,
      },
    };

    const match = /\/([^\/\?]+)(?:\?|$)/.exec(videoUrl.href);
    const sourceId = match?.[1];
    if (!sourceId) {
      return 'Failed to extract source ID';
    }

    const fullPathname = videoUrl.pathname;
    const lastSlashIndex = fullPathname.lastIndexOf('/');
    const basePathname = fullPathname.substring(0, lastSlashIndex);
    const clientKey = await getClientKey(videoUrl.href, this.referer);
    if (!clientKey) {
      throw new Error('Failed to fetch ClientKey').message;
    }

    const sourcesUrl = `${videoUrl.origin}${basePathname}/getSources?id=${sourceId}&_k=${clientKey}`;

    try {
      const { data: initialResponse } = await providerClient.get(sourcesUrl, options);

      if (initialResponse.encrypted) {
        const decryptor = new MegacloudDecryptor();

        const secret = await this.fetchKey();
        const decoded = decryptor.decrypt(secret as string, clientKey, initialResponse.sources);

        const sources = JSON.parse(decoded);
        if (!Array.isArray(sources)) {
          console.error('Decrypted sources is not an array:', sources);
          return 'Decrypted sources is not an array';
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

      extractedData.intro = initialResponse.intro ?? { start: 0, end: 0 };
      extractedData.outro = initialResponse.outro ?? { start: 0, end: 0 };

      if (initialResponse.tracks && Array.isArray(initialResponse.tracks) && initialResponse.tracks.length > 0) {
        extractedData.subtitles = initialResponse.tracks.map((track: any) => ({
          url: track.file,
          lang: track.label || track.kind || 'Unknown',
          default: track.default || false,
        }));
      }

      return extractedData;
    } catch (error) {
      console.error('Extraction error:', error);
      return error instanceof Error ? error.message : 'Could not fetch or decrypt sources';
    }
  }
}

export default MegaCloud;
