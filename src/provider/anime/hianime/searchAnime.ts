import * as cheerio from "cheerio";
import { zoroClient } from "../../../config";
import { zoroSearch } from "../../../utils/constants";
import { extractSearchResults } from "./methods";
import type { scrappedAnime, Error } from "./types";

export async function searchAnime(
  query: string,
  page?: number
): Promise<scrappedAnime | Error> {
  if (!query)
    return {
      success: false,
      error: "Please enter a valid id",
    };

  query = query.trim() ? decodeURIComponent(query.trim()) : "";

  if (page === undefined) {
    page = 1;
  }
  try {
    const response = await zoroClient.get(
      `${zoroSearch}?keyword=${query}&page=${page as number}`
    );
    const $data = cheerio.load(response.data);
    const searchSelector: cheerio.SelectorType =
      ".block_area-content .film_list-wrap .flw-item";
    const data = extractSearchResults($data, searchSelector);
    // console.log(data);

    return data;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "unknown",
    };
  }
}
