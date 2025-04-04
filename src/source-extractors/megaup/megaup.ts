import axios from 'axios';
import { ASource } from '../../types/types';
import { headers } from '../../provider/anime/animekai/animekai';
//my gratitude goes to consumet
//extractor for https://animekai.to
//https://megaup.cc/assets/megaup/min/app.js
// https://megaup.cc/assets/megaup/min/app.js?v=195f6edfe51
// https://github.com/MelvinHK/consumet.ts
export class MegaUp {
  protected sources: ASource[] = [];

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
    let c = 0,
      f = '';

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
  Decode = (n: string) => {
    n = this.#transform(
      'A6mkJw3XMsruY',
      this.#base64UrlDecode(
        this.#substitute(
          this.#reverseIt(
            this.#reverseIt(
              this.#transform(
                'Sv7tijKFrwDxsl9',
                this.#base64UrlDecode(
                  this.#substitute(
                    this.#transform(
                      'j8971KLwSyI',
                      this.#base64UrlDecode(
                        this.#reverseIt(this.#substitute(this.#base64UrlDecode(`${n}`), 'kxV4iJtRZg3', 'VJx34RtgkZi')),
                      ),
                    ),
                    'BjZ9dF6AxHTqn',
                    'jxqZdB6n9FTHA',
                  ),
                ),
              ),
            ),
          ),
          'FpPBdhzCyGYoDvO',
          'YGFpvoBdCyDPhzO',
        ),
      ),
    );
    return decodeURIComponent(n);
  };
  extract = async (videoUrl: URL, customDecoder?: (n: string) => string) => {
    try {
      const url = videoUrl.href.replace(/\/(e|e2)\//, '/media/');
      const res = await axios.get(url, {
        // headers: headers,
      });

      const decrypted = JSON.parse(
        (customDecoder ? customDecoder(res.data.result) : this.Decode(res.data.result)).replace(/\\/g, ''),
      );
      const data = {
        sources: decrypted.sources.map((s: { file: string }) => ({
          url: s.file,
          isM3U8: s.file.includes('.m3u8') || s.file.endsWith('m3u8'),
        })),
        subtitles: decrypted.tracks.map((t: { kind: any; file: any }) => ({
          kind: t.kind,
          url: t.file,
        })),
        download: decrypted.download,
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
