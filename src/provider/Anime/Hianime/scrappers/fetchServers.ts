import { zoroBaseUrl } from "../utils/hianimeconstants";
import * as cheerio from "cheerio";
import { extractServerData } from "../utils/hianimemethods";
import { zoroClient } from "../../../../config";

// fetching dubbing and subs happens here
export async function fetchServers(episodeId: string) {
  if (!episodeId) {
    throw new Error("An ID IS REQUIRED");
  }

  try {
    console.time("start scrapping");
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

    console.log(serverdata);
  } catch (error) {
    throw new Error("No data");
  } finally {
    console.timeEnd("finish scraping");
  }
}
