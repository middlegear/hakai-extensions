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
          console.log(`First attempt`);
          return response.data.trim();
        }
        console.warn(`Empty or invalid data.`);
        return null;
      } catch (error) {
        console.warn(`Failed to fetch key:`, (error as Error).message);
        return null;
      }
    },

    // async (): Promise<string | null> => {
    //   const url = 'https://api.lunaranime.ru/static/key.txt'; /// not as accurate as the rest
    //   try {
    //     const response = await axios.get(url);
    //     if (typeof response.data === 'string' && response.data.length > 0) {
    //       console.log(`Second attempt`);
    //       return response.data;
    //     }
    //     console.warn(`Empty or invalid data.`);
    //     return null;
    //   } catch (error) {
    //     console.warn(`Failed to fetch key :`, (error as Error).message);
    //     return null;
    //   }
    // },

    async (): Promise<string | null> => {
      const url = 'https://key.hi-anime.site';
      try {
        const response = await axios.get(url);
        const jsonData = response.data;
        if (typeof jsonData === 'object' && jsonData !== null && 'key' in jsonData) {
          const key = (jsonData as any).key;
          if (typeof key === 'string' && key.length > 0) {
            console.log(`Second attempt`);
            return key;
          }
          console.warn(`'rabbit' field is empty or not a string from ${url}.`);
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
            console.log('Final attempt');
            return key;
          }
          console.warn(`'mega' field is empty or not a string from ${url}.`);
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

  async extract(embedIframeURL: URL): Promise<ASource | string> {
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

    try {
      const match = /\/([^\/\?]+)\?/.exec(embedIframeURL.href);
      const sourceId = match?.[1];

      if (!sourceId) throw new Error('Unable to extract sourceId from embed URL');

      const megacloudUrl = `https://megacloud.blog/embed-2/v2/e-1/getSources?id=${sourceId}`;

      const { data: initialRawSourceData } = await axios.get(megacloudUrl);
      rawSourceData = initialRawSourceData;

      const encryptedSourcesToTry: string = rawSourceData?.sources;
      if (!encryptedSourcesToTry) {
        throw new Error('Encrypted source missing in initial response from MegaCloud.');
      }

      for (const fetchKeyFunc of this.keyFetchers) {
        const currentKey = await fetchKeyFunc();

        if (currentKey) {
          try {
            console.log(`Attempting decryption with current key...`);
            const decrypted = CryptoJS.AES.decrypt(encryptedSourcesToTry, currentKey).toString(CryptoJS.enc.Utf8);

            let tempDecryptedSources: string;
            try {
              tempDecryptedSources = JSON.parse(decrypted);
              workingKey = currentKey;
              console.log('Success!');
              break;
            } catch (jsonParseError) {
              console.warn(
                `Decryption failed with this key. This key might be outdated/incorrect. Trying next key. Error:`,
                (jsonParseError as Error).message,
              );

              continue;
            }
          } catch (decryptionError) {
            console.warn(
              `Decryption failed with this key. This key might be outdated/incorrect. Trying next key. Error:`,
              (decryptionError as Error).message,
            );

            continue;
          }
        }
      }

      if (!workingKey) {
        throw new Error('Failed to retrieve working keys. Try again later');
      }

      const finalDecryptedContent = CryptoJS.AES.decrypt(encryptedSourcesToTry, workingKey).toString(CryptoJS.enc.Utf8);
      const finalDecryptedSources = JSON.parse(finalDecryptedContent);

      extractedData.intro = rawSourceData.intro ? rawSourceData.intro : extractedData.intro;
      extractedData.outro = rawSourceData.outro ? rawSourceData.outro : extractedData.outro;

      extractedData.subtitles =
        rawSourceData.tracks?.map((track: any) => ({
          url: track.file,
          lang: track.label ? track.label : track.kind,
        })) || [];
      extractedData.sources = finalDecryptedSources.map((s: any) => ({
        url: s.file,
        isM3U8: s.type === 'hls',
        type: s.type,
      }));

      return extractedData;
    } catch (error) {
      console.error('Error in MegaCloud extraction:', error);
      return error instanceof Error ? error.message : 'Unknown Error';
    }
  }
}

export default MegaCloud;
