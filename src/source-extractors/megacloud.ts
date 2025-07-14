import axios from 'axios';

import CryptoJS from 'crypto-js';
import { zoroBaseUrl } from '../provider/index.js';
import type { ASource } from '../types/types.js';

class MegaCloud {
  readonly referer: string = zoroBaseUrl;

  private keyFetchers = [
    async (): Promise<string | null> => {
      const url = 'https://raw.githubusercontent.com/itzzzme/megacloud-keys/refs/heads/main/key.txt';
      try {
        const response = await axios.get(url);
        if (typeof response.data === 'string' && response.data.length > 0) {
          return response.data.trim();
        }

        return null;
      } catch (error) {
        console.warn(`Failed to fetch key:`, (error as Error).message);
        return null;
      }
    },

    async (): Promise<string | null> => {
      const url = 'https://keys.hs.vc';
      try {
        const response = await axios.get(url);
        const jsonData = response.data;
        if (typeof jsonData === 'object' && jsonData !== null && 'megacloud' in jsonData) {
          const key = (jsonData as any).megacloud.key;
          if (typeof key === 'string' && key.length > 0) {
            return key;
          }
          return null;
        }
        return null;
      } catch (error) {
        console.warn(`Failed to fetch key:`, (error as Error).message);
        return null;
      }
    },

    async (): Promise<string | null> => {
      const url = 'https://key.hi-anime.site';
      try {
        const response = await axios.get(url);
        const jsonData = response.data;
        if (typeof jsonData === 'object' && jsonData !== null && 'key' in jsonData) {
          const key = (jsonData as any).key;
          if (typeof key === 'string' && key.length > 0) {
            return key;
          }

          return null;
        }
        console.warn(`JSON  does not contain an expected  field or is invalid.`);
        return null;
      } catch (error) {
        console.warn(`Failed to fetch key:`, (error as Error).message);
        return null;
      }
    },

    async (): Promise<string | null> => {
      const url = 'https://raw.githubusercontent.com/yogesh-hacker/MegacloudKeys/refs/heads/main/keys.json';
      try {
        const response = await axios.get(url);
        const jsonData = response.data;
        if (typeof jsonData === 'object' && jsonData !== null && 'mega' in jsonData) {
          const key = (jsonData as any).mega;
          if (typeof key === 'string' && key.length > 0) {
            return key;
          }

          return null;
        }
        console.warn(`JSON  does not contain an expected key field or is invalid.`);
        return null;
      } catch (error) {
        console.warn(`Failed to fetch key:`, (error as Error).message);
        return null;
      }
    },
  ];

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

    let workingKey: string | null = null;
    let rawSourceData: any = null;
    let finalDecryptedSources;

    try {
      const match = /\/([^\/\?]+)\?/.exec(videoUrl.href);
      const sourceId = match?.[1];

      if (!sourceId) throw new Error('Unable to extract sourceId from embed URL');

      const fullPathname = videoUrl.pathname;
      const lastSlashIndex = fullPathname.lastIndexOf('/');
      const basePathname = fullPathname.substring(0, lastSlashIndex);

      const sourcesUrl = `${videoUrl.origin}${basePathname}/getSources?id=${sourceId}`;

      const { data: initialRawSourceData } = await axios.get(sourcesUrl);
      rawSourceData = initialRawSourceData;

      const encryptedSourcesToTry: string = rawSourceData?.sources;
      if (!encryptedSourcesToTry) {
        throw new Error('Expected source response missing.');
      }
      if (rawSourceData.encrypted) {
        for (const fetchKeyFunction of this.keyFetchers) {
          const currentKey = await fetchKeyFunction();

          if (currentKey) {
            try {
              const decrypted = CryptoJS.AES.decrypt(encryptedSourcesToTry, currentKey).toString(CryptoJS.enc.Utf8);

              let tempDecryptedSources: string;
              try {
                tempDecryptedSources = JSON.parse(decrypted);
                workingKey = currentKey;
                break;
              } catch (error) {
                console.warn(` Error:`, (error as Error).message);

                continue;
              }
            } catch (error) {
              console.warn(`Error:`, (error as Error).message);

              continue;
            }
          }
        }

        if (!workingKey) {
          throw new Error('Try later');
        }

        const finalDecryptedContent = CryptoJS.AES.decrypt(encryptedSourcesToTry, workingKey).toString(CryptoJS.enc.Utf8);
        finalDecryptedSources = JSON.parse(finalDecryptedContent);
        extractedData.sources = finalDecryptedSources.map((s: any) => ({
          url: s.file,
          isM3U8: s.type === 'hls',
          type: s.type,
        }));
      } else {
        extractedData.sources = initialRawSourceData.map((s: any) => ({
          url: s.file,
          isM3U8: s.type === 'hls',
          type: s.type,
        }));
      }
      extractedData.intro = rawSourceData.intro ? rawSourceData.intro : extractedData.intro;
      extractedData.outro = rawSourceData.outro ? rawSourceData.outro : extractedData.outro;

      extractedData.subtitles =
        rawSourceData.tracks?.map((track: any) => ({
          url: track.file,
          lang: track.label ? track.label : track.kind,
        })) || [];

      return extractedData;
    } catch (error) {
      return error instanceof Error ? error.message : 'Unknown Error';
    }
  }
}

export default MegaCloud;
