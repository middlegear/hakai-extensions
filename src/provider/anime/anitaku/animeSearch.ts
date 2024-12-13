import * as cheerio from "cheerio";
import { anitakuClient } from "../../../config";
import { anitakuSearchUrl } from "../../../utils/constants";
import { extractAnitakuSearchResults } from "./methods";
export async function searchAnime(query: string, page: number = 1) {
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
    return searchData;
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Unable to find search anime check the domain",
    };
  }
}
