import * as cheerio from "cheerio";
import { animeZClient } from "../../../config";
import { animeZBaseUrl } from "../../../utils/constants";
import { extractAnimeZInfo } from "./methods";
export async function fetchAnimeInfo(animeId: string) {
  if (!animeId) return { success: false, error: "Provide an Id" };
  try {
    const response = await animeZClient.get(`${animeZBaseUrl}/${animeId}`);
    const data$: cheerio.CheerioAPI = cheerio.load(response.data);

    const data = extractAnimeZInfo(data$);

    return data;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Internal server error ",
    };
  }
}
