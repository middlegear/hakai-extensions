import * as cheerio from "cheerio";
import { animeZBaseUrl } from "./constants";
import { Dubbing } from "../../hianime/utils/hianimetypes";
import type { animeInfo } from "./types";

export function extractAnimeZResults(
  $: cheerio.CheerioAPI,
  selector: cheerio.SelectorType
) {
  try {
    const animeInfo: animeInfo[] = [];
    $(selector).each((_, element) => {
      animeInfo.push({
        id: $(element).find("a").attr("href")?.split("/").at(1)?.trim() || null,
        title: $(element)?.find("a")?.attr("title") || null,
        posterImage:
          `${animeZBaseUrl}/${$(element)
            .find("div.Image > figure > img")
            .attr("src")}` || null,
        episodes:
          Number(
            $(element)
              .find("div.Image > span.mli-eps")
              .text()
              .trim()
              .split("-")
              .at(0)
          ) || null,
        dub: $(element)
          .find("div.Image > span.mli-eps")
          .text()
          .trim()
          .split("-")
          .at(1)
          ? Dubbing.Dub
          : Dubbing.Sub,
      });
    });
    let hasNextPage, totalPages, currentPage;
    //// for total pages select the last list item and extract the number in pageNumber in  anchor  href
    const pageSelector: cheerio.SelectorType =
      " div.Bot.text-center > nav > ul.pagination";
    currentPage =
      Number(
        $(pageSelector).find("li.page-item.active > a.page-link").text()
      ) || 1;
    totalPages =
      Number(
        $(pageSelector)
          .find("li.page-item >a.page-link")
          .last()
          .attr("href")
          ?.split("=")
          .at(-1)
          ?.split("#")
          .at(0)
      ) || 1;
    hasNextPage = totalPages > 1 ? true : false;
    // const pagination = {
    //   hasNextPage,
    //   currentPage,
    //   totalPages,
    // };
    return {
      hasNextPage,
      currentPage,
      totalPages,
      animeInfo,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown Error",
    };
  }
}
