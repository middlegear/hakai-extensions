import * as cheerio from "cheerio";
import { animeZClient } from "../../../config";

import { extractAnimeZResults } from "./methods";
import { animeZBaseUrl } from "../../../utils/constants";

export async function searchAnime(query: string, page: number = 1) {
  if (!query)
    return {
      success: false,
      error: "query cannot be empty",
    };

  try {
    const modifiedString = query
      .replace(/season\s*\d+/gi, "") // Remove "season" and numbers after it
      .replace(/[;:]/g, "") // Remove semicolons and colons
      .replace(/\d+/g, "") // Remove all numbers
      .trim();
    const response = await animeZClient.get(
      `${animeZBaseUrl}/?act=search&f[status]=all&f[sortby]=lastest-chap&f[keyword]=${modifiedString}&&pageNum=${page}#pages`,
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

    return {
      hasNextPage: data.hasNextPage,
      totalPages: data.totalPages,
      currentPage: data.currentPage,
      anime: data.anime,
    };
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
export async function searchSuggestions(query: string) {
  if (!query)
    return {
      success: false,
      error: "query cannot be empty",
    };
  try {
    const modifiedString = query
      .replace(/season\s*\d+/gi, "") // Remove "season" and numbers after it
      .replace(/[;:]/g, "") // Remove semicolons and colons
      .replace(/\d+/g, "") // Remove all numbers
      .trim();

    const res = await animeZClient.get(
      `
      ${animeZBaseUrl}/?act=ajax&code=search_manga&keyword=${modifiedString}`,
      {
        headers: {
          Referer: `${animeZBaseUrl}/?act=search&f[status]=all&f[sortby]=lastest-chap&f[keyword]=${modifiedString}`,
        },
      }
    );

    const $: cheerio.CheerioAPI = cheerio.load(res.data);

    const suggestion: {
      id: string | null;
      title: string | null;
      posterImage: string | null;
      alternatives: string | null;
    }[] = [];

    $("li").each((_, element) => {
      suggestion.push({
        id: $(element).find("a").attr("href")?.split("/").at(1)?.trim() || null,
        title: $(element)?.find("img")?.attr("alt") || null,
        posterImage:
          `${animeZBaseUrl}/${$(element).find("img").attr("src")}` || null,
        alternatives:
          $(element)?.find("h4 i").first().text().replace(/;|,/g, ",") || null,
      });
    });

    return {
      anime: suggestion,
    };
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
