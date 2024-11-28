import { client } from "../../config/client";
import { zoroSearch } from "../zoroUtils/zoroconstants";

import * as cheerio from "cheerio";
import { extractSearchResults } from "../zoroUtils/methods";

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
    const response = await client.get(
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
