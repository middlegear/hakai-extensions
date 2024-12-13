///

import * as cheerio from "cheerio";
import type {
  Anime,
  AnimeInfo,
  EpisodeInfo,
  language,
  ScrappedServers,
} from "./types";
// import type { pageInfo } from "../anitaku/types";

export function extractSearchResults(
  $: cheerio.CheerioAPI,
  selector: cheerio.SelectorType
) {
  const anime: Anime[] = [];

  $(selector).each((_, element) => {
    const id = $(element)
      .find(".film-detail .film-name .dynamic-name")
      .attr("href")
      ?.slice(1)
      ?.split("?ref=search")
      .at(0)
      ?.trim();

    anime.push({
      id: id || null,
      name:
        $(element)
          .find(".film-detail .film-name .dynamic-name")
          .text()
          .trim() || null,
      japaneseName:
        $(element)
          .find(".film-detail .film-name .dynamic-name")
          .attr("data-jname") || null,
      posterImage:
        $(element).find(" .film-poster .film-poster-img").attr("data-src") ||
        null,
      url:
        $(element).find(".film-detail .film-name .dynamic-name").attr("href") ||
        null,
      duration:
        $(element).find(".fd-infor .fdi-item.fdi-duration").text().trim() ||
        null,
      type:
        $(element).find(".fd-infor .fdi-item:nth-of-type(1)").text().trim() ||
        null,
      rating:
        $(element).find(".film-poster .tick.tick-rate").text().trim() || null,
      episodes: {
        sub: Number($(element).find(".film-poster .tick .tick-sub").text()),
        dub: Number($(element).find(".film-poster .tick .tick-dub").text()),
      },
    });
  });

  const paginationElement = $(".pre-pagination .pagination .page-item");

  // hasNextPage = paginationElement.last().hasClass("active");
  // totalPages = !hasNextPage
  //   ? paginationElement
  //       .last()
  //       .find(".page-link")
  //       .attr("href")
  //       ?.split("page=")
  //       .at(-1)
  //   : Number(paginationElement.last().find(".page-link").text());

  const hasNextPage: boolean =
    ($(".pagination > li").length > 0 &&
      $(".pagination li.active").length > 0 &&
      !$(".pagination > li").last().hasClass("active")) ||
    false;
  const currentPage: number | null =
    Number(
      $(paginationElement).find(".active .page-link").text().trim() || 1
    ) || null;
  const totalPages: number | null =
    Number(
      paginationElement
        .find('a.page-link[title="Last"]')
        .attr("href")
        ?.split("page=")
        .at(-1) || 1
    ) || null;

  return {
    success: true,
    hasNextPage,
    currentPage,
    totalPages,
    anime,
  };
}

/////robust one by gpt

// let currentPage = 1, hasNextPage = false, totalPages = 1;

// // Ensure pagination exists
// if ($(".pagination").length > 0) {
//   // Check if there's a next page
//   hasNextPage =
//     $(".pagination > li").length > 0 &&
//     $(".pagination li.active").length > 0 &&
//     !$(".pagination > li").last().hasClass("active");

//   // Get the current page number
//   currentPage = Number(
//     $(".pagination .active .page-link").text().trim()
//   ) || 1;

//   // Get the total pages from the "Last" link
//   const lastPageHref = $(".pagination a.page-link[title='Last']").attr("href");
//   totalPages = lastPageHref
//     ? Number(lastPageHref.split("page=").at(-1)) || 1
//     : 1;
// }

// // Return the pagination info
// const pageInfo = {
//   hasNextPage,
//   currentPage,
//   totalPages,
// };

// console.log(pageInfo);

