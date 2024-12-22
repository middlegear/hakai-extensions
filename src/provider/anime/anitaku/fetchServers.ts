import * as cheerio from "cheerio";
import { anitakuClient } from "../../../config";
import { anitakuBaseUrl } from "../../../utils/constants";
import { anitakuExtractDownloadSrc, anitakuExtractServers } from "./methods";
import type { scrappedServers } from "./types";
import type { Error } from "../hianime/types";

export async function fetchServers(episodeId: string) {
  if (!episodeId)
    return {
      success: false,
      error: "Provide an episodeId",
    };
  try {
    const response = await anitakuClient.get(`${anitakuBaseUrl}/${episodeId}`, {
      headers: { Referer: `${anitakuBaseUrl}/` },
    });

    const data$: cheerio.CheerioAPI = cheerio.load(response.data);
    const selector: cheerio.SelectorType =
      "div.anime_video_body > div.anime_muti_link > ul > li ";

    const data = anitakuExtractServers(data$, selector);
    const dowloads = anitakuExtractDownloadSrc(data$);
    return {
      success: true,
      server: data,
      download: dowloads.sources.downloadUrl,
      iframe: dowloads.sources.iframe,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "No data found",
    };
  }
}
