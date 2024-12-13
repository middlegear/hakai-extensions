import * as cheerio from "cheerio";
import { zoroClient } from "../../../config";
import { extractAnimeInfo, extractEpisodesList } from "./methods";
import { zoroBaseUrl } from "../../../utils/constants";
import type { Error, scrappedAnimeInfo } from "./types";

export async function fetchAnimeInfo(
  animeId: string
): Promise<scrappedAnimeInfo | Error> {
  if (!animeId)
    return {
      success: false,
      error: "Provide an animeId!",
    };

  try {
    const response = await zoroClient.get(`${zoroBaseUrl}/${animeId}`);
    const $data: cheerio.CheerioAPI = cheerio.load(response.data);

    const resAnimeInfo = extractAnimeInfo($data);

    const episodesList = await zoroClient.get(
      `${zoroBaseUrl}/ajax/v2/episode/list/${animeId.split("-").pop()}`,
      {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          Referer: `${zoroBaseUrl}/watch/${animeId}`,
        },
      }
    );
    const $episodes: cheerio.CheerioAPI = cheerio.load(episodesList.data.html);
    const episodesSelector: cheerio.SelectorType =
      ".detail-infor-content .ss-list a";
    const resEpisodes = extractEpisodesList($episodes, episodesSelector);

    // const relatedAnimeSeasons = await client.get(`${zoroBaseUrl}/watch/${animeId}`);
    // console.log(resAnimeInfo, resEpisodes);

    return { success: true, animeInfo: resAnimeInfo, episodes: resEpisodes };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : " Internal server error",
    };
  }
}
