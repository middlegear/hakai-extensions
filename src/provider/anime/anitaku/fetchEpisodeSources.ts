/// extractors remaining this will need lots of work
import * as cheerio from "cheerio";
import { anitakuClient } from "../../../config";
import { anitakuBaseUrl } from "../../../utils/constants";
import { type anitakuAnimeServers, anitakuServers } from "./types";
import { GogoServer } from "../../source-extractors/gogoserver";
import { StreamWish } from "../../source-extractors/streamwish";
import { VidHide } from "../../source-extractors/vidhide";
import { MP4Upload } from "../../source-extractors/mp4upload";

export async function fetchEpisodeSources(
  episodeId: string,
  server: anitakuAnimeServers
) {
  if (!episodeId) {
    throw new Error("Episode Id is required");
  }

  try {
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
        case anitakuServers.MP4Upload: {
          serverUrl = new URL(
            `${data$(
              "div.anime_video_body > div.anime_muti_link > ul > li.mp4upload"
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
        case anitakuServers.StreamWish: {
          const data = StreamWish(serverID);
          return data;
        }
        case anitakuServers.MP4Upload: {
          const data = MP4Upload(serverID);
          return data;
        }
        case anitakuServers.Doodstream: {
          return {
            success: false,
            error: console.error("Avoid this source use Href "),
            reason: "Method not implemented embed the href buddy ",
            href: serverID.href,
          };
        }
        case anitakuServers.VidHide: {
          const data = VidHide(serverID);
          return data;
        }
        default: {
          anitakuServers.Vidstreaming;
          const data = GogoServer(serverID);
          return data;
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
