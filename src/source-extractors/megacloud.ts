import axios from 'axios';

import { zoroBaseUrl } from '../provider/index.js';
import type { ASource } from '../types/types.js';
import { getClientKey } from '../utils/getClientKey.js';
import { Decrypter } from '../utils/decrypt.js';

class MegaCloud {
  readonly referer: string = `${zoroBaseUrl}/`;

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

    try {
      const match = /\/([^\/\?]+)\?/.exec(videoUrl.href);
      const sourceId = match?.[1];

      if (!sourceId) throw new Error('Unable to extract sourceId from embed URL').message;

      const fullPathname = videoUrl.pathname;
      const lastSlashIndex = fullPathname.lastIndexOf('/');
      const basePathname = fullPathname.substring(0, lastSlashIndex);

      const sourcesUrl = `${videoUrl.origin}${basePathname}/getSources?id=${sourceId}&_k=${clientKey}`;

      const { data: initialRawSourceData } = await axios.get(sourcesUrl);
      rawSourceData = initialRawSourceData;
      console.log(initialRawSourceData);

      console.log(clientKey);
      const StaticKey = 'AaND3XizK1QoixkfwyJfztls3yx5LALK1XBbOgxiyolzVhE' + clientKey;
      const encryptedSourcesToTry: string = rawSourceData?.sources;
      if (!encryptedSourcesToTry) {
        throw new Error('Expected source response missing.').message;
      }
      if (rawSourceData.encrypted) {
        const decrypter = new Decrypter(StaticKey);
        const sources = decrypter.setupPlayerSources(encryptedSourcesToTry);
        console.log(sources);
        // extractedData.sources = finalDecryptedSources.map((s: any) => ({
        //   url: s.file,
        //   isM3U8: s.type === 'hls',
        //   type: s.type,
        // }));
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
