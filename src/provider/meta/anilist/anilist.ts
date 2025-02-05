import axios from 'axios';

import {
  airingQuery,
  characterQuery,
  fetchByIdQuery,
  popularAnimeQuery,
  searchQuery,
  seasonQuery,
} from './queries.js';

import { USER_AGENT_HEADER } from '../../index.js';

import {
  MediaType,
  Format,
  Status,
  Sort,
  Seasons,
  Charactersort,
} from '../../../types/anilist.js';

const baseURL = `https://graphql.anilist.co`;
const Referer = 'https://anilist.co';
const Origin = 'https://anilist.co';

export async function searchAnime(
  search: string,
  page: number,
  perPage: number,
  type: MediaType,
  isAdult: boolean
) {
  if (!search) {
    return {
      success: false,
      error: 'Missing required fields : search',
    };
  }
  try {
    const variables = { search, page, perPage, type, isAdult };
    const response = await axios.post(
      baseURL,
      {
        query: searchQuery,
        variables,
      },
      {
        headers: {
          'User-Agent': USER_AGENT_HEADER,
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Referer: 'https://anilist.co',
          Origin: 'https://anilist.co',
        },
      }
    );

    const pagination = {
      hasNextPage: response.data.data.Page.pageInfo.hasNextPage,
      total: response.data.data.Page.pageInfo.total,
      lastPage: response.data.data.Page.pageInfo.lastPage,
      currentPage: response.data.data.Page.pageInfo.currentPage,
      perPage: response.data.data.Page.pageInfo.perPage,
    };

    // const res = response.data.data.Page.media;
    const res = response.data.data.Page.media.map((item: any) => ({
      malId: item.idMal,
      anilistId: item.id,
      image:
        item.coverImage.extraLarge ??
        item.coverImage.large ??
        item.coverImage.medium,

      bannerImage:
        item.bannerImage ??
        item.coverImage.extraLarge ??
        item.coverImage.large ??
        item.coverImage.medium,
      title: {
        romaji: item.title.romaji ?? item.title.userPreferred,
        english: item.title.english,
        native: item.title.native,
      },
      trailer: item.trailer,
      type: item.type,
      status: item.status,
      duration: item.duration,
      score: item.meanScore ?? item.averageScore,
      genres: item.genres,
      episodes: item.episodes,
      synopsis: item.description,
      season: item.season,
      startDate: item.startDate
        ? new Date(
            item.startDate.year,
            item.startDate.month - 1,
            item.startDate.day
          ).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : null,
      endDate: item.endDate
        ? new Date(
            item.endDate.year,
            item.endDate.month - 1,
            item.endDate.day
          ).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : null,
      studio: item.studios.nodes.length > 0 ? item.studios.nodes[0].name : null,
      producers: item.studios.nodes.map((item2: any) => item2.name),
    }));

    return {
      success: true,
      pagination: pagination,
      data: res,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown Err',
    };
  }
}
export async function fetchAnimeById(id: number) {
  if (!id) {
    return {
      success: false,
      error: 'Missing required parameter : id!',
    };
  }
  const variables = { id };
  try {
    const response = await axios.post(
      baseURL,
      {
        query: fetchByIdQuery,
        variables,
      },
      {
        headers: {
          'User-Agent': USER_AGENT_HEADER,
          Accept: 'application/json',
          Referer: Referer,
          Origin: Origin,
        },
      }
    );
    const pagination = {
      hasNextPage: response.data.data.Page.pageInfo.hasNextPage,
      total: response.data.data.Page.pageInfo.total,
      lastPage: response.data.data.Page.pageInfo.lastPage,
      currentPage: response.data.data.Page.pageInfo.currentPage,
      perPage: response.data.data.Page.pageInfo.perPage,
    };

    // const res = response.data.data.Page.media;
    const res = {
      malId: response.data.data.Page.media.idMal,
      anilistId: response.data.data.Page.media.id,
      image:
        response.data.data.Page.media.coverImage.extraLarge ??
        response.data.data.Page.media.coverImage.large ??
        response.data.data.Page.media.coverImage.medium,

      bannerImage:
        response.data.data.Page.media.bannerImage ??
        response.data.data.Page.media.coverImage.extraLarge ??
        response.data.data.Page.media.coverImage.large ??
        response.data.data.Page.media.coverImage.medium,
      title: {
        romaji:
          response.data.data.Page.media.title.romaji ??
          response.data.data.Page.media.title.userPreferred,
        english: response.data.data.Page.media.title.english,
        native: response.data.data.Page.media.title.native,
      },
      trailer: response.data.data.Page.media.trailer,
      type: response.data.data.Page.media.type,
      status: response.data.data.Page.media.status,
      duration: response.data.data.Page.media.duration,
      score:
        response.data.data.Page.media.meanScore ??
        response.data.data.Page.media.averageScore,
      genres: response.data.data.Page.media.genres,
      episodes: response.data.data.Page.media.episodes,
      synopsis: response.data.data.Page.media.description,
      season: response.data.data.Page.media.season,
      studio:
        response.data.data.Page.media.studios.nodes.length > 0
          ? response.data.data.Page.media.studios.nodes[0].name
          : null,
      producers: response.data.data.Page.media.studios.nodes.map(
        (item2: any) => item2.name
      ),
    };

    return {
      success: true,
      pagination: pagination,
      data: res,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown Err',
    };
  }
}

