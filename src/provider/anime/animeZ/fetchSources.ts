import * as cheerio from "cheerio";
import { animeZClient } from "../../../config";
import { animeZBaseUrl } from "../../../utils/constants";

export async function fetchSources(episodeId: string) {
  if (!episodeId) {
    return {
      success: false,
      error: "Provide an episodeId!",
    };
  }
  try {
    const response = await animeZClient.get(
      `${animeZBaseUrl}/${decodeURIComponent(episodeId)}`
    );

    const iframe$: cheerio.CheerioAPI = cheerio.load(response.data);
    const iframe: cheerio.SelectorType = "div#watch-block > div#anime_player ";

    const embedSource: string | null =
      iframe$(iframe).find("iframe").attr("src") || null;

    const host = iframe$("main#box_right_watch")
      .find("input#currentlink")
      .attr("value")
      ?.split("/")
      .at(-1);
    const serverUrl = iframe$("main#box_right_watch")
      .find("input#currentlink")
      .attr("value");

    if (embedSource?.startsWith("https")) {
      try {
        const stream = await animeZClient.get(`${embedSource}`, {
          headers: {
            Referer: `${animeZBaseUrl}/`,
            Authorization: `${host}`,
          },
        });

        const data$: cheerio.CheerioAPI = cheerio.load(stream.data);
        const selector: cheerio.SelectorType = "div#video-container > video";
        const streamSource =
          `${serverUrl}${data$(selector).find("source").attr("src")}` || null;
        const type = data$(selector).find("source").attr("type") || null;
        return {
          source: streamSource,
          type: type,
          referer: embedSource,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "check embedSource",
        };
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown err",
    };
  }
}
