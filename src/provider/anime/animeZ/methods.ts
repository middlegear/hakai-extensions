import * as cheerio from "cheerio";

import type { anime, animeInfo } from "./types";
import { animeZBaseUrl } from "../../../utils/constants";
import { Dubbing } from "../hianime/types";

export function extractAnimeZResults(
  $: cheerio.CheerioAPI,
  selector: cheerio.SelectorType
) {
  try {
    const animeInfo: anime[] = [];
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

export function extractAnimeZInfo($: cheerio.CheerioAPI) {
  const selector1: cheerio.SelectorType = " div.Content > div.TpRwCont";
  const animeInfo: animeInfo = {
    id: null,
    title: null,
    posterImage: null,
    href: null,
  };

  animeInfo.title = $(selector1).find("h2").text().trim() || null;
  animeInfo.posterImage =
    `${animeZBaseUrl}/${$(selector1)
      .find("img.attachment-img-mov-md.size-img-mov-md.wp-post-image")
      .attr("src")}` || null;
  const href = $(selector1).find("a.text-info").attr("href");
  animeInfo.href = href || null;
  animeInfo.id = href?.split("/").at(-2) || null;

  const episodes: {
    id: string | null;
    number: string | null;
    category: string | null;
  }[] = [];

  const episodesSelector: cheerio.SelectorType =
    "ul#list_chapter_id_detail > li.wp-manga-chapter  ";
  $(episodesSelector).each((_, element) => {
    episodes.push({
      id:
        $(element)
          .find("a")
          .attr("href")
          ?.replace(/^\/|\/$/g, "") || null,

      number: $(element).find("a").text().trim() || null,
      category: $(element).find("a").text().split("-").includes("Dub")
        ? Dubbing.Dub
        : Dubbing.Sub || null,
    });
  });
  episodes.reverse();
  return episodes;
}