export async function fetchTopAiring(
  page: number = 1,
  perPage: number = 25,
  type: MediaType = MediaType.Anime,
  format: Format = Format.TV,
  status: Status = Status.RELEASING,
  isAdult: boolean = false,
  sort: Sort = Sort.SCORE_DESC
) {
  try {
    const variables = { page, perPage, type, format, status, isAdult, sort };
    const response = await axios.post(
      baseURL,
      {
        query: airingQuery,
        variables,
      },
      {
        headers: {
          'User-Agent': USER_AGENT_HEADER,
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Origin: Origin,
          Referer: Referer,
        },
      }
    );
    const pagination = {
      hasNextPage: response.data.data.Page.pageInfo.hasNextPage,
      total: response.data.data.Page.pageInfo.total,
      lastPage: response.data.data.Page.pageInfo.lastPage,
      currentPage: response.data.data.Page.pageInfo.currentPage,
      perPage: response.data.data.Page.pageInfo.perPage,
    };

    // const res = response.data.data.Page.media;
    const res = response.data.data.Page.media.map((item: any) => ({
      malId: item.idMal,
      anilistId: item.id,
      image:
        item.coverImage.extraLarge ??
        item.coverImage.large ??
        item.coverImage.medium,

      bannerImage:
        item.bannerImage ??
        item.coverImage.extraLarge ??
        item.coverImage.large ??
        item.coverImage.medium,
      title: {
        romaji: item.title.romaji ?? item.title.userPreferred,
        english: item.title.english,
        native: item.title.native,
      },
      trailer: item.trailer,
      type: item.type,
      status: item.status,
      duration: item.duration,
      score: item.meanScore ?? item.averageScore,
      genres: item.genres,
      episodes: item.episodes,
      synopsis: item.description,
      season: item.season,
      startDate: item.startDate
        ? new Date(
            item.startDate.year,
            item.startDate.month - 1,
            item.startDate.day
          ).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : null,
      endDate: item.endDate
        ? new Date(
            item.endDate.year,
            item.endDate.month - 1,
            item.endDate.day
          ).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : null,
      studio: item.studios.nodes.length > 0 ? item.studios.nodes[0].name : null,
      producers: item.studios.nodes.map((item2: any) => item2.name),
    }));
    return {
      success: true,
      pagination: pagination,
      data: res,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown Err',
    };
  }
}

export async function fetchPopular(
  page: number,
  perPage: number,
  type: MediaType,
  format: Format,
  isAdult: boolean,
  sort: Sort
) {
  try {
    const variables = { page, perPage, type, format, isAdult, sort };
    const response = await axios.post(
      baseURL,
      {
        query: popularAnimeQuery,
        variables,
      },
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': USER_AGENT_HEADER,
          Origin: Origin,
          Referer: Referer,
        },
      }
    );
    const pagination = {
      hasNextPage: response.data.data.Page.pageInfo.hasNextPage,
      total: response.data.data.Page.pageInfo.total,
      lastPage: response.data.data.Page.pageInfo.lastPage,
      currentPage: response.data.data.Page.pageInfo.currentPage,
      perPage: response.data.data.Page.pageInfo.perPage,
    };

    // const res = response.data.data.Page.media;
    const res = response.data.data.Page.media.map((item: any) => ({
      malId: item.idMal,
      anilistId: item.id,
      image:
        item.coverImage.extraLarge ??
        item.coverImage.large ??
        item.coverImage.medium,

      bannerImage:
        item.bannerImage ??
        item.coverImage.extraLarge ??
        item.coverImage.large ??
        item.coverImage.medium,
      title: {
        romaji: item.title.romaji ?? item.title.userPreferred,
        english: item.title.english,
        native: item.title.native,
      },
      trailer: item.trailer,
      type: item.type,
      status: item.status,
      duration: item.duration,
      score: item.meanScore ?? item.averageScore,
      genres: item.genres,
      episodes: item.episodes,
      synopsis: item.description,
      season: item.season,
      startDate: item.startDate
        ? new Date(
            item.startDate.year,
            item.startDate.month - 1,
            item.startDate.day
          ).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : null,
      endDate: item.endDate
        ? new Date(
            item.endDate.year,
            item.endDate.month - 1,
            item.endDate.day
          ).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : null,
      studio: item.studios.nodes.length > 0 ? item.studios.nodes[0].name : null,
      producers: item.studios.nodes.map((item2: any) => item2.name),
    }));
    return {
      success: true,
      pagination: pagination,
      data: res,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown err',
    };
  }
}

