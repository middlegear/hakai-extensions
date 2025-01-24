////extractors need fixing
import * as cheerio from "cheerio";
import { zoroClient } from "../../../config";
import { zoroBaseUrl } from "../../../utils/constants";
import { extractAnimeServerId } from "./methods";
import { type AnimeServers, Servers, Dubbing, type language } from "./types";

export async function fetchEpisodeSources(
  episodeid: string,
  server: AnimeServers = Servers.HD1,
  language: language = Dubbing.Sub
) {
  try {
    const newId = episodeid.split("-").pop();

    const response = await zoroClient.get(
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
      } = await zoroClient.get(
        `${zoroBaseUrl}//ajax/v2/episode/sources?id=${mediadataId}`,
        {
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            Referer: `${zoroBaseUrl}/watch/?ep=${newId}`,
          },
        }
      );
      console.log(link, mediadataId);
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
