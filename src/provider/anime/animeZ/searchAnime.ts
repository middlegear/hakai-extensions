import * as cheerio from "cheerio";
import { animeZClient } from "../../../config";

import { extractAnimeZResults } from "./methods";
import { animeZBaseUrl } from "../../../utils/constants";
export async function searchAnime(query: string, page?: number) {
  if (!query)
    return {
      success: false,
      error: "query cannot be empty",
    };
  if (page === undefined) {
    page = 1;
  }
  try {
    const response = await animeZClient.get(
      `${animeZBaseUrl}/?act=search&f[status]=all&f[sortby]=lastest-chap&f[keyword]=${encodeURIComponent(
        query
      )}&&pageNum=${page}#pages`,
      {
        headers: {
          Referer: `${animeZBaseUrl}/?act=search&f[status]=all&f[sortby]=lastest-chap&f[keyword]=${query}&&pageNum=${page}`,
        },
      }
    );
    const data$: cheerio.CheerioAPI = cheerio.load(response.data);
    const selector: cheerio.SelectorType =
      "main > section > ul.MovieList.Rows.AX.A06.B04.C03.E20 > li.TPostMv";

    const data = extractAnimeZResults(data$, selector);
    console.log(data);
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "check the URL youre scraping from ",
    };
  }
}
searchAnime("bleach");
