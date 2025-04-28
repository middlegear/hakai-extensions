import axios from 'axios';
import { ASource } from '../../types/types';
import { headers } from '../../provider/anime/animekai/animekai';

interface IKaiCodex {
  enc: (n: string) => string;
  dec: (n: string) => string;
  decMega: (n: string) => string;
}

export class MegaUp {
  protected sources: ASource[] = [];
  private kaiCodex: IKaiCodex | null = null;
  private isKaiCodexLoaded = false;

  constructor() {
    this.loadKaiCodex();
  }

  async loadKaiCodex() {
    try {
      const response = await axios.get(
        'https://raw.githubusercontent.com/amarullz/kaicodex/refs/heads/main/generated/kai_codex.js',
      );

      const loadCode = new Function(`
        ${response.data}
        return KAICODEX;
      `);

      this.kaiCodex = loadCode() as IKaiCodex;
      this.isKaiCodexLoaded = true;
      console.log('KaiCodex loaded successfully.');
    } catch (error) {
      console.error('Failed to load KaiCodex:', error);
      this.isKaiCodexLoaded = false;
    }
  }

  GenerateToken = (n: string): string => {
    if (!this.kaiCodex) {
      console.warn('KaiCodex not loaded yet.');
      return '';
    }
    return this.kaiCodex.enc(n);
  };

  DecodeIframeData = (n: string): string => {
    if (!this.kaiCodex) {
      console.warn('KaiCodex not loaded yet.');
      return '';
    }
    return this.kaiCodex.dec(n);
  };

  Decode = (n: string): string => {
    if (!this.kaiCodex) {
      console.warn('KaiCodex not loaded yet.');
      return '';
    }
    return this.kaiCodex.decMega(n);
  };

  extract = async (videoUrl: URL) => {
    try {
      if (!this.isKaiCodexLoaded) {
        throw new Error('KaiCodex is not loaded yet.');
      }
      const url = videoUrl.href.replace(/\/(e|e2)\//, '/media/');
      const res = await axios.get(url, {
        headers: headers,
      });

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