export async function fetchTopRated(
  page: number,
  perPage: number,
  isAdult: boolean,
  type: MediaType,
  sort: Sort,
  format?: Format
) {
  try {
    const variables = { page, perPage, type, format, isAdult, sort };
    const response = await axios.post(
      baseURL,
      {
        query: popularAnimeQuery,
        variables,
      },
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': USER_AGENT_HEADER,
          Origin: Origin,
          Referer: Referer,
        },
      }
    );
    const pagination = {
      hasNextPage: response.data.data.Page.pageInfo.hasNextPage,
      total: response.data.data.Page.pageInfo.total,
      lastPage: response.data.data.Page.pageInfo.lastPage,
      currentPage: response.data.data.Page.pageInfo.currentPage,
      perPage: response.data.data.Page.pageInfo.perPage,
    };

    // const res = response.data.data.Page.media;
    const res = response.data.data.Page.media.map((item: any) => ({
      malId: item.idMal,
      anilistId: item.id,
      image:
        item.coverImage.extraLarge ??
        item.coverImage.large ??
        item.coverImage.medium,

      bannerImage:
        item.bannerImage ??
        item.coverImage.extraLarge ??
        item.coverImage.large ??
        item.coverImage.medium,
      title: {
        romaji: item.title.romaji ?? item.title.userPreferred,
        english: item.title.english,
        native: item.title.native,
      },
      trailer: item.trailer,
      type: item.type,
      status: item.status,
      duration: item.duration,
      score: item.meanScore ?? item.averageScore,
      genres: item.genres,
      episodes: item.episodes,
      synopsis: item.description,
      season: item.season,
      startDate: item.startDate
        ? new Date(
            item.startDate.year,
            item.startDate.month - 1,
            item.startDate.day
          ).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : null,
      endDate: item.endDate
        ? new Date(
            item.endDate.year,
            item.endDate.month - 1,
            item.endDate.day
          ).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : null,
      studio: item.studios.nodes.length > 0 ? item.studios.nodes[0].name : null,
      producers: item.studios.nodes.map((item2: any) => item2.name),
    }));
    return {
      success: true,
      pagination: pagination,
      data: res,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown err',
    };
  }
}

export async function fetchSeason(
  page: number = 1,
  perPage: number = 25,
  type: MediaType = MediaType.Anime,
  format: Format = Format.TV,
  isAdult: boolean = false,
  season: Seasons,
  seasonYear: number,
  sort: Sort = Sort.POPULARITY_DESC
) {
  if (!season || !seasonYear) {
    return {
      success: false,
      error: 'Missing a required param : season | seasonYear',
    };
  }
  try {
    const variables = {
      page,
      perPage,
      type,
      format,
      isAdult,
      season,
      seasonYear,
      sort,
    };
    const response = await axios.post(
      baseURL,
      {
        query: seasonQuery,
        variables,
      },
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': USER_AGENT_HEADER,
          Origin: Origin,
          Referer: Referer,
        },
      }
    );
    const pagination = {
      hasNextPage: response.data.data.Page.pageInfo.hasNextPage,
      total: response.data.data.Page.pageInfo.total,
      lastPage: response.data.data.Page.pageInfo.lastPage,
      currentPage: response.data.data.Page.pageInfo.currentPage,
      perPage: response.data.data.Page.pageInfo.perPage,
    };

    // const res = response.data.data.Page.media;
    const res = response.data.data.Page.media.map((item: any) => ({
      malId: item.idMal,
      anilistId: item.id,
      image:
        item.coverImage.extraLarge ??
        item.coverImage.large ??
        item.coverImage.medium,

      bannerImage:
        item.bannerImage ??
        item.coverImage.extraLarge ??
        item.coverImage.large ??
        item.coverImage.medium,
      title: {
        romaji: item.title.romaji ?? item.title.userPreferred,
        english: item.title.english,
        native: item.title.native,
      },
      trailer: item.trailer,
      type: item.type,
      status: item.status,
      duration: item.duration,
      score: item.meanScore ?? item.averageScore,
      genres: item.genres,
      episodes: item.episodes,
      synopsis: item.description,
      season: item.season,
      startDate: item.startDate
        ? new Date(
            item.startDate.year,
            item.startDate.month - 1,
            item.startDate.day
          ).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : null,
      endDate: item.endDate
        ? new Date(
            item.endDate.year,
            item.endDate.month - 1,
            item.endDate.day
          ).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : null,
      studio: item.studios.nodes.length > 0 ? item.studios.nodes[0].name : null,
      producers: item.studios.nodes.map((item2: any) => item2.name),
    }));
    return {
      success: true,
      pagination: pagination,
      data: res,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown err',
    };
  }
}

export async function fetchAnimeCharacters(
  mediaId: number,
  sort: Charactersort,
  voiceActorsSort2: Charactersort
) {
  if (!mediaId) {
    return {
      success: false,
      error: 'Missing required parameter : mediaid!',
    };
  }

  try {
    const variables = { mediaId, sort, voiceActorsSort2 };
    const response = await axios.post(
      baseURL,
      {
        query: characterQuery,
        variables,
      },
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': USER_AGENT_HEADER,
          Origin: Origin,
          Referer: Referer,
        },
      }
    );
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown err',
    };
  }
}
