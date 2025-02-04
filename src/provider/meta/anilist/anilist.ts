import axios from 'axios';

import {
  airingQuery,
  characterQuery,
  fetchByIdQuery,
  popularAnimeQuery,
  searchQuery,
  seasonQuery,
} from './queries.js';

import {
  MediaType,
  Format,
  Status,
  Sort,
  Seasons,
  Charactersort,
} from './types.js';
import { USER_AGENT_HEADER } from '../../index.js';

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
    return {
      success: true,
      data: response.data.data,
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

    return {
      success: true,
      data: response.data.data,
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
    return {
      success: true,
      data: response.data.data,
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
