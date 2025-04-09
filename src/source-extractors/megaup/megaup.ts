import axios from 'axios';
import { ASource } from '../../types/types';
import { headers } from '../../provider/anime/animekai/animekai';

export class MegaUp {
  protected sources: ASource[] = [];
  private decodingSteps: any[] | null = null;
  private decodingStepsFetchPromise: Promise<void> | null = null;
  private readonly decodingStepsUrl: string =
    'https://raw.githubusercontent.com/amarullz/kaicodex/refs/heads/main/generated/kai_codex.json';

  #reverseIt = (n: string) => {
    return n.split('').reverse().join('');
  };
  #base64UrlEncode = (str: string) => {
    return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  };
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
  #base64UrlDecode = (n: string) => {
    n = n
      .padEnd(n.length + ((4 - (n.length % 4)) % 4), '=')
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    return atob(n);
  };

  GenerateToken = (n: string) => {
    n = encodeURIComponent(n);
    return (n = this.#base64UrlEncode(
      this.#substitute(
        this.#base64UrlEncode(
          this.#transform(
            'sXmH96C4vhRrgi8',
            this.#reverseIt(
              this.#reverseIt(
                this.#base64UrlEncode(
                  this.#transform(
                    'kOCJnByYmfI',
                    this.#substitute(
                      this.#substitute(
                        this.#reverseIt(this.#base64UrlEncode(this.#transform('0DU8ksIVlFcia2', n))),
                        '1wctXeHqb2',
                        '1tecHq2Xbw',
                      ),
                      '48KbrZx1ml',
                      'Km8Zb4lxr1',
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
        'hTn79AMjduR5',
        'djn5uT7AMR9h',
      ),
    ));
  };

  DecodeIframeData = (n: string) => {
    n = `${n}`;
    n = this.#transform(
      '0DU8ksIVlFcia2',
      this.#base64UrlDecode(
        this.#reverseIt(
          this.#substitute(
            this.#substitute(
              this.#transform(
                'kOCJnByYmfI',
                this.#base64UrlDecode(
                  this.#reverseIt(
                    this.#reverseIt(
                      this.#transform(
                        'sXmH96C4vhRrgi8',
                        this.#base64UrlDecode(this.#substitute(this.#base64UrlDecode(n), 'djn5uT7AMR9h', 'hTn79AMjduR5')),
                      ),
                    ),
                  ),
                ),
              ),
              'Km8Zb4lxr1',
              '48KbrZx1ml',
            ),
            '1tecHq2Xbw',
            '1wctXeHqb2',
          ),
        ),
      ),
    );
    return decodeURIComponent(n);
  };
  private async fetchDecodingSteps(): Promise<void> {
    try {
      const response = await axios.get(this.decodingStepsUrl, { headers: headers });
      if (!response.data?.megaup?.decrypt) {
        throw new Error('Failed to retrieve megaup decryption steps from the JSON.');
      }
      this.decodingSteps = response.data.megaup.decrypt;
      // console.log(this.decodingSteps);
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

  decodeFromSteps = (encodedString: string, steps: any[]): string => {
    let decoded = encodedString;

    for (const step of steps) {
      const operation = step[0];
      // console.log(`Applying ${operation} to: ${decoded.substring(0, 50)}...`);

      try {
        switch (operation) {
          case 'safeb64_decode':
            decoded = this.#base64UrlDecode(decoded);
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
      const decoded = this.decodeFromSteps(encodedString, this.decodingSteps);
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

      if (!res.data) {
        return {
          status: res.status,
          success: res.status === 200,
          error: res.statusText || 'Scraper Error: No M3U8 found',
          data: null,
        };
      }
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          status: error.response?.status || 500,
          data: null,
          error: `Request failed: ${error.message}` || 'Unknown axios error',
          success: false,
        };
      }
      return {
        success: false,
        status: 500,
        data: null,
        error: error instanceof Error ? ` Request failed: ${error.message}` : 'Contact dev if you see this',
      };
    }
  };
}
