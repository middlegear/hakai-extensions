// @ts-nocheck

import axios from 'axios';
import { headers } from '../../provider/anime/animekai/animekai';

export class StrictDeobfuscator {
  private static readonly RC4_KEYS = {
    complex: 'QKbVomcBHysCW9',
    intermediate: 'PgiY5eIZWn',
    base: '3U8XtHJfgam02k',
  };

  private static readonly CHAR_MAPS = {
    first: ['IM7Am4D2yYHctL', '7DtY4mHcMA2yIL'] as [string, string],
    second: ['rXEsS3nbjhUd', 'rXjnhU3SsbEd'] as [string, string],
    third: ['Go1UiY82st0Oa', '0GsO8otUi21aY'] as [string, string],
  };

  /**
   * RC4 Algorithm (identical to original 'e' function)
   */
  private static rc4(key: string, data: string): string {
    const sbox = Array.from({ length: 256 }, (_, i) => i);
    let i = 0,
      j = 0,
      temp: number;
    let result = '';

    // Key scheduling
    for (i = 0; i < 256; i++) {
      j = (j + sbox[i] + key.charCodeAt(i % key.length)) % 256;
      temp = sbox[i];
      sbox[i] = sbox[j];
      sbox[j] = temp;
    }

    // Data processing
    i = j = 0;
    for (let k = 0; k < data.length; k++) {
      i = (i + 1) % 256;
      j = (j + sbox[i]) % 256;
      temp = sbox[i];
      sbox[i] = sbox[j];
      sbox[j] = temp;
      result += String.fromCharCode(data.charCodeAt(k) ^ sbox[(sbox[i] + sbox[j]) % 256]);
    }

    return result;
  }

  /**
   * URL-safe Base64 decode (original 'f67' function)
   */
  private static base64UrlDecode(str: string): string {
    let output = str;
    const padLength = 4 - (output.length % 4);
    if (padLength < 4) {
      output += '='.repeat(padLength);
    }
    return atob(output.replace(/-/g, '+').replace(/_/g, '/'));
  }

  /**
   * Character substitution (original 'f68' function)
   */
  private static substituteChars(input: string, fromChars: string, toChars: string): string {
    const subMap: Record<string, string> = {};
    for (let i = fromChars.length - 1; i >= 0; i--) {
      subMap[fromChars[i]] = toChars[i] || '';
    }
    return input
      .split('')
      .map(c => subMap[c] || c)
      .join('');
  }

  /**
   * String reversal (original 'f69' function)
   */
  private static reverseString(str: string): string {
    return str.split('').reverse().join('');
  }

  /**
   * Main deobfuscation (original 'f71'/'g' function)
   */
  public static deobfuscate(encryptedData: string): string {
    // Step-by-step reversal of the original obfuscation process
    const step1 = this.base64UrlDecode(`${encryptedData}`);
    const step2 = this.reverseString(step1);
    const step3 = this.base64UrlDecode(step2);
    const step4 = this.rc4(this.RC4_KEYS.complex, step3);
    const step5 = this.reverseString(step4);
    const step6 = this.substituteChars(step5, ...this.CHAR_MAPS.third);
    const step7 = this.base64UrlDecode(this.base64UrlDecode(step6));
    const step8 = this.rc4(this.RC4_KEYS.intermediate, step7);
    const step9 = this.substituteChars(step8, ...this.CHAR_MAPS.second);
    const step10 = this.reverseString(step9);
    const step11 = this.rc4(this.RC4_KEYS.base, step10);
    const step12 = this.substituteChars(step11, ...this.CHAR_MAPS.first);

    return decodeURIComponent(step12);
  }

  /**
   * URL parameter parsing (original 'h' function)
   */
  public static parseUrlParam(param: string, defaultValue?: any) {
    const match = new RegExp(`[?&]${param}(=([^&$]+))?`).exec(window.location.search);
    let value = match?.[2] ? decodeURIComponent(decodeURI(match[2])) : match ? '' : null;

    if (value !== null && defaultValue !== undefined) {
      if (/^(1|true|yes)$/i.test(value)) value = true;
      else if (/^(0|false|no)$/i.test(value)) value = false;
    }

    return value;
  }

  extract = async (videoUrl: URL) => {
    try {
      const url = videoUrl.href.replace(/\/(e|e2)\//, '/media/');
      const res = await axios.get(url, {
        headers: headers,
      });

      const decrypted = JSON.parse(StrictDeobfuscator.deobfuscate(res.data.result).replace(/\\/g, ''));
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
