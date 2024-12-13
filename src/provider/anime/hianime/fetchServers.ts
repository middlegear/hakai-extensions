import * as cheerio from "cheerio";
import { zoroClient } from "../../../config";
import { zoroBaseUrl } from "../../../utils/constants";
import { extractServerData } from "./methods";
import type { ScrappedServers, Error } from "./types";
export async function fetchServers(
  episodeId: string
): Promise<ScrappedServers | Error> {
  if (!episodeId)
    return {
      success: false,
      error: "Provide an episodeId!",
    };

  try {
    const newId = episodeId.split("-").pop();

    const response = await zoroClient.get(
      `${zoroBaseUrl}/ajax/v2/episode/servers?episodeId=${newId}`,
      {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          Referer: `${zoroBaseUrl}/watch/?ep=${newId}`,
        },
      }
    );

    const res$: cheerio.CheerioAPI = cheerio.load(response.data.html);

    const serverdata = extractServerData(res$);

    return serverdata;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Internal Server Error",
    };
  }
}
