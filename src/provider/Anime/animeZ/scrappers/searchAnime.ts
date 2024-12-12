import { animeZClient } from "../../../../config";
import { extractAnimeZResults } from "../utils/animeZmethods";
import { animeZBaseUrl } from "../utils/constants";
import * as cheerio from "cheerio";
export async function searchAnime(query: string, page?: number) {
  try {
    if (query === undefined) {
      throw new Error(" query cannot be empty");
    }
    if (page === undefined) {
      page = 1;
    }
    const response = await animeZClient.get(
      `${animeZBaseUrl}/?act=search&f[status]=all&f[sortby]=lastest-chap&f[keyword]=${encodeURIComponent(
        query
      )}&&pageNum=${page}#pages`
    );
    const data$: cheerio.CheerioAPI = cheerio.load(response.data);
    const selector: cheerio.SelectorType =
      "main > section > ul.MovieList.Rows.AX.A06.B04.C03.E20 > li.TPostMv";

    const data = extractAnimeZResults(data$, selector);
    console.log(data);
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "check the URL youre scraping from ",
    };
  }
}
searchAnime("blue");
