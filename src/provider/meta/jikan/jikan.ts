import axios from 'axios';

import {
  AnimeStatusFilter,
  AnimeType,
  Filters,
  Season,
} from '../../../types/jikan.js';
import { TINFO } from '../../../types/types.js';

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

    const pagination = {
      hasNextPage: data.pagination.has_next_page,
      lastPage: data.pagination.last_visible_page,
      currentPage: page,
      total: data.pagination.items.total,
      perPage: data.pagination.items.per_page,
    };
    const search = data.data.map((item: any) => ({
      malId: item.mal_id,
      title: {
        romaji: item.title,
        english: item.title_english,
        native: item.title_japanese,
      },
      image:
        item.images.jpg.large_image_url ?? item.images.webp.large_image_url,
      bannerImage:
        item.images.jpg.large_image_url ?? item.images.webp.large_image_url,
      trailer: item.trailer.embed_url,
      episodes: item.episodes,

      startDate: item.aired.prop.from
        ? new Date(
            item.aired.prop.from.year,
            item.aired.prop.from.month - 1,
            item.aired.prop.from.day
          ).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : null,
      endDate: item.aired.prop.to
        ? new Date(
            item.aired.prop.to.year,
            item.aired.prop.to.month - 1,
            item.aired.prop.to.day
          ).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : null,
      type: item.type,
      status: item.status,
      genres: item.genres.map((item2: any) => item2.name),
      duration: item.duration,
      score: item.score,
      synopsis: item.synopsis,
      season: item.season,
      studio: item.studios,
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

    const animeInfo: TINFO = {
      malId: data.data.mal_id,
      title: {
        romaji: data.data.title,
        english: data.data.title_english,
        native: data.data.title_japanese,
      },
      image:
        data.data.images.jpg.large_image_url ??
        data.data.images.webp.large_image_url,
      bannerImage:
        data.data.images.jpg.large_image_url ??
        data.data.images.webp.large_image_url,
      trailer: data.data.trailer.embed_url,
      episodes: data.data.episodes,

      startDate: data.data.aired.prop.from
        ? new Date(
            data.data.aired.prop.from.year,
            data.data.aired.prop.from.month - 1,
            data.data.aired.prop.from.day
          ).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : null,
      endDate: data.data.aired.prop.to
        ? new Date(
            data.data.aired.prop.year,
            data.data.aired.prop.month - 1,
            data.data.aired.prop.to.day
          ).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : null,
      type: data.data.type,
      status: data.data.status,
      genres: data.data.genres.map((item2: any) => item2.name),
      duration: data.data.duration,
      score: data.data.score,
      synopsis: data.data.synopsis,
      season: data.data.season,
      studio: data.data.studios,
      producers: data.data.producers,
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
  page: number,
  limit: number
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
    const res = data;
    const pagination = {
      hasNextPage: res.pagination.has_next_page,
      lastPage: res.pagination.last_visible_page,
      currentPage: page,
      total: res.pagination.items.total,
      perPage: res.pagination.items.per_page,
    };
    const currentSeason = res.data.map((item: any) => ({
      malId: item.mal_id,
      title: {
        romaji: item.title,
        english: item.title_english,
        native: item.title_japanese,
      },
      image:
        item.images.jpg.large_image_url ?? item.images.webp.large_image_url,
      bannerImage:
        item.images.jpg.large_image_url ?? item.images.webp.large_image_url,
      trailer: item.trailer.embed_url,
      episodes: item.episodes,

      startDate: item.aired.prop.from
        ? new Date(
            item.aired.prop.from.year,
            item.aired.prop.from.month - 1,
            item.aired.prop.from.day
          ).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : null,
      endDate: item.aired.prop.to
        ? new Date(
            item.aired.prop.to.year,
            item.aired.prop.to.month - 1,
            item.aired.prop.to.day
          ).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : null,
      type: item.type,
      status: item.status,
      genres: item.genres.map((item2: any) => item2.name),
      duration: item.duration,
      score: item.score,
      synopsis: item.synopsis,
      season: item.season,
      studio: item.studios,
      producers: item.producers,
    }));

    return {
      success: true,
      pagination: pagination,
      data: currentSeason,
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
  page: number,
  limit: number
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
    const res = data;
    const pagination = {
      hasNextPage: res.pagination.has_next_page,
      lastPage: res.pagination.last_visible_page,
      currentPage: page,
      total: res.pagination.items.total,
      perPage: res.pagination.items.per_page,
    };

    const NextSeason = res.data.map((item: any) => ({
      malId: item.mal_id,
      title: {
        romaji: item.title,
        english: item.title_english,
        native: item.title_japanese,
      },
      image:
        item.images.jpg.large_image_url ?? item.images.webp.large_image_url,
      bannerImage:
        item.images.jpg.large_image_url ?? item.images.webp.large_image_url,
      trailer: item.trailer.embed_url,
      episodes: item.episodes,

      startDate: item.aired.prop.from
        ? new Date(
            item.aired.prop.from.year,
            item.aired.prop.from.month - 1,
            item.aired.prop.from.day
          ).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : null,
      endDate: item.aired.prop.to
        ? new Date(
            item.aired.prop.to.year,
            item.aired.prop.to.month - 1,
            item.aired.prop.to.day
          ).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : null,
      type: item.type,
      status: item.status,
      genres: item.genres.map((item2: any) => item2.name),
      duration: item.duration,
      score: item.score,
      synopsis: item.synopsis,
      season: item.season,
      studio: item.studios,
      producers: item.producers,
    }));

    return {
      success: true,
      pagination: pagination,
      data: NextSeason,
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
  page: number,
  limit: number
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
    const res = data;
    const pagination = {
      hasNextPage: res.pagination.has_next_page,
      lastPage: res.pagination.last_visible_page,
      currentPage: page,
      total: res.pagination.items.total,
      perPage: res.pagination.items.per_page,
    };

    const Season = res.data.map((item: any) => ({
      malId: item.mal_id,
      title: {
        romaji: item.title,
        english: item.title_english,
        native: item.title_japanese,
      },
      image:
        item.images.jpg.large_image_url ?? item.images.webp.large_image_url,
      bannerImage:
        item.images.jpg.large_image_url ?? item.images.webp.large_image_url,
      trailer: item.trailer.embed_url,
      episodes: item.episodes,

      startDate: item.aired.prop.from
        ? new Date(
            item.aired.prop.from.year,
            item.aired.prop.from.month - 1,
            item.aired.prop.from.day
          ).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : null,
      endDate: item.aired.prop.to
        ? new Date(
            item.aired.prop.to.year,
            item.aired.prop.to.month - 1,
            item.aired.prop.to.day
          ).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : null,
      type: item.type,
      status: item.status,
      genres: item.genres.map((item2: any) => item2.name),
      duration: item.duration,
      score: item.score,
      synopsis: item.synopsis,
      season: item.season,
      studio: item.studios,
      producers: item.producers,
    }));

    return {
      success: true,
      pagination: pagination,
      data: Season,
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
    const res = data;
    const pagination = {
      hasNextPage: res.pagination.has_next_page,
      lastPage: res.pagination.last_visible_page,
      currentPage: page,
      total: res.pagination.items.total,
      perPage: res.pagination.items.per_page,
    };

    const topAnime = res.data.map((item: any) => ({
      malId: item.mal_id,
      title: {
        romaji: item.title,
        english: item.title_english,
        native: item.title_japanese,
      },
      image:
        item.images.jpg.large_image_url ?? item.images.webp.large_image_url,
      bannerImage:
        item.images.jpg.large_image_url ?? item.images.webp.large_image_url,
      trailer: item.trailer.embed_url,
      episodes: item.episodes,

      startDate: item.aired.prop.from
        ? new Date(
            item.aired.prop.from.year,
            item.aired.prop.from.month - 1,
            item.aired.prop.from.day
          ).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : null,
      endDate: item.aired.prop.to
        ? new Date(
            item.aired.prop.to.year,
            item.aired.prop.to.month - 1,
            item.aired.prop.to.day
          ).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : null,

      type: item.type,
      status: item.status,
      genres: item.genres.map((item2: any) => item2.name),
      duration: item.duration,
      score: item.score,
      synopsis: item.synopsis,
      season: item.season,
      studio: item.studios,
      producers: item.producers,
    }));

    return {
      success: true,
      pagination: pagination,
      data: topAnime,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown Err',
    };
  }
}
