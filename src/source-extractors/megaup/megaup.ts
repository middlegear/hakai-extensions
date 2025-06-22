// animekai-decoder.ts

import axios from 'axios';
import { headers } from '../../provider/anime/animekai/animekai.js';

interface AutoKai {
  kai: string[][];
  mega: string[][];
}

export interface AnimeKaiSource {
  url: string;
  isM3U8: boolean;
}

export interface AnimeKaiSubtitle {
  kind: string;
  url: string;
}

export class AnimekaiDecoder {
  private static readonly AUTOKAI_URL =
    'https://raw.githubusercontent.com/amarullz/kaicodex/refs/heads/main/generated/gen/keys.json';

  private static cachedHomeKeys: string[][] | null = null;
  private static cachedMegaKeys: string[][] | null = null;

  private static readonly HEADERS: Record<string, string> = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0',
    Accept: 'text/html, */*; q=0.01',
    'Accept-Language': 'en-US,en;q=0.5',
    'Sec-GPC': '1',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin',
    Priority: 'u=0',
    Pragma: 'no-cache',
    'Cache-Control': 'no-cache',
    referer: 'https://animekai.to/',
  };

  private static log(tag: string, message: string): void {
    console.log(`[${tag}] ${message}`);
  }

  private static error(tag: string, message: string, error?: any): void {
    console.error(`[${tag}] ${message}`, error);
  }

  private decodeKeys(keysSrc: string[][]): Uint8Array[][] {
    return keysSrc.map(inner => inner.map(item => Buffer.from(item, 'base64')));
  }

  private static async fetchAndParseAutokaiJson(): Promise<AutoKai | null> {
    try {
      const response = await axios.get(AnimekaiDecoder.AUTOKAI_URL, {
        headers: {
          'User-Agent': AnimekaiDecoder.HEADERS['User-Agent'],
          Accept: AnimekaiDecoder.HEADERS['Accept'],
        },
      });
      return response.data;
    } catch (e) {
      AnimekaiDecoder.error('KeyFetcher', 'Error fetching or parsing AutoKai keys:', e);
      return null;
    }
  }

  public static async getHomeKeys(): Promise<string[][]> {
    if (!AnimekaiDecoder.cachedHomeKeys) {
      const data = await AnimekaiDecoder.fetchAndParseAutokaiJson();
      AnimekaiDecoder.cachedHomeKeys = data?.kai || [];
    }
    return AnimekaiDecoder.cachedHomeKeys;
  }

  public static async getMegaKeys(): Promise<string[][]> {
    if (!AnimekaiDecoder.cachedMegaKeys) {
      const data = await AnimekaiDecoder.fetchAndParseAutokaiJson();
      AnimekaiDecoder.cachedMegaKeys = data?.mega || [];
    }
    return AnimekaiDecoder.cachedMegaKeys;
  }

  public async GenerateToken(input: string): Promise<string> {
    const keys = await AnimekaiDecoder.getHomeKeys();
    const keyBin = this.decodeKeys(keys);

    let result = encodeURIComponent(input);
    const keyLen = keyBin[0]?.length || 0;

    for (let j = 0; j < keyLen; j++) {
      const chars = result.split('');
      const transformed = chars.map((char, i) => {
        const c = char.charCodeAt(0) & 0xff;
        const k = keyBin[c]?.[j];
        return k ? k[i % k.length] : c;
      });
      result = Buffer.from(transformed).toString('base64');
    }

    return result.replace(/\//g, '_').replace(/\+/g, '-').replace(/=/g, '');
  }

  public async DecodeIframeData(input: string): Promise<string> {
    const keys = await AnimekaiDecoder.getHomeKeys();
    const keyBin = this.decodeKeys(keys);

    let data = input.replace(/_/g, '/').replace(/-/g, '+');
    const keyLen = keyBin[0]?.length || 0;

    for (let j = keyLen - 1; j >= 0; j--) {
      const buffer = Buffer.from(data, 'base64');
      const output = Buffer.alloc(buffer.length);

      for (let i = 0; i < buffer.length; i++) {
        const byte = buffer[i];
        let found = false;
        for (let k = 0; k < keyBin.length; k++) {
          const ky = keyBin[k]?.[j];
          if (ky && byte === ky[i % ky.length]) {
            output[i] = k;
            found = true;
            break;
          }
        }
        if (!found) output[i] = byte;
      }

      data = output.toString('latin1');
    }

    return decodeURIComponent(data);
  }

  public async Decode(input: string): Promise<string> {
    const keys = await AnimekaiDecoder.getMegaKeys();
    const keyBin = this.decodeKeys(keys);

    let data = input.replace(/_/g, '/').replace(/-/g, '+');
    const keyLen = keyBin[0]?.length || 0;

    for (let j = 1; j < keyLen; j++) {
      const buffer = Buffer.from(data, 'base64');
      for (let i = 0; i < buffer.length; i++) {
        const byte = buffer[i] & 0xff;
        const ky = keyBin[byte]?.[j];
        if (ky) buffer[i] = ky[i % ky.length];
      }
      data = buffer.toString('latin1');
    }

    return decodeURIComponent(data);
  }

  public async extract(videoUrl: URL) {
    const url = videoUrl.href.replace(/\/(e|e2)\//, '/media/');
    AnimekaiDecoder.log('Extractor', `Fetching media from: ${url}`);
    try {
      const res = await axios.get(url, {
        headers: headers,
      });
      // console.log(res.data.result);
      const decodedString = this.Decode(res.data.result);
      if (!decodedString) {
        throw new Error('Failed to decode video data.');
      }
      const decryptedResult = JSON.parse((await decodedString).replace(/\\/g, ''));

      const data = {
        sources: decryptedResult.sources.map((s: { file: string }) => ({
          url: s.file,
          isM3U8: s.file.includes('.m3U8') || s.file.endsWith('m3u8'),
        })),
        subtitles: decryptedResult.tracks.map((t: { kind: any; file: any }) => ({
          kind: t.kind,
          url: t.file,
        })),
        download: decryptedResult.download,
      };

      return data;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
}
