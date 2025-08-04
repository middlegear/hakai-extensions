import type { CheerioAPI } from 'cheerio';
import { ScrapeCloudStreampro } from '../provider/movies/vidsrc/scraper.js';

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
class CloudStreamPro {
  //
  extract(data: CheerioAPI) {
    //
    const extractedData: ExtractedData = {
      subtitles: [],
      sources: [],
    };

    const result = ScrapeCloudStreampro(data);

    return result;
  }
}

export default CloudStreamPro;
