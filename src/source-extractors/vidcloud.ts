import axios from 'axios';
import { USER_AGENT_HEADER } from '../provider';
import CryptoJS from 'crypto-js';
//https://megacloud.blog/js/player/a/v2/pro/embed-1.min.js?v=
// https://cloudvidz.net/js/player/m/v2/pro/embed-1.min.js?v=
// https:///cdnstreame.net/js/player/m/v2/pro/embed-1.min.js?v=
export type sources = {
  url: string;
  isM3U8: boolean;
  type: string;
};

export type subtitles = {
  url: string;
  lang: string;
};

export type ExtractedData = {
  subtitles: subtitles[];
  sources: sources[];
};

class VidCloud {
  private keyFetchers = [
    async (): Promise<string | null> => {
      const url = 'https://raw.githubusercontent.com/itzzzme/megacloud-keys/refs/heads/main/rabbit.txt';
      try {
        const response = await axios.get(url);
        if (typeof response.data === 'string' && response.data.length > 0) {
          console.log(`First attempt`);
          return response.data;
        }
        console.warn(`Empty or invalid data from ${url}.`);
        return null;
      } catch (error) {
        console.warn(`Failed to fetch key from ${url}:`, (error as Error).message);
        return null;
      }
    },
    ///https://key.hi-anime.site
    async (): Promise<string | null> => {
      const url = 'https://key.hi-anime.site';
      try {
        const response = await axios.get(url);
        const jsonData = response.data;
        if (typeof jsonData === 'object' && jsonData !== null && 'rabbit' in jsonData) {
          const key = (jsonData as any).rabbit;
          if (typeof key === 'string' && key.length > 0) {
            console.log(`Second attempt`);
            return key;
          }
          console.warn(`'rabbit' field is empty or not a string from ${url}.`);
          return null;
        }
        console.warn(`JSON from ${url} does not contain an expected  field or is invalid.`);
        return null;
      } catch (error) {
        console.warn(`Failed to fetch key from ${url}:`, (error as Error).message);
        return null;
      }
    },
    async (): Promise<string | null> => {
      const url = 'https://raw.githubusercontent.com/yogesh-hacker/MegacloudKeys/refs/heads/main/keys.json';
      try {
        const response = await axios.get(url);
        const jsonData = response.data;
        if (typeof jsonData === 'object' && jsonData !== null && 'rabbit' in jsonData) {
          const key = (jsonData as any).rabbit;
          if (typeof key === 'string' && key.length > 0) {
            console.log(`Final attempt`);
            return key;
          }
          console.warn(`'rabbit' field is empty or not a string from ${url}.`);
          return null;
        }
        console.warn(`JSON from ${url} does not contain an expected  field or is invalid.`);
        return null;
      } catch (error) {
        console.warn(`Failed to fetch key from ${url}:`, (error as Error).message);
        return null;
      }
    },
  ];

  extract = async (videoUrl: URL, referer: string = 'https://flixhq.to/'): Promise<ExtractedData | string> => {
    const extractedData: ExtractedData = {
      subtitles: [],
      sources: [],
    };

    let workingKey: string | null = null;
    let rawSourceData: any = null;

    const Options = {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        Referer: videoUrl.href,
        'User-Agent': USER_AGENT_HEADER,
      },
    };

    const match = /\/([^\/\?]+)\?/.exec(videoUrl.href);
    const sourceId = match?.[1];

    if (!sourceId) {
      return 'Could not extract source ID from video URL.';
    }
    const sourcesUrl = `${videoUrl.origin}/embed-1/v2/e-1/getSources?id=${sourceId}`;

    for (const fetchKeyFunc of this.keyFetchers) {
      const currentKey = await fetchKeyFunc();

      if (currentKey) {
        try {
          if (!rawSourceData) {
            const response = await axios.get(sourcesUrl, Options);
            rawSourceData = response.data;
          }

          const encrypted = rawSourceData?.sources;
          if (!encrypted) {
            console.warn(`No encrypted source found in raw data with key from previous source.`);
            continue;
          }
          console.log(`Attempting decryption with current key...`);
          const decrypted = CryptoJS.AES.decrypt(encrypted, currentKey).toString(CryptoJS.enc.Utf8);

          let tempDecryptedSources;
          try {
            tempDecryptedSources = JSON.parse(decrypted);
            workingKey = currentKey;
            console.log('Success!');
            break;
          } catch (jsonParseError) {
            console.warn(
              `JSON parsing failed with key. This key might be outdated/incorrect. Trying next key. Error:`,
              (jsonParseError as Error).message,
            );

            continue;
          }
        } catch (decryptionError) {
          console.warn(
            `Decryption failed with key: "${currentKey}". This key might be outdated/incorrect. Trying next key. Error:`,
            (decryptionError as Error).message,
          );

          continue;
        }
      }
    }

    if (!workingKey) {
      throw new Error(
        'Failed to retrieve a working decryption key and decrypt source data from all available endpoints.Try again later mate',
      );
    }

    try {
      const encrypted = rawSourceData?.sources;
      const decrypted = CryptoJS.AES.decrypt(encrypted, workingKey).toString(CryptoJS.enc.Utf8);
      const finalDecryptedSources = JSON.parse(decrypted);

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
      return error instanceof Error ? error.message : 'Unknown Error';
    }
  };
}

export default VidCloud;
