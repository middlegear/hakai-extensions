import * as cheerio from "cheerio";
import { anitakuClient } from "../../../config";
import { anitakuBaseUrl } from "../../../utils/constants";
import { anitakuExtractServers } from "./methods";

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
