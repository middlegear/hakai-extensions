import * as cheerio from "cheerio";
import {
  subOrDub,
  type AnimeInfo,
  type animeSearch,
  type downloadUrl,
  type EpisodeInfo,
  type Servers,
  type Sources,
} from "./types";

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
export function anitaku_extractAnimeInfo(
  $: cheerio.CheerioAPI,
  selector: cheerio.SelectorType
) {
  try {
    const animeInfo: AnimeInfo = {
      id: null,
      title: null,
      altTitle: null,
      type: null,
      subOrDub: null,
      posterImage: null,
      description: null,
      releaseDate: null,
      currentStatus: null,
    }; /// remember to scrape for genres its buggy

    animeInfo.title =
      $(selector)?.find("div.anime_info_body_bg > h1").text().trim() || null;
    animeInfo.posterImage =
      $(selector)?.find("div.anime_info_body_bg > img")?.attr("src") || null;
    animeInfo.altTitle =
      $(selector)
        ?.find("div.anime_info_body_bg > p.type.other-name > a")
        ?.attr("title") || null;
    const animeIdselector = $(
      "div.main_body > div.anime_info_body > div.anime_info_episodes > div.anime_info_episodes_next > input#alias_anime.alias_anime"
    )?.attr("value");
    animeInfo.id = animeIdselector || null;
    animeInfo.description =
      $(selector)
        ?.find("div.anime_info_body_bg > div.description")
        ?.text()
        ?.trim() || null;
    animeInfo.releaseDate =
      Number(
        $(selector)
          ?.find("div.anime_info_body_bg >  p:nth-child(8)")
          ?.text()
          ?.split(":")
          ?.at(-1)
          ?.trim()
      ) || null;

    animeInfo.currentStatus =
      $(selector)
        ?.find("div.anime_info_body_bg > p:nth-child(9) > a")
        ?.text()
        ?.trim() || null;
    animeInfo.type =
      $(selector)?.find("div.anime_info_body_bg > p.type > a")?.attr("title") ||
      null;
    animeInfo.subOrDub = animeIdselector?.toLowerCase()?.includes("dub")
      ? subOrDub.DUB
      : subOrDub.SUB || null;

    const MovieId: cheerio.SelectorType =
      "div.anime_info_body > div.anime_info_episodes > div.anime_info_episodes_next";

    const movieId =
      Number($(MovieId).find("input#movie_id.movie_id").attr("value")) || null;

    return {
      animeInfo,
      // movieId,
    };
  } catch (error) {}
}

export function anitakuExtractEpisodes($: cheerio.CheerioAPI) {
  const resEpisodes: EpisodeInfo[] = [];

  const selector: cheerio.SelectorType = "ul#episode_related > li";
  $(selector).each((_, element) => {
    resEpisodes.push({
      id: $(element)?.find("a")?.attr("href")?.split("/").at(1)?.trim() || null,
      name: $(element).find("div.name").text().trim().toLowerCase(),
      number:
        Number(
          $(element)?.find("a")?.attr("href")?.split("-").at(-1)?.trim()
        ) || null,
      category: $(element).find("div.cate").text().trim().toLowerCase(),
    });
  });

  return resEpisodes.reverse();
}

export function anitakuExtractServers(
  $: cheerio.CheerioAPI,
  selector: cheerio.SelectorType
) {
  const servers: Servers[] = [];
  $(selector).each((_, element) => {
    servers.push({
      name:
        $(element)
          ?.find(" a ")
          ?.text()
          .trim()
          .replace("Choose this server", " ")
          .toLowerCase() || null,
      serverId: Number($(element).find("a").attr("rel")) || null,
    });
  });
  return servers;
}

// export function anitakuExtractDownloadSrc($: cheerio.CheerioAPI) {
//   const sources: downloadUrl = {
//     downloadUrl: null,
//     iframe: null,
//   };

//   sources.downloadUrl =
//     $("div.favorites_book > ul > li.dowloads").find("a").attr("href") || null;
//   sources.iframe =
//     $("div.anime_video_body_watch_items.load > div.play-video")
//       .find("iframe")
//       .attr("src") || null;

//   return {
//     sources,
//   };
// }
