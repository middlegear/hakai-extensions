import { zoroSearch } from "../utils/constants";

import * as cheerio from "cheerio";
import { extractSearchResults } from "../utils/methods";
import { zoroclient } from "../../../../config/zoroclient";

export async function search(query: string, page?: number) {
  if (!query) {
    throw new Error("Enter a valid search query");
  }
  query = query.trim() ? decodeURIComponent(query.trim()) : "";

  if (page === undefined) {
    page = 1;
  }
  try {
    console.time("scraping time");
    const response = await zoroclient.get(
      `${zoroSearch}?keyword=${query}&page=${page as number}`
    );
    const $data = cheerio.load(response.data);
    const searchSelector: cheerio.SelectorType =
      ".block_area-content .film_list-wrap .flw-item";
    const data = extractSearchResults($data, searchSelector);
    console.log(data);

    return data;
  } catch (error) {
    console.log(error);
  } finally {
    console.timeEnd("scraping time");
  }
}
