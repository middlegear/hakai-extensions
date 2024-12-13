import * as cheerio from "cheerio";

import axios from "axios";
import { anitakuClient } from "../../../config";
import {
  anitaku_USER_AGENT_HEADER,
  ACCEPT_ENCODING,
} from "../../../config/headers";
import {
  anitakuInfoUrl,
  anitakuAjaxLoadEpisodes,
} from "../../../utils/constants";
import { anitaku_extractAnimeInfo, anitakuExtractEpisodes } from "./methods";

export async function fetchAnimeInfo(animeId: string) {
  try {
    const response = await anitakuClient.get(`${anitakuInfoUrl}/${animeId}`);
    // console.log(response.data);
    const data$: cheerio.CheerioAPI = cheerio.load(response.data);
    // // movie id is about here

    const infoSelector: cheerio.SelectorType =
      "div.main_body > div.anime_info_body ";

    const resAnimeInfo = anitaku_extractAnimeInfo(data$, infoSelector);
    const MovieId: cheerio.SelectorType =
      "div.anime_info_body > div.anime_info_episodes > div.anime_info_episodes_next";

    const movieId =
      Number(data$(MovieId).find("input#movie_id.movie_id").attr("value")) ||
      null;
    ////fetchepisodes list
    const numberOfepisodesSelector: cheerio.SelectorType =
      "div.main_body > div.anime_video_body > ul#episode_page";
    const totalEps =
      data$(numberOfepisodesSelector).find("li > a.active").attr("ep_end") ||
      null;

    const resEpisodes = await axios.get(
      `${anitakuAjaxLoadEpisodes}?ep_start=0&ep_end=${totalEps}&id=${movieId}&default_ep=0&alias=${animeId}`,
      {
        headers: {
          accept: "text/html, */*; q=0.01",
          "User-Agent": anitaku_USER_AGENT_HEADER,
          "Content-Encoding": ACCEPT_ENCODING,
        },
      }
    );

    const resHtmlEpisodes$: cheerio.CheerioAPI = cheerio.load(resEpisodes.data);

    const episodesData = anitakuExtractEpisodes(resHtmlEpisodes$);

    const resAnime = {
      resAnimeInfo,
      episodesData,
    };
    return resAnime;
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown Error",
    };
  }
}

/// remember to scrape for genres its buggy
