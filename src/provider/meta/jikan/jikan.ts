import axios from 'axios';
import { Filters, Season, AnimeType, AnimeStatusFilter } from './types.js';
import type { AnimeInfo } from './types.js';
import type { seasonJikan } from './types.js';

const jikanBaseUrl = 'https://api.jikan.moe/v4';
export async function searchAnime(
  query: string,
  page: number,
  limit: number,
  type: String
) {
  if (!query)
    return {
      success: false,
      error: 'Missing required parameters: query',
    };
  try {
    const { data } = await axios.get(
      `${jikanBaseUrl}/anime?q=${query}&page=${page}&limit=${limit}&type=${type}`
    );
    const res: seasonJikan = data;
    const pagination = {
      hasNextPage: res.pagination.has_next_page,
      lastPage: res.pagination.last_visible_page,
      currentPage: page,
      items: {
        count: res.pagination.items.count,
        total: res.pagination.items.total,
        perPage: res.pagination.items.per_page,
      },
    };
    const search = res.data.map((item) => ({
      malId: item.mal_id,
      image_jpg: item.images.jpg.large_image_url,
      image_webp: item.images.webp.large_image_url,
      embedtrailer: item.trailer.embed_url,
      title: {
        romaji: item.title,
        english: item.title_english,
      },
      synopsis: item.synopsis,
      type: item.type,
      status: item.status,
      score: item.score,
      episodes: item.episodes,
      duration: item.duration,
      airing: item.airing,
      startedAiring: item.aired.from,
      stoppedAiring: item.aired.to,
      broadcast: item.broadcast,
      genres: item.genres.map((item2) => item2.name),
      studios: item.studios,
      producers: item.producers,
    }));

    return {
      pagination,
      search,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown Err',
    };
  }
}

