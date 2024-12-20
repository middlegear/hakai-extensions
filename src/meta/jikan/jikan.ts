///

import axios from "axios";
import { Filters, Season, TopAnime, TopAnimeFilter } from "./types";

const jikanBaseUrl = "https://api.jikan.moe/v4";

export async function getInfoById(Id: number) {
  if (!Id)
    return {
      success: false,
      error: "Missing required parameters: MAL_id",
    };
  try {
    const { data } = await axios.get(`${jikanBaseUrl}/anime/${Id}`);

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown Err",
    };
  }
}

export async function getCharacters(id: number) {
  if (!id)
    return {
      success: false,
      error: "Missing required parameters:MAL_id",
    };
  try {
    const { data } = await axios.get(`${jikanBaseUrl}/anime/${id}/characters`);
    return data;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown Err",
    };
  }
}

export async function getCurrentSeason(
  filter: Filters,
  page: number = 1,
  limit: number = 25
) {
  if (!filter) {
    return {
      success: false,
      error: "Missing required parameters: filter",
    };
  }
  try {
    const { data } = await axios.get(
      `${jikanBaseUrl}/seasons/now?filter=${filter}&?sfw&page=${page}&limit=${limit}`
    );
    return data;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown Err",
    };
  }
}

export async function getNextSeason(
  filter: Filters,
  page: number = 1,
  limit: number = 25
) {
  if (!filter) {
    return {
      success: false,
      error: "Missing required parameters: filter",
    };
  }
  try {
    const { data } = await axios.get(
      `${jikanBaseUrl}/seasons/upcoming?filter=${filter}&?sfw&page=${page}&limit=${limit}`
    );
    return data;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown Err",
    };
  }
}

export async function getSeason(
  year: number,
  season: Season,
  filter: Filters,
  page: number = 1,
  limit: number = 25
) {
  if (!year || !season || !filter) {
    return {
      success: false,
      error: "Missing required parameters: year, season, or filter",
    };
  }
  try {
    const { data } = await axios.get(
      `${jikanBaseUrl}/seasons/${year}/${season}?filter=${filter}&?sfw&page=${page}&limit=${limit}`
    );
    return data;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown Err",
    };
  }
}

export async function getTopAnime(
  filter: TopAnimeFilter,
  type: TopAnime,
  page: number = 1,
  limit: number = 25
) {
  if (!filter || !type) {
    return {
      success: false,
      error: "Missing required parameters: year, season, or filter",
    };
  }
  try {
    const { data } = await axios.get(
      `${jikanBaseUrl}/top/anime?filter=${filter}&type=${type}&?sfw&page=${page}&limit=${limit}`
    );
    return data;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown Err",
    };
  }
}
