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

  async fetch(data: cheerio.CheerioAPI) {
    const swishUrl = ScrapeSwishId(data) as string;
    const id = swishUrl.split('=').at(1);

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
      if (code && code.includes('eval(function(p,a,c,k,e,d)')) {
        packedScript = code;
      }
    });

    if (!packedScript) throw new Error('No packed script found.').message;
    return packedScript;
  }
  async extract(data: cheerio.CheerioAPI) {
    //
    const extractedData: ExtractedData = {
      subtitles: [],
      sources: [],
    };

    try {
      const evaluate = await this.fetch(data);
      const final = unpack(evaluate);

      const linksRegex = /var links=({.+?});/;
      const linksMatch = final?.match(linksRegex);

      if (!linksMatch || !linksMatch[1]) {
        throw new Error('Could not find the links object.').message;
      }

      const linksJsonString = linksMatch[1];
      let linksObject;
      try {
        linksObject = JSON.parse(linksJsonString);
      } catch (e) {
        console.error('Failed to parse the links object JSON:', e);
        return;
      }

      const domain = this.baseUrl;

      for (const key in linksObject) {
        if (linksObject.hasOwnProperty(key) && linksObject[key]) {
          let url = linksObject[key];

          if (url.includes('.m3u8')) {
            if (url.startsWith('/')) {
              url = `${domain}${url}`;
            }

            extractedData.sources.push({
              url: url,
              isM3U8: url.includes('m3u8'),
              type: url.includes('m3u8') ? 'hls' : 'raise issue for investigation',
              default: url.includes(domain),
            });
          }
        }
      }

      const subtitleMatches = final?.match(/{file:"([^"]+)",(label:"([^"]+)",)?kind:"(thumbnails|captions)"/g) || [];

      extractedData.subtitles = subtitleMatches.map(item => {
        const lang = item?.match(/label:"([^"]+)"/)?.[1] ?? '';
        const url = item?.match(/file:"([^"]+)"/)?.[1] ?? '';
        const kind = item?.match(/kind:"([^"]+)"/)?.[1] ?? '';
        if (kind.includes('thumbnail')) {
          return {
            lang: kind,
            url: `https://streamhg.com${url}`,
          };
        }
        return {
          lang: lang,
          url: url,
        };
      });
      return extractedData;
    } catch (error) {
      return error instanceof Error ? error.message : 'Fatal Error';
    }
  }
}
export default TwoEmbed;
