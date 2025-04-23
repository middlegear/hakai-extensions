import axios from 'axios';
import { ASource } from '../../types/types';
import { headers } from '../../provider/anime/animekai/animekai';

function base64UrlEncode(str: string): string {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(base64Url: string): string {
  let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return atob(base64);
}

const encodeTransforms: ((n: number) => number)[] = [
  n => (n + 111) % 256,
  n => (n + 212) % 256,
  n => n ^ 217,
  n => (n + 214) % 256,
  n => (n + 151) % 256,
  n => ~n & 255,
  n => ~n & 255,
  n => ~n & 255,
  n => (n - 1 + 256) % 256,
  n => (n - 96 + 256) % 256,
  n => ~n & 255,
  n => ~n & 255,
  n => (n - 206 + 256) % 256,
  n => ~n & 255,
  n => (n + 116) % 256,
  n => n ^ 70,
  n => n ^ 147,
  n => (n + 190) % 256,
  n => n ^ 222,
  n => (n - 118 + 256) % 256,
  n => (n - 227 + 256) % 256,
  n => ~n & 255,
  n => ((n << 4) | (n >>> 4)) & 255,
  n => (n + 22) % 256,
  n => ~n & 255,
  n => (n + 94) % 256,
  n => (n + 146) % 256,
  n => ~n & 255,
  n => (n - 206 + 256) % 256,
  n => (n - 62 + 256) % 256,
];

function encodeKaihome(input: string): string {
  const encoded = encodeURIComponent(input);
  const transformedBytes: number[] = [];
  for (let i = 0; i < encoded.length; i++) {
    const charCode = encoded.charCodeAt(i);
    const transformedCode = encodeTransforms[i % encodeTransforms.length](charCode) & 255;
    transformedBytes.push(transformedCode);
  }
  const transformedString = String.fromCharCode(...transformedBytes);
  return base64UrlEncode(transformedString);
}

const decodeTransforms: ((n: number) => number)[] = [
  n => (n - 111 + 256) % 256,
  n => (n - 212 + 256) % 256,
  n => n ^ 217,
  n => (n - 214 + 256) % 256,
  n => (n - 151 + 256) % 256,
  n => ~n & 255,
  n => ~n & 255,
  n => ~n & 255,
  n => (n + 1) % 256,
  n => (n + 96) % 256,
  n => ~n & 255,
  n => ~n & 255,
  n => (n + 206) % 256,
  n => ~n & 255,
  n => (n - 116 + 256) % 256,
  n => n ^ 70,
  n => n ^ 147,
  n => (n - 190 + 256) % 256,
  n => n ^ 222,
  n => (n + 118) % 256,
  n => (n + 227) % 256,
  n => ~n & 255,
  n => ((n >>> 4) | (n << 4)) & 255,
  n => (n - 22 + 256) % 256,
  n => ~n & 255,
  n => (n - 94 + 256) % 256,
  n => (n - 146 + 256) % 256,
  n => ~n & 255,
  n => (n + 206) % 256,
  n => (n + 62) % 256,
];

function decodeKaihome(input: string): string {
  const decodedBase64 = base64UrlDecode(input);
  const transformedChars: number[] = [];
  for (let i = 0; i < decodedBase64.length; i++) {
    const charCode = decodedBase64.charCodeAt(i);
    const transformedCode = decodeTransforms[i % decodeTransforms.length](charCode) & 255;
    transformedChars.push(transformedCode);
  }
  const transformedString = String.fromCharCode(...transformedChars);
  return decodeURIComponent(transformedString);
}

export class MegaUp {
  protected sources: ASource[] = [];
  private decodingSteps: any[] | null = null;
  private decodingStepsFetchPromise: Promise<void> | null = null;
  private readonly decodingStepsUrl: string =
    'https://raw.githubusercontent.com/amarullz/kaicodex/refs/heads/main/generated/kai_codex.json';

  #reverseIt = (n: string) => {
    return n.split('').reverse().join('');
  };
  #base64UrlEncode = base64UrlEncode;
  #substitute = (input: string, keys: string, values: string) => {
    const map = Object.fromEntries(keys.split('').map((key, i) => [key, values[i] || '']));
    const a = input
      .split('')
      .map(char => map[char] || char)
      .join('');
    return a;
  };

  #transform = (n: string, t: string) => {
    const v = Array.from({ length: 256 }, (_, i) => i);
    let c = 0;
    let f = '';

    for (let w = 0; w < 256; w++) {
      c = (c + v[w] + n.charCodeAt(w % n.length)) % 256;
      [v[w], v[c]] = [v[c], v[w]];
    }
    for (let a = (c = 0), w = 0; a < t.length; a++) {
      w = (w + 1) % 256;
      c = (c + v[w]) % 256;
      [v[w], v[c]] = [v[c], v[w]];
      f += String.fromCharCode(t.charCodeAt(a) ^ v[(v[w] + v[c]) % 256]);
    }
    return f;
  };
  #base64UrlDecode = base64UrlDecode;

  GenerateToken = (n: string) => {
    return encodeKaihome(n);
  };

  DecodeIframeData = (n: string) => {
    return decodeKaihome(n);
  };

  private async fetchDecodingSteps(): Promise<void> {
    try {
      const response = await axios.get(this.decodingStepsUrl);
      if (!response.data?.megaup?.decrypt) {
        throw new Error('Failed to retrieve megaup decryption steps from the JSON.');
      }
      this.decodingSteps = response.data.megaup.decrypt;
    } catch (error) {
      console.error('Error fetching decoding steps:', error);
      this.decodingSteps = null;
    } finally {
      this.decodingStepsFetchPromise = null;
    }
  }

  async loadDecodingSteps(): Promise<void> {
    if (!this.decodingStepsFetchPromise) {
      this.decodingStepsFetchPromise = this.fetchDecodingSteps();
    }
    return this.decodingStepsFetchPromise;
  }

  OrderOfOperations = (encodedString: string, steps: any[]): string => {
    let decoded = encodedString;

    for (const step of steps) {
      const operation = step[0];

      try {
        switch (operation) {
          case 'safeb64_decode':
            decoded = this.#base64UrlDecode(decoded);
            break;
          case 'safeb64_encode':
            decoded = this.#base64UrlEncode(decoded);
            break;

          case 'reverse':
            decoded = this.#reverseIt(decoded);
            break;

          case 'substitute':
            decoded = this.#substitute(decoded, step[1], step[2]);
            break;

          case 'rc4':
            decoded = this.#transform(step[1], decoded);
            break;

          case 'urldecode':
            decoded = decodeURIComponent(decoded);
            break;

          case 'urlencode':
            decoded = encodeURIComponent(decoded);
            break;

          default:
            throw new Error(`Unknown operation: ${operation}`);
        }
      } catch (error) {
        console.error(`Error in step ${operation}:`, error);
        console.error('Current value:', decoded);
        throw error;
      }
    }

    return decoded;
  };

  Decode = (encodedString: string): string | null => {
    if (!this.decodingSteps) {
      throw new Error('Decoding steps not loaded. Call loadDecodingSteps() first.');
    }
    try {
      const decoded = this.OrderOfOperations(encodedString, this.decodingSteps);
      return decoded;
    } catch (e) {
      console.error('Decoding failed:', e);
      return null;
    }
  };
  extract = async (videoUrl: URL) => {
    try {
      const url = videoUrl.href.replace(/\/(e|e2)\//, '/media/');
      const res = await axios.get(url, {
        headers: headers,
      });

      await this.loadDecodingSteps();
      const decodedString = this.Decode(res.data.result);
      if (!decodedString) {
        throw new Error('Failed to decode video data.');
      }
      const decryptedResult = JSON.parse(decodedString.replace(/\\/g, ''));

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
  };
}
