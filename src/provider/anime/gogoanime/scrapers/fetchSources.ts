/// possible bugs dont know where to return the sources download link , undefined  or null cases in serverUrl

import { anitakuClient } from "../../../../config/gogoanimeclient";
import * as cheerio from "cheerio";
import { anitakuBaseUrl } from "../utils/constants";

import { anitakuServers, type anitakuAnimeServers } from "../utils/types";
import { anitakuExtractDownloadSrc } from "../utils/methods";

///
export async function anitakuFetchSources(
  episodeId: string,
  server: anitakuAnimeServers = anitakuServers.GogoServer
) {
  ////S1 segment works fine
  // if (episodeId.startsWith("https")) {
  //   const serverID = new URL(episodeId);
  //   return console.log("confirmed", serverID.href);
  // }
  try {
    ////S2
    const response = await anitakuClient.get(`${anitakuBaseUrl}/${episodeId}`, {
      headers: { Referer: `${anitakuBaseUrl}/` },
    });
    const data$: cheerio.CheerioAPI = cheerio.load(response.data);
    const downloadUrl = anitakuExtractDownloadSrc(data$); //// what to do about this

    let serverUrl: string | null;

    try {
      switch (server) {
        case anitakuServers.GogoServer:
          serverUrl =
            data$("div.anime_video_body > div.anime_muti_link > ul > li.vidcdn")
              ?.find("a")
              ?.attr("data-video") || null;

          break;

        case anitakuServers.Doodstream: {
          serverUrl =
            data$(
              "div.anime_video_body > div.anime_muti_link > ul > li.doodstream"
            )
              ?.find("a")
              ?.attr("data-video") || null;
          break;
        }
        case anitakuServers.StreamWish: {
          serverUrl =
            data$(
              "div.anime_video_body > div.anime_muti_link > ul > li.streamwish"
            )
              ?.find("a")
              ?.attr("data-video") || null;
          break;
        }
        case anitakuServers.VidHide: {
          serverUrl =
            data$(
              "div.anime_video_body > div.anime_muti_link > ul > li.vidhide"
            )
              ?.find("a")
              ?.attr("data-video") || null;

          break;
        }
        /////this seems like the one default
        case anitakuServers.Vidstreaming: {
          serverUrl =
            data$("div.anime_video_body > div.anime_muti_link > ul > li.anime")
              ?.find("a")
              ?.attr("data-video") || null;
          break;
        }

        default: {
          serverUrl =
            data$("div.anime_video_body_watch_items.load > div.play-video")
              ?.find("iframe")
              ?.attr("src") || null;
          break;
        }
      }

      ///works fine but i dont know what to do with error when null or undefined
      if (serverUrl !== null && serverUrl !== undefined) {
        // console.log(
        //   "validated that serverUrl isnt null or undefined",
        //   serverUrl
        // );
        return await anitakuFetchSources(serverUrl);
      }
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
  }
}
anitakuFetchSources("bleach-episode-1");
