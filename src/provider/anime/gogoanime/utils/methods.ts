import * as cheerio from "cheerio";
import { subOrDub, type animeSearch, type pagination } from "./types";

export function extractAnitakuSearchResults(
  selector: cheerio.SelectorType,
  $: cheerio.CheerioAPI
) {
  try {
    const resSearch: animeSearch[] = [];
    $(selector).each((_, element) => {
      resSearch.push({
        id:
          $(element)?.find("div.img > a")?.attr("href")?.split("/").pop() ||
          null,
        title: $(element)?.find("p.name > a")?.attr("title") || null,
        posterImage: $(selector).find("div.img > a > img").attr("src") || null,
        //   release_year: $(selector)?.find("li > p.released")?.text().trim() || null, find a fix laters
        subOrDub: $(element)
          .find("p.name > a")
          .text()
          .toLocaleLowerCase()
          .includes("dub")
          ? subOrDub.DUB
          : subOrDub.SUB || null,
      });
    });

    const paginationSelector: cheerio.SelectorType =
      "div.anime_name_pagination > div.pagination > ul.pagination-list > li ";
    let hasNextPage, totalPages, currentPage;
    hasNextPage =
      ($(`${paginationSelector}`).next().length > 0 &&
        $(paginationSelector).last().text().length > 0) ||
      false;
    currentPage =
      Number(
        $(`${paginationSelector}.selected`)?.find("a")?.attr("data-page")
      ) || 1;

    totalPages = Number($(paginationSelector).last().text()) || 1;
    const pageInfo = {
      hasNextPage,
      currentPage,
      totalPages,
    };
    return { resSearch, pageInfo };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unable to scrap ",
    };
  }
}