export async function getInfoById(Id: number) {
  if (!Id)
    return {
      success: false,
      error: 'Missing required parameters: MAL_id',
    };
  try {
    const { data } = await axios.get(`${jikanBaseUrl}/anime/${Id}`);
    const res = data.data;
    const animeInfo: AnimeInfo = {
      malId: res.mal_id,
      title: {
        romaji: res.title,
        english: res.title_english,
      },
      image_jpg: res.images.jpg.large_image_url,
      image_webp: res.images.webp.large_image_url,
      trailer: res.trailer.embed_url,
      type: res.type,
      status: res.status,
      duration: res.duration,
      score: res.score,
      synopsis: res.synopsis,
      season: res.season,
    };
    return {
      success: true,
      animeInfo,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown Err',
    };
  }
}
///get anime characters need to implement actual characters
export async function getAnimeCharacters(id: number) {
  if (!id)
    return {
      success: false,
      error: 'Missing required parameters:MAL_id',
    };
  try {
    const { data } = await axios.get(`${jikanBaseUrl}/anime/${id}/characters`);
    return data;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown Err',
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
      error: 'Missing required parameters: filter',
    };
  }
  try {
    const { data } = await axios.get(
      `${jikanBaseUrl}/seasons/now?filter=${filter}&?sfw&page=${page}&limit=${limit}`
    );
    const res: seasonJikan = data;
    const pagination = {
      hasNextPage: res.pagination.has_next_page,
      lastPage: res.pagination.last_visible_page,
      currentPage: page,
      items: {
        count: res.pagination.items.count,
        total: res.pagination.items.total,
        perPage: res.pagination.items.per_page,
      },
    };
    const currentSeason = res.data.map((item) => ({
      malId: item.mal_id,
      image_jpg: item.images.jpg.large_image_url,
      image_webp: item.images.webp.large_image_url,
      embedtrailer: item.trailer.embed_url,
      title: {
        romaji: item.title,
        english: item.title_english,
      },
      synopsis: item.synopsis,
      type: item.type,
      status: item.status,
      score: item.score,
      episodes: item.episodes,
      duration: item.duration,
      airing: item.airing,
      startedAiring: item.aired.from,
      stoppedAiring: item.aired.to,
      broadcast: item.broadcast,
      genres: item.genres.map((item2) => item2.name),
      studios: item.studios,
      producers: item.producers,
    }));

    return {
      pagination,
      currentSeason,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown Err',
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
      error: 'Missing required parameters: filter',
    };
  }
  try {
    const { data } = await axios.get(
      `${jikanBaseUrl}/seasons/upcoming?filter=${filter}&?sfw&page=${page}&limit=${limit}`
    );
    const res: seasonJikan = data;
    const pagination = {
      hasNextPage: res.pagination.has_next_page,
      lastPage: res.pagination.last_visible_page,
      currentPage: page,
      items: {
        count: res.pagination.items.count,
        total: res.pagination.items.total,
        perPage: res.pagination.items.per_page,
      },
    };

    const NextSeason = res.data.map((item) => ({
      malId: item.mal_id,
      image_jpg: item.images.jpg.large_image_url,
      image_webp: item.images.webp.large_image_url,
      embedtrailer: item.trailer.embed_url,
      title: {
        romaji: item.title,
        english: item.title_english,
      },
      synopsis: item.synopsis,
      type: item.type,
      status: item.status,
      score: item.score,
      episodes: item.episodes,
      duration: item.duration,
      airing: item.airing,
      startedAiring: item.aired.from,
      stoppedAiring: item.aired.to,
      broadcast: item.broadcast,
      genres: item.genres.map((item2) => item2.name),
      studios: item.studios,
      producers: item.producers,
    }));

    return {
      pagination,
      NextSeason,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown Err',
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
      error: 'Missing required parameters: year, season, or filter',
    };
  }
  try {
    const { data } = await axios.get(
      `${jikanBaseUrl}/seasons/${year}/${season}?filter=${filter}&?sfw&page=${page}&limit=${limit}`
    );
    const res: seasonJikan = data;
    const pagination = {
      hasNextPage: res.pagination.has_next_page,
      lastPage: res.pagination.last_visible_page,
      currentPage: page,
      items: {
        count: res.pagination.items.count,
        total: res.pagination.items.total,
        perPage: res.pagination.items.per_page,
      },
    };

    const Season = res.data.map((item) => ({
      malId: item.mal_id,
      image_jpg: item.images.jpg.large_image_url,
      image_webp: item.images.webp.large_image_url,
      embedtrailer: item.trailer.embed_url,
      title: {
        romaji: item.title,
        english: item.title_english,
      },
      synopsis: item.synopsis,
      type: item.type,
      status: item.status,
      score: item.score,
      episodes: item.episodes,
      duration: item.duration,
      airing: item.airing,
      startedAiring: item.aired.from,
      stoppedAiring: item.aired.to,
      broadcast: item.broadcast,
      genres: item.genres.map((item2) => item2.name),
      studios: item.studios,
      producers: item.producers,
    }));

    return {
      pagination,
      Season,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown Err',
    };
  }
}

export async function getTopAnime(
  filter: AnimeStatusFilter,
  type: AnimeType,
  page: number,
  limit: number
) {
  if (!filter || !type) {
    return {
      success: false,
      error: 'Missing required parameters: year, season, or filter',
    };
  }
  try {
    const { data } = await axios.get(
      `${jikanBaseUrl}/top/anime?filter=${filter}&type=${type}&?sfw&page=${page}&limit=${limit}`
    );
    const res: seasonJikan = data;
    const pagination = {
      hasNextPage: res.pagination.has_next_page,
      lastPage: res.pagination.last_visible_page,
      currentPage: page,
      items: {
        count: res.pagination.items.count,
        total: res.pagination.items.total,
        perPage: res.pagination.items.per_page,
      },
    };

    const topAnime = res.data.map((item) => ({
      malId: item.mal_id,
      image_jpg: item.images.jpg.large_image_url,
      image_webp: item.images.webp.large_image_url,
      embedtrailer: item.trailer.embed_url,
      title: {
        romaji: item.title,
        english: item.title_english,
      },
      synopsis: item.synopsis,
      type: item.type,
      status: item.status,
      score: item.score,
      episodes: item.episodes,
      duration: item.duration,
      airing: item.airing,
      startedAiring: item.aired.from,
      stoppedAiring: item.aired.to,
      broadcast: item.broadcast,
      genres: item.genres.map((item2) => item2.name),
      studios: item.studios,
      producers: item.producers,
    }));

    return {
      pagination,
      topAnime,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown Err',
    };
  }
}
