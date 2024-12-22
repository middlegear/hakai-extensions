import * as cheerio from "cheerio";
import { anitakuClient } from "../../../config";
import { anitakuSearchUrl } from "../../../utils/constants";
import { extractAnitakuSearchResults } from "./methods";

export async function searchAnime(query: string, page: number = 1) {
  if (!query)
    return {
      success: false,
      error: "Provide a query!",
    };
  try {
    const response = await anitakuClient.get(
      `${anitakuSearchUrl}?keyword=${encodeURIComponent(query)}&page=${page}`
    );
    const data$: cheerio.CheerioAPI = cheerio.load(response.data);
    const resSelector: cheerio.SelectorType =
      "div.last_episodes > ul.items > li";

    const data = extractAnitakuSearchResults(resSelector, data$);
    return {
      success: true,
      hasNextPage: data.hasNextPage,
      currentPage: data.currentPage,
      totalPages: data.totalPages,
      anime: data.resSearch,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unable to find search anime check the domain",
    };
  }
}
