import axios from 'axios';
import { ASource } from '../../types/types';
import { headers } from '../../provider/anime/animekai/animekai';

const KAICODEX = {
  safeBtoa: function (s: string): string {
    return btoa(s).replace(/\//g, '_').replace(/\+/g, '-').replace(/\=/g, '');
  },
  safeAtob: function (s: string): string {
    return atob(s.replace(/_/g, '/').replace(/-/g, '+'));
  },
  homefn: (function () {
    const f = [
      [0, 88],
      [0, 33],
      [0, 234],
      [4, 1, 7],
      [0, 101],
      [2, 188],
      [2, 45],
      [2, 74],
      [2, 232],
      [2, 208],
      [2, 124],
      [0, 110],
      [2, 211],
      [2, 9],
      [0, 153],
      [0, 140],
      [3, 255],
      [4, 6, 2],
      [4, 4, 4],
      [4, 7, 1],
      [4, 3, 5],
      [4, 4, 4],
      [0, 92],
      [0, 39],
      [0, 97],
      [3, 255],
      [0, 65],
      [0, 213],
      [0, 199],
      [0, 110],
    ];
    const fx = [
      (a: number, b: number) => (a + b) % 256 /* add */,
      (a: number, b: number) => (a * b) & 255 /* sum */,
      (a: number, b: number) => a ^ b /* xor */,
      (a: number, b: number) => ~a & b /* not */,
      (a: number, b: number, c: number) => ((a << b) | (a >> c)) & 255 /* bitwise */,
    ];
    function encrypt$(n: string): string {
      n = encodeURIComponent(n);
      const out = [];
      for (let i = 0; i < n.length; i++) {
        const fn = f[i % f.length];
        out.push(fx[fn[0]](n.charCodeAt(i), fn[1], fn[2]));
      }
      return KAICODEX.safeBtoa(String.fromCharCode(...out));
    }
    const rfx = [
      (a: number, b: number) => (a - b + 256) % 256 /* sub */,
      (a: number, b: number) => (b === 0 ? 0 : (a / b) & 255) /* div */,
      (a: number, b: number) => a ^ b /* xor */,
      (a: number, b: number) => ~a & b /* not */,
      (a: number, b: number, c: number) => ((a >> b) | (a << c)) & 255 /* bitwise */,
    ];
    function decrypt$(n: string): string {
      n = KAICODEX.safeAtob(n);
      const out = [];
      for (let i = 0; i < n.length; i++) {
        const fn = f[i % f.length];
        out.push(rfx[fn[0]](n.charCodeAt(i), fn[1], fn[2]));
      }
      return decodeURIComponent(String.fromCharCode(...out));
    }
    return { d: decrypt$, e: encrypt$ };
  })(),
  rc4: function (key: string, str: string): string {
    const s: number[] = [];
    let j = 0;
    let x: number;
    let res = '';
    for (let i = 0; i < 256; i++) {
      s[i] = i;
    }
    for (let i = 0; i < 256; i++) {
      j = (j + s[i] + key.charCodeAt(i % key.length)) % 256;
      x = s[i];
      s[i] = s[j];
      s[j] = x;
    }
    let i = 0;
    j = 0;
    for (let y = 0; y < str.length; y++) {
      i = (i + 1) % 256;
      j = (j + s[i]) % 256;
      x = s[i];
      s[i] = s[j];
      s[j] = x;
      res += String.fromCharCode(str.charCodeAt(y) ^ s[(s[i] + s[j]) % 256]);
    }
    return res;
  },
  reverseString: function (s: string): string {
    return s.split('').reverse().join('');
  },
  replaceChars: function (s: string, f: string, r: string): string {
    const i = f.length;
    const m: { [key: string]: string } = {};
    let index = i;
    while (index-- && (m[f[index]] = r[index])) {}
    return s
      .split('')
      .map(v => m[v] || v)
      .join('');
  },
  enc: function (n: string): string {
    return KAICODEX.homefn.e(n);
  },
  dec: function (n: string): string {
    return KAICODEX.homefn.d(n);
  },
  decMega: function (n: string): string {
    const B = KAICODEX.safeAtob;
    const y = KAICODEX.rc4;
    const L = KAICODEX.replaceChars;
    const z = KAICODEX.reverseString;
    n = y(
      '5JuOqt6PZH',
      B(
        z(
          L(
            z(
              L(
                y('gYXmZMti3aW7', B(z(L(y('VA3Y4Qj1DB', B(B(n))), 'cnifqMFatTbg', 'niMFfctgqbTa')))),
                'nhdEm2PHjwO5',
                '5HPwnOmdhjE2',
              ),
            ),
            'bYPIshuCg3DN',
            '3ubICsgNhDYP',
          ),
        ),
      ),
    );
    return decodeURIComponent(n);
  },
};

export class MegaUp {
  protected sources: ASource[] = [];
  // private decodingSteps: any[] | null = null;
  // private decodingStepsFetchPromise: Promise<void> | null = null;
  // private readonly decodingStepsUrl: string =
  //   'https://raw.githubusercontent.com/amarullz/kaicodex/refs/heads/main/generated/kai_codex.json';

  // #reverseIt = (n: string) => {
  //   return n.split('').reverse().join('');
  // };
  // #base64UrlEncode = (str: string): string => {
  //   return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  // };
  // #substitute = (input: string, keys: string, values: string) => {
  //   const map = Object.fromEntries(keys.split('').map((key, i) => [key, values[i] || '']));
  //   return input
  //     .split('')
  //     .map(char => map[char] || char)
  //     .join('');
  // };
  // #transform = (n: string, t: string) => {
  //   const v = Array.from({ length: 256 }, (_, i) => i);
  //   let c = 0;
  //   let f = '';
  //   for (let w = 0; w < 256; w++) {
  //     c = (c + v[w] + n.charCodeAt(w % n.length)) % 256;
  //     [v[w], v[c]] = [v[c], v[w]];
  //   }
  //   for (let a = 0, w = 0; a < t.length; a++) {
  //     w = (w + 1) % 256;
  //     c = (c + v[w]) % 256;
  //     [v[w], v[c]] = [v[c], v[w]];
  //     f += String.fromCharCode(t.charCodeAt(a) ^ v[(v[w] + v[c]) % 256]);
  //   }
  //   return f;
  // };
  // #base64UrlDecode = (base64Url: string): string => {
  //   let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  //   while (base64.length % 4) {
  //     base64 += '=';
  //   }
  //   return atob(base64);
  // };

  GenerateToken = (n: string) => {
    return KAICODEX.enc(n);
  };

  DecodeIframeData = (n: string) => {
    return KAICODEX.dec(n);
  };

  // private async fetchDecodingSteps(): Promise<void> {
  //   try {
  //     const response = await axios.get(this.decodingStepsUrl);
  //     if (!response.data?.megaup?.decrypt) {
  //       throw new Error('Failed to retrieve megaup decryption steps from the JSON.');
  //     }
  //     this.decodingSteps = response.data.megaup.decrypt;
  //   } catch (error) {
  //     console.error('Error fetching decoding steps:', error);
  //     this.decodingSteps = null;
  //   } finally {
  //     this.decodingStepsFetchPromise = null;
  //   }
  // }

  // async loadDecodingSteps(): Promise<void> {
  //   if (!this.decodingStepsFetchPromise) {
  //     this.decodingStepsFetchPromise = this.fetchDecodingSteps();
  //   }
  //   return this.decodingStepsFetchPromise;
  // }

  // OrderOfOperations = (encodedString: string, steps: any[]): string => {
  //   let decoded = encodedString;

  //   for (const step of steps) {
  //     const operation = step[0];

  //     try {
  //       switch (operation) {
  //         case 'safeb64_decode':
  //           decoded = this.#base64UrlDecode(decoded);
  //           break;
  //         case 'safeb64_encode':
  //           decoded = this.#base64UrlEncode(decoded);
  //           break;
  //         case 'reverse':
  //           decoded = this.#reverseIt(decoded);
  //           break;
  //         case 'substitute':
  //           decoded = this.#substitute(decoded, step[1], step[2]);
  //           break;
  //         case 'rc4':
  //           decoded = this.#transform(step[1], decoded);
  //           break;
  //         case 'urldecode':
  //           decoded = decodeURIComponent(decoded);
  //           break;
  //         case 'urlencode':
  //           decoded = encodeURIComponent(decoded);
  //           break;
  //         default:
  //           throw new Error(`Unknown operation: ${operation}`);
  //       }
  //     } catch (error) {
  //       console.error(`Error in step ${operation}:`, error);
  //       console.error('Current value:', decoded);
  //       throw error;
  //     }
  //   }
  //   return decoded;
  // };

  // Decode = (encodedString: string): string | null => {
  //   if (!this.decodingSteps) {
  //     throw new Error('Decoding steps not loaded. Call loadDecodingSteps() first.');
  //   }
  //   try {
  //     const decoded = this.OrderOfOperations(encodedString, this.decodingSteps);
  //     return decoded;
  //   } catch (e) {
  //     console.error('Decoding failed:', e);
  //     return null;
  //   }
  // };
  Decode = (n: string) => {
    return KAICODEX.decMega(n);
  };
  extract = async (videoUrl: URL) => {
    try {
      const url = videoUrl.href.replace(/\/(e|e2)\//, '/media/');
      const res = await axios.get(url, {
        headers: headers,
      });

      // await this.loadDecodingSteps();
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
