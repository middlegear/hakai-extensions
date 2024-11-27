import { client } from "../../config/client";
import { zoroBaseUrl } from "../../utils/zoroconstants";
import { extractAnimeServerId } from "../methods";
import { Dubbing, Servers, type AnimeServers, type language } from "../types";
import * as cheerio from "cheerio";
async function episodeSources(
  id: string,
  server: AnimeServers = Servers.HD1,
  language: language = Dubbing.Sub
) {
  ////IF THEID STARTS WITH HTTP S1
  //
  ////s2
  try {
    const newId = id.split("-").pop();

    const response = await client.get(
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

      /////

      const response = await client.get(
        `${zoroBaseUrl}//ajax/v2/episode/sources?id=${mediadataId}`
        // {
        //   headers: {
        //     "X-Requested-With": "XMLHttpRequest",
        //     Referer: `${zoroBaseUrl}/watch/?ep=${newId}`,
        //   },
        // }
      );
      console.log(response.data);
    } catch (error) {
      return {
        error:
          error instanceof Error
            ? error.message
            : "Could not retrive the data id for the selected anime",
      };
    }
  } catch (error) {
    throw new Error(" nothing ");
  }
}
episodeSources(
  "bleach-thousand-year-blood-war-arc-15665-episode-94563",
  Servers.StreamSB,
  Dubbing.Dub
);
