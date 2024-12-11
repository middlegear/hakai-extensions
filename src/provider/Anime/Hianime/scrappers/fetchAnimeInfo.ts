import * as cheerio from "cheerio";

import { extractAnimeInfo, extractEpisodesList } from "../utils/hianimemethods";
import { zoroBaseUrl } from "../utils/hianimeconstants";
import { zoroClient } from "../../../../config";

export async function fetchAnimeInfo(animeId: string) {
  if (!animeId) throw new Error("Provide an id ");
  try {
    console.time("scraping time");
    const response = await zoroClient.get(`${zoroBaseUrl}/${animeId}`);
    const $data: cheerio.CheerioAPI = cheerio.load(response.data);

    const resAnimeInfo = extractAnimeInfo($data);
    // console.log(response.data); /// request is successful
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
    const data = {
      anime: resAnimeInfo,
      episodes: resEpisodes,
    };
    console.log(data);
    return { data };
  } catch (error) {
    throw new Error("No anime info found");
  } finally {
    console.timeEnd("finish scraping");
  }
}
