import { anitakuSearchUrl } from "../utils/constants";
import { anitakuClient } from "../../../../config/gogoanimeclient";
import * as cheerio from "cheerio";
import { extractAnitakuSearchResults } from "../utils/methods";
export async function getAnimeSearch(query: string, page: number = 1) {
  try {
    if (!query) {
      throw new Error(" Search query is needed");
    }
    const response = await anitakuClient.get(
      `${anitakuSearchUrl}?keyword=${encodeURIComponent(query)}&page=${page}`
    );
    const data$: cheerio.CheerioAPI = cheerio.load(response.data);
    const resSelector: cheerio.SelectorType =
      "div.last_episodes > ul.items > li";

    const searchData = extractAnitakuSearchResults(resSelector, data$);
    console.log(searchData);
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Unable to find search anime check the domain",
    };
  }
}
getAnimeSearch("bleach");
