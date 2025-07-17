import axios from 'axios';

import CryptoJS from 'crypto-js';
import { zoroBaseUrl } from '../provider/index.js';
import type { ASource } from '../types/types.js';
import { getClientKey } from './getClientKey.js';
import { Decrypter } from './megaclouddecode.js';
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

    let rawSourceData: any = null;
    let finalDecryptedSources;
    const clientKey = (await getClientKey(videoUrl.href, this.referer)) as string;
    try {
      const match = /\/([^\/\?]+)\?/.exec(videoUrl.href);
      const sourceId = match?.[1];

      if (!sourceId) throw new Error('Unable to extract sourceId from embed URL');

      const fullPathname = videoUrl.pathname;
      const lastSlashIndex = fullPathname.lastIndexOf('/');
      const basePathname = fullPathname.substring(0, lastSlashIndex);

      const sourcesUrl = `${videoUrl.origin}${basePathname}/getSources?id=${sourceId}&_k=${clientKey}`;

      const { data: initialRawSourceData } = await axios.get(sourcesUrl);
      rawSourceData = initialRawSourceData;
      console.log(initialRawSourceData);
      // console.log(clientKey);
      const constantKey = 'yJV20GQe0QAFgw2F4UHfMTtD1yfjKjskryrpgAKjzp3OAqrqQ' + clientKey;
      console.log(constantKey);

      const encryptedSourcesToTry: string = rawSourceData?.sources;
      if (!encryptedSourcesToTry) {
        throw new Error('Expected source response missing.').message;
      }
      if (rawSourceData.encrypted) {
        const decrypter = new Decrypter(constantKey);

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
