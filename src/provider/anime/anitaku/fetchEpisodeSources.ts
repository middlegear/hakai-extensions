/// extractors remaining this will need lots of work
import * as cheerio from "cheerio";
import { anitakuClient } from "../../../config";
import { anitakuBaseUrl } from "../../../utils/constants";
import { type anitakuAnimeServers, anitakuServers } from "./types";
import { GogoServer } from "../../source-extractors/gogoserver";

export async function fetchEpisodeSources(
  episodeId: string,
  server: anitakuAnimeServers /// defualt server
  // downloadLink?: string
) {
  if (!episodeId) {
    throw new Error("Episode Id is required");
  }
  ////S1 segment works fine
  // if (episodeId.startsWith("https")) {
  //   // return console.log("confirmed", serverID.href);
  // }
  try {
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
      // console.log(iframe);

      // return await fetchEpisodeSources(serverUrl.href, server);
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unable to find serverURL ",
      };
    }
    if (serverUrl.href != undefined && serverUrl.href != null) {
      const serverID = new URL(serverUrl);

      switch (server) {
        case anitakuServers.GogoServer: {
          const data = GogoServer(serverID);
          return data;
        }

        case anitakuServers.Doodstream: {
          console.log(server, " i have received the ref doodstream");
          break;
        }
        case anitakuServers.VidHide: {
          console.log(server, " i have received the ref vidhide");
          break;
        }
        case anitakuServers.Vidstreaming: {
          console.log(server, " i have received the ref Vidstreaming");
          break;
        }
      }
    }
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : " no data check the episodeId and serverId ",
    };
  }
}
