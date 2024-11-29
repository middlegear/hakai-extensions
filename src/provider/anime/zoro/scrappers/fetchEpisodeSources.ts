import { zoroBaseUrl } from "../utils/constants";
import { extractAnimeServerId } from "../utils/methods";
import {
  Dubbing,
  Servers,
  type AnimeServers,
  type language,
} from "../utils/types";
import * as cheerio from "cheerio";

import MegaCloud from "../extractors/megaCloud";

import StreamSB from "../extractors/streamSb";
import StreamTape from "../extractors/streamTape";
import { USER_AGENT_HEADER } from "../../../../config/constants";
import { zoroclient } from "../../../../config/zoroclient";
export async function episodeSources(
  episodeid: string,
  server: AnimeServers = Servers.HD1,
  language: language = Dubbing.Sub
) {
  ////IF THEID STARTS WITH HTTP S1
  if (episodeid.startsWith("https")) {
    const serverfetchUrl = new URL(episodeid);
    switch (server) {
      case Servers.HD1:
      case Servers.HD2: {
        return {
          ...(await new MegaCloud().extract(serverfetchUrl)),
        };
      }
      case Servers.StreamSB:
        return {
          headers: {
            Referer: serverfetchUrl.href,
            watchsb: "streamsb",
            "User-Agent": USER_AGENT_HEADER,
          },
          sources: await new StreamSB().extract(serverfetchUrl, true),
        };
      case Servers.StreamTape:
        return {
          headers: {
            Referer: serverfetchUrl.href,
            "User-Agent": USER_AGENT_HEADER,
          },
          sources: await new StreamTape().extract(serverfetchUrl),
        };
    }
    //S2
    try {
      const newId = episodeid.split("-").pop();

      const response = await zoroclient.get(
        `${zoroBaseUrl}/ajax/v2/episode/servers?episodeId=${newId}`,
        {
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            Referer: `${zoroBaseUrl}/watch/?ep=${newId}`,
          },
        }
      );
      const datares$: cheerio.CheerioAPI = cheerio.load(response.data.html);
      let mediadataId: string | null = null;

      try {
        switch (server) {
          case Servers.HD1: {
            mediadataId = extractAnimeServerId(datares$, 4, language);
            if (!mediadataId) throw new Error("HD1 not found");
            break;
          }
          case Servers.HD2: {
            mediadataId = extractAnimeServerId(datares$, 1, language);
            if (!mediadataId) throw new Error("HD2 not found");
            break;
          }
          case Servers.StreamSB: {
            mediadataId = extractAnimeServerId(datares$, 5, language);
            if (!mediadataId) throw new Error("streamsb not found");
            break;
          }
          case Servers.StreamTape: {
            mediadataId = extractAnimeServerId(datares$, 3, language);
            if (!mediadataId) throw new Error("streamtape not found");
            break;
          }
        }
        const {
          data: { link },
        } = await zoroclient.get(
          `${zoroBaseUrl}//ajax/v2/episode/sources?id=${mediadataId}`,
          {
            headers: {
              "X-Requested-With": "XMLHttpRequest",
              Referer: `${zoroBaseUrl}/watch/?ep=${newId}`,
            },
          }
        );
        console.log(link, mediadataId);
        return await episodeSources(link, server);
      } catch (error) {
        return {
          error:
            error instanceof Error
              ? error.message
              : "Could not retrive the data id for the selected anime",
        };
      }
    } catch (error) {
      error instanceof Error ? error.message : "No data found";
    }
  }
}
