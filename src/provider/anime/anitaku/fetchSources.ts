import * as cheerio from "cheerio";
import { anitakuClient } from "../../../config";
import { anitakuBaseUrl } from "../../../utils/constants";
import { type anitakuAnimeServers, anitakuServers } from "./types";

export async function anitakuFetchSources(
  episodeId: string,
  server: anitakuAnimeServers = anitakuServers.Vidstreaming, /// defualt server
  downloadLink?: string
) {
  if (!episodeId) {
    throw new Error("Episode Id is required");
  }
  ////S1 segment works fine
  if (episodeId.startsWith("https")) {
    const serverID = new URL(episodeId);

    switch (server) {
      case anitakuServers.Doodstream: {
      }
    }
    // return console.log("confirmed", serverID.href);
  }
  try {
    console.time();
    ////S2
    const response = await anitakuClient.get(`${anitakuBaseUrl}/${episodeId}`, {
      headers: { Referer: `${anitakuBaseUrl}/` },
    });
    const data$: cheerio.CheerioAPI = cheerio.load(response.data);

    let serverUrl: URL | null;

    try {
      switch (server) {
        case anitakuServers.GogoServer: {
          serverUrl = new URL(
            `${data$(
              "div.anime_video_body > div.anime_muti_link > ul > li.vidcdn"
            )
              ?.find("a")
              ?.attr("data-video")}`
          );
          break;
        }
        case anitakuServers.Doodstream: {
          serverUrl = new URL(
            `${data$(
              "div.anime_video_body > div.anime_muti_link > ul > li.doodstream"
            )
              ?.find("a")
              ?.attr("data-video")}`
          );
          break;
        }
        case anitakuServers.StreamWish: {
          serverUrl = new URL(
            `${data$(
              "div.anime_video_body > div.anime_muti_link > ul > li.streamwish"
            )
              ?.find("a")
              ?.attr("data-video")}`
          );
          break;
        }
        case anitakuServers.VidHide: {
          serverUrl = new URL(
            `${data$(
              "div.anime_video_body > div.anime_muti_link > ul > li.vidhide"
            )
              ?.find("a")
              ?.attr("data-video")}`
          );

          break;
        }
        // /////this seems like the one default
        case anitakuServers.Vidstreaming: {
          serverUrl = new URL(
            `${data$(
              "div.anime_video_body > div.anime_muti_link > ul > li.anime"
            )
              ?.find("a")
              ?.attr("data-video")}`
          );
          break;
        }

        default: {
          serverUrl = new URL(
            `${data$("div.anime_video_body_watch_items.load > div.play-video")
              ?.find("iframe")
              ?.attr("src")}`
          );
          break;
        }
      }

      const downloadUrl = data$("div.favorites_book > ul > li.dowloads")
        .find("a")
        .attr("href");
      //// dunno what to do with iframe
      const iframe = data$("div.play-video").find("iframe").attr("src") || null;
      console.log(serverUrl.href);

      return await anitakuFetchSources(serverUrl.href, server, downloadUrl);
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unable to find serverURL ",
      };
    }
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : " no data check the episodeId and serverId ",
    };
  } finally {
    console.timeEnd();
  }
}
anitakuFetchSources("bleach-episode-1");
