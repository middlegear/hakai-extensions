import { unpack } from '../utils/unpacker.js';

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

class StreamWish {
  private readonly baseUrl: string = 'https://yesmovies.baby';

  async extract(data: string): Promise<ExtractedData | string> {
    //
    const extractedData: ExtractedData = {
      subtitles: [],
      sources: [],
    };
    if (!data) throw new Error('Missing data to unpack').message;
    try {
      const final = unpack(data);

      const linksRegex = /var links=({.+?});/;
      const linksMatch = final?.match(linksRegex);

      if (!linksMatch || !linksMatch[1]) {
        throw new Error('Could not find the links object.').message;
      }

      const linksJsonString = linksMatch[1];
      let linksObject;

      linksObject = JSON.parse(linksJsonString);

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
export default StreamWish;
