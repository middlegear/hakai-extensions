import { anitakuBaseUrl } from "../utils/anitakuConstants";
import * as cheerio from "cheerio";
import { anitakuExtractServers } from "../utils/anitakuMethods";
import { anitakuClient } from "../../../../config";
export async function fetchAnimeServers(episodeId: string) {
  try {
    const response = await anitakuClient.get(`${anitakuBaseUrl}/${episodeId}`, {
      headers: { Referer: `${anitakuBaseUrl}/` },
    });
    // console.log(response.data);

    const data$: cheerio.CheerioAPI = cheerio.load(response.data);
    const selector: cheerio.SelectorType =
      "div.anime_video_body > div.anime_muti_link > ul > li ";

    const serverData = anitakuExtractServers(data$, selector);
    console.log(serverData);
  } catch (error) {
    return error instanceof Error ? error.message : "No data found";
  }
}
fetchAnimeServers("one-piece-episode-1122");
