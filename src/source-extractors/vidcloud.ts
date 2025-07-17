import axios from 'axios';

import CryptoJS from 'crypto-js';
import { USER_AGENT_HEADER } from '../provider/index.js';
import { getClientKey } from './getClientKey.js';
// import { generateSeed } from './decryptVidcloud.js';

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
          return response.data.trim();
        }
        console.warn(`Empty or invalid data from ${url}.`);
        return null;
      } catch (error) {
        console.warn(`Failed to fetch key from ${url}:`, (error as Error).message);
        return null;
      }
    },

    async (): Promise<string | null> => {
      const url = 'https://key.hi-anime.site';
      try {
        const response = await axios.get(url);
        const jsonData = response.data;
        if (typeof jsonData === 'object' && jsonData !== null && 'rabbit' in jsonData) {
          const key = (jsonData as any).rabbit;
          if (typeof key === 'string' && key.length > 0) {
            return key;
          }
          console.warn(`'rabbit' field is empty or not a string from ${url}.`);
          return null;
        }
        console.warn(`JSON  does not contain an expected  field or is invalid.`);
        return null;
      } catch (error) {
        console.warn(`Failed to fetch key :`, (error as Error).message);
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
            return key;
          }
          console.warn(`'rabbit' field is empty or not a string from ${url}.`);
          return null;
        }
        console.warn(`JSON from  does not contain an expected  field or is invalid.`);
        return null;
      } catch (error) {
        console.warn(`Failed to fetch key :`, (error as Error).message);
        return null;
      }
    },
  ];

  extract = async (videoUrl: URL, referer: string = 'https://flixhq.to/'): Promise<ExtractedData | string> => {
    const extractedData: ExtractedData = {
      subtitles: [],
      sources: [],
    };
    const clientKey = (await getClientKey(videoUrl.href, referer)) as string;

    let rawSourceData: any = null;

    const Options = {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        Referer: videoUrl.href,
        'User-Agent': USER_AGENT_HEADER,
      },
    };

    const match = /\/([^\/\?]+)\?/.exec(videoUrl.href);
    console.log(videoUrl.href);

    const sourceId = match?.[1];

    if (!sourceId) {
      return 'Could not extract source ID from video URL.';
    }
    const fullPathname = videoUrl.pathname;
    const lastSlashIndex = fullPathname.lastIndexOf('/');
    const basePathname = fullPathname.substring(0, lastSlashIndex);

    const sourcesUrl = `${videoUrl.origin}${basePathname}/getSources?id=${sourceId}&_k=${clientKey}`;
    // console.log(sourcesUrl);
    // console.log(clientKey);
    // const key = clientKey + generateSeed();
    // console.log(key);

    try {
      const response = await axios.get(sourcesUrl, Options);
      rawSourceData = response.data;

      if (!rawSourceData) {
        throw new Error('Expected source response missing.').message;
      }
      console.log(rawSourceData);
      if (rawSourceData.encrypted) {
        // attempt decryption
        try {
          const encrypted = rawSourceData?.sources;

          // const decrypted = CryptoJS.AES.decrypt(encrypted, workingKey).toString(CryptoJS.enc.Utf8);
          // const finalDecryptedSources = JSON.parse(decrypted);
          // extractedData.sources = finalDecryptedSources.map((s: any) => ({
          //   url: s.file,
          //   isM3U8: s.type === 'hls',
          //   type: s.type,
          // }));
        } catch (error) {
          return error instanceof Error ? error.message : 'Unknown Error';
        }
      } else {
        extractedData.sources = rawSourceData.sources.map((s: any) => ({
          url: s.file,
          isM3U8: s.type === 'hls',
          type: s.type,
        }));
      }
      extractedData.subtitles =
        rawSourceData.tracks?.map((track: any) => ({
          url: track.file,
          lang: track.label ? track.label : track.kind,
        })) || [];

      return extractedData;
    } catch (error) {
      return error instanceof Error ? error.message : 'Unknown Error';
    }
  };
}

export default VidCloud;
