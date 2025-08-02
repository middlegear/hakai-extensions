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

  async fetchKey(url: string): Promise<string | null> {
    try {
      const response = await axios.get(url);
      const jsonData = response.data;
      if (typeof jsonData === 'object' && jsonData !== null && 'rabbit' in jsonData) {
        const key = jsonData.rabbit;
        if (typeof key === 'string' && key.length > 0) {
          return key;
        }
        console.warn(`'rabbit' field is empty or not a string from ${url}.`);
        return null;
      }
      console.warn(`JSON from ${url} does not contain an expected 'rabbit' field or is invalid.`);
      return null;
    } catch (error) {
      console.warn(`Failed to fetch key from ${url}:`, (error as Error).message);
      return null;
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
      throw new Error('Failed to fetch sourceId').message;
    }

    const fullPathname = videoUrl.pathname;
    const lastSlashIndex = fullPathname.lastIndexOf('/');
    const basePathname = fullPathname.substring(0, lastSlashIndex);
    const clientkey = await getClientKey(videoUrl.href, referer);
    if (!clientkey) {
      throw new Error('Failed to fetch ClientKey').message;
    }

    const sourcesUrl = `${videoUrl.origin}${basePathname}/getSources?id=${sourceId}&_k=${clientkey}`;

    try {
      const { data: initialResponse } = await providerClient.get(sourcesUrl, Options);

      if (initialResponse.encrypted) {
        let sources;
        let key = await this.fetchKey(this.primaryKeyUrl);
        if (key) {
          const decryptor = new Decrypter();
          const decrypted = decryptor.decrypt(initialResponse.sources, clientkey, key);
          try {
            sources = JSON.parse(decrypted);
            if (Array.isArray(sources)) {
              extractedData.sources = sources.map((s: any) => ({
                url: s.file,
                isM3U8: s.type === 'hls',
                type: s.type,
              }));
            } else {
              throw new Error('sources is not an array').message;
            }
          } catch (error) {
            key = await this.fetchKey(this.secondaryKeyUrl);
            if (!key) {
              throw new Error('Failed to fetch decryption key from both sources').message;
            }
            const decryptor = new Decrypter(clientkey, key as string);
            const decryptedSecondary = decryptor.decrypt(initialResponse.sources);
            sources = JSON.parse(decryptedSecondary);
            if (!Array.isArray(sources)) {
              throw new Error('Decrypted sources is not an array').message;
            }
            extractedData.sources = sources.map((s: any) => ({
              url: s.file,
              isM3U8: s.type === 'hls',
              type: s.type,
            }));
          }
        } else {
          const secret = await this.fetchKey(this.secondaryKeyUrl);

          const decryptor = new Decrypter(clientkey, secret as string);
          const decrypted = decryptor.decrypt(initialResponse.sources);
          sources = JSON.parse(decrypted);
          if (!Array.isArray(sources)) {
            throw new Error('sources is not an array:').message;
          }
          extractedData.sources = sources.map((s: any) => ({
            url: s.file,
            isM3U8: s.type === 'hls',
            type: s.type,
          }));
        }
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
