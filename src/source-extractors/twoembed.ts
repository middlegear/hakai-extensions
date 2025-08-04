import { URL } from 'url';
import { providerClient } from '../config/clients.js';
import { ScrapeSwishId } from '../provider/movies/vidsrc/scraper.js';
import { unpack } from '../utils/unpacker.js';
import * as cheerio from 'cheerio';

export type sources = {
  url: string;
  isM3U8: boolean;
  type: string;
  default?: boolean;
};

export type subtitles = {
  url: string;
  lang: string;
};

export type ExtractedData = {
  subtitles: subtitles[];
  sources: sources[];
};

class TwoEmbed {
  private readonly baseUrl: string = 'https://yesmovies.baby';

  async fetch(data: cheerio.CheerioAPI): Promise<string> {
    const swishUrl = ScrapeSwishId(data);
    if (!swishUrl || typeof swishUrl !== 'string') {
      throw new Error('Invalid swishUrl from ScrapeSwishId').message;
    }

    const id = swishUrl.split('=').at(1);
    if (!id) {
      throw new Error(`Invalid swishUrl format: ${swishUrl}`).message;
    }

    const referer = new URL(swishUrl);
    const response = await providerClient(`${this.baseUrl}/e/${id}`, {
      headers: {
        Referer: `${referer.origin}/`,
      },
    });

    const data$ = cheerio.load(response.data);
    let packedScript: string | null = null;

    data$('script').each((_, el) => {
      const code = data$(el).html();
      if (code?.includes('eval(function(p,a,c,k,e,d)')) {
        packedScript = code;
      }
    });

    if (!packedScript) {
      throw new Error('No packed script found.');
    }

    return packedScript;
  }

  async extract(data: cheerio.CheerioAPI): Promise<ExtractedData | string> {
    const extractedData: ExtractedData = {
      subtitles: [],
      sources: [],
    };

    try {
      const evaluate = await this.fetch(data);
      const final = unpack(evaluate);

      if (!final) {
        throw new Error('Unpacking failed or returned empty.');
      }

      const linksRegex = /var\s+links\s*=\s*({.+?});/;
      const linksMatch = final.match(linksRegex);

      if (!linksMatch || !linksMatch[1]) {
        throw new Error('Could not find the links object.');
      }

      let linksObject: Record<string, string>;
      try {
        linksObject = JSON.parse(linksMatch[1]);
      } catch {
        throw new Error('Failed to parse links JSON.');
      }

      const domain = this.baseUrl;

      for (const key in linksObject) {
        if (!Object.prototype.hasOwnProperty.call(linksObject, key)) continue;

        const rawUrl = linksObject[key];
        if (typeof rawUrl !== 'string') continue;

        let url = rawUrl;
        if (!url.includes('.m3u8')) continue;

        if (url.startsWith('/')) {
          url = `${domain}${url}`;
        }

        extractedData.sources.push({
          url,
          isM3U8: true,
          type: 'hls',
          default: url.includes(domain),
        });
      }

      const subtitleMatches = final.match(/{file:"([^"]+)",(label:"([^"]+)",)?kind:"(thumbnails|captions)"/g) || [];

      extractedData.subtitles = subtitleMatches
        .map(item => {
          const lang = item?.match(/label:"([^"]+)"/)?.[1] ?? '';
          const url = item?.match(/file:"([^"]+)"/)?.[1] ?? '';
          const kind = item?.match(/kind:"([^"]+)"/)?.[1] ?? '';

          const isThumbnail = kind.includes('thumbnail');

          return {
            lang: lang || kind,
            url: isThumbnail ? `https://streamhg.com${url}` : url,
          };
        })
        .filter(sub => !!sub.url);

      return extractedData;
    } catch (error) {
      return error instanceof Error ? error.message : 'Fatal Error';
    }
  }
}

export default TwoEmbed;