export function extractAnimeInfo($: cheerio.CheerioAPI) {
  //some missing details in overview section
  const res: AnimeInfo = {
    id: null,
    title: null,
    AnilistId: null,
    MalId: null,
    posterImage: null,
    duration: null,
    type: null,
    synopsis: null,
    episodes: {
      sub: null,
      dub: null,
    },
    totalEpisodes: null,
  };
  const selector: cheerio.SelectorType = ".ani_detail-stage .anis-content ";
  const section = $(selector);

  res.id =
    section?.find(".film-buttons .btn")?.attr("href")?.split("/")?.at(-1) ||
    null;
  res.title =
    $(selector)
      ?.find(".anisc-detail .film-name.dynamic-name")
      ?.text()
      ?.trim() || null;
  // res.AnilistId =
  //   Number(JSON.parse($("body")?.find("#syncData")?.text()).anilist_id) ||
  //   null;
  // res.MalId =
  //   Number(JSON.parse($("body")?.find("#syncData")?.text()).mal_id) || null;
  const { mal_id, anilist_id } = JSON.parse($("#syncData").text().trim());
  res.AnilistId = Number(anilist_id) || null;
  res.MalId = Number(mal_id) || null;
  res.posterImage =
    section?.find(".film-poster .film-poster-img")?.attr("src") || null;

  res.synopsis = section?.find(".anisc-info .text")?.text()?.trim() || null;
  res.episodes.dub = Number(
    section?.find(".tick .tick-item.tick-dub")?.text().trim() || null
  );
  res.episodes.sub = Number(
    section?.find(".tick .tick-item.tick-sub")?.text().trim() || null
  );
  res.totalEpisodes = Number(
    section?.find(".tick .tick-item.tick-eps")?.text().trim() ||
      res.episodes.sub ||
      null
  );
  res.type =
    $("span.item").last().prev().prev().text().toUpperCase().trim() || null;
  const duration = $("span.item").last().text().trim();
  res.duration = parseInt(duration);

  return res;
}

export function extractEpisodesList(
  $: cheerio.CheerioAPI,
  selector: cheerio.SelectorType
) {
  const resEpisodeList: EpisodeInfo[] = [];

  $(selector).each((_, element) => {
    resEpisodeList.push({
      episodeId:
        $(element)
          ?.attr("href")
          ?.split("/")
          ?.at(2)
          ?.trim()
          ?.replace("?ep=", "-episode-") || null,
      title: $(element)?.attr("title")?.trim() || null,
      number: Number($(element).attr("data-number")),
      href: $(element)?.attr("href")?.split("/")?.at(2)?.trim() || null,
    });
  });

  return resEpisodeList;
}

export function extractServerData($: cheerio.CheerioAPI) {
  const servers: ScrappedServers = {
    sub: [],
    dub: [],
    raw: [],
    episodeNumber: 0,
  };
  const subSelector: cheerio.SelectorType =
    ".ps_-block.ps_-block-sub.servers-sub .ps__-list .server-item";
  const dubSelector: cheerio.SelectorType =
    ".ps_-block.ps_-block-sub.servers-dub .ps__-list .server-item";
  const rawSelector: cheerio.SelectorType =
    ".ps_-block.ps_-block-sub.servers-raw .ps__-list .server-item";
  const episodeNo = $(".content .server-notice")
    ?.find("b")
    ?.text()
    .split(" ")
    .pop();
  servers.episodeNumber = Number(episodeNo) || null;
  $(subSelector).each((_, element) => {
    servers.sub.push({
      severId: Number($(element)?.attr("data-server-id") || null),
      serverName: $(element).find(".btn").text().trim().toLowerCase() || null,
    });
  });
  $(dubSelector).each((_, element) => {
    servers.dub.push({
      severId: Number($(element)?.attr("data-server-id") || null),
      serverName: $(element)?.find(".btn")?.text().trim().toLowerCase() || null,
    });
  });
  $(rawSelector).each((_, element) => {
    servers.dub.push({
      severId: Number($(element)?.attr("data-server-id") || null),
      serverName: $(element)?.find(".btn")?.text().trim().toLowerCase() || null,
    });
  });
  return servers;
}

export function extractAnimeServerId(
  $: cheerio.CheerioAPI,
  servernumber: Number,
  category: language
) {
  return (
    $(`.ps_-block.ps_-block-sub.servers-${category} .ps__-list .server-item`)
      ?.map((_, element) =>
        $(element).attr("data-server-id") == `${servernumber}`
          ? $(element)
          : null
      )
      ?.get()
      ?.at(0)
      ?.attr("data-id") || null
  );
}
