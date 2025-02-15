import axios from 'axios';
import {
  // bestAnitakuTitle,
  bestHianimeTitle,
  bestanimeZTitle,
} from './mapper.js';
import { AnimeZ, HiAnime } from '../../index.js';

import {
  characterQuery,
  fetchByIdQuery,
  mediaTrendQuery,
  popularAnimeQuery,
  relatedQuery,
  searchQuery,
  seasonQuery,
  topQuery,
} from './queries.js';
import { USER_AGENT_HEADER } from '../../index.js';
import { AnimeProvider, Charactersort, Format, MediaType, Seasons, Sort, Status } from '../../../types/types.js';
import { getAnilistMapping } from '../anizip/index.js';

const baseURL = `https://graphql.anilist.co`;
const Referer = 'https://anilist.co';
const Origin = 'https://anilist.co';

export interface ErrorResponse {
  success: boolean;
  status: number;
  error: string;
}
export interface SuccessResponse {
  success: true;
  status: number;
}
export type AnilistData = {
  malId: number;
  anilistId: number;
  image: string;
  color: string;
  bannerImage: string;
  title: {
    romaji: string;
    english: string;
    native: string;
  };
  trailer: string;
  type: string;
  format: string;
  status: string;
  duration: number;
  score: number;
  genres: string;
  episodes: number;
  synopsis: string;
  season: string;
  startDate: string;
  endDate: string;
  studio: string;
  producers: string[];
};
export type Pagination = {
  hasNextPage: boolean;
  total: number;
  lastPage: number;
  currentPage: number;
  perPage: number;
};
export interface SuccessAnilistResponse extends SuccessResponse {
  data: AnilistData[];
  hasNextPage: boolean;
  total: number;
  lastPage: number;
  currentPage: number;
  perPage: number;
}
export interface ErrorAnilistResponse extends ErrorResponse {
  data: [];
  hasNextPage: boolean;
  total: number;
  lastPage: number;
  currentPage: number;
  perPage: number;
}
export type AnilistSearch = SuccessAnilistResponse | ErrorAnilistResponse;
export async function searchAnime(
  search: string,
  page: number,
  perPage: number,
  type: MediaType = MediaType.Anime,
  isAdult: boolean = false,
): Promise<AnilistSearch> {
  if (!search) {
    return {
      success: false,
      hasNextPage: false,
      currentPage: 0,
      total: 0,
      lastPage: 0,
      perPage: 0,
      status: 400,
      data: [],
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
      },
    );
    if (!response.data)
      return {
        success: false,
        status: 204,
        error: 'Server returned an empty response',
        data: [],
        hasNextPage: false,
        currentPage: 0,
        total: 0,
        lastPage: 0,
        perPage: 0,
      };
    const pagination: Pagination = {
      hasNextPage: response.data.data.Page.pageInfo.hasNextPage,
      total: response.data.data.Page.pageInfo.total,
      lastPage: response.data.data.Page.pageInfo.lastPage,
      currentPage: response.data.data.Page.pageInfo.currentPage,
      perPage: response.data.data.Page.pageInfo.perPage,
    };

    const res: AnilistData[] = response.data.data.Page.media.map((item: any) => ({
      malId: item.idMal,
      anilistId: item.id,
      image: item.coverImage.extraLarge ?? item.coverImage.large ?? item.coverImage.medium,
      color: item.coverImage.color,
      bannerImage: item.bannerImage ?? item.coverImage.extraLarge ?? item.coverImage.large ?? item.coverImage.medium,
      title: {
        romaji: item.title.romaji ?? item.title.userPreferred,
        english: item.title.english,
        native: item.title.native,
      },
      trailer: item.trailer,
      type: item.type,
      format: item.format,
      status: item.status,
      duration: item.duration,
      score: item.meanScore ?? item.averageScore,
      genres: item.genres,
      episodes: item.episodes,
      synopsis: item.description,
      season: item.season,
      startDate:
        item.startDate && item.startDate.year
          ? new Date(item.startDate.year, item.startDate.month - 1, item.startDate.day).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          : 'Unknown',

      endDate:
        item.endDate && item.endDate.year
          ? new Date(item.endDate.year, item.endDate.month - 1, item.endDate.day).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          : 'Unknown',

      studio: item.studios.nodes.length > 0 ? item.studios.nodes[0].name : null,
      producers: item.studios.nodes.map((item2: any) => item2.name),
    }));

    return {
      success: true,
      status: 200,
      hasNextPage: pagination.hasNextPage,
      currentPage: pagination.currentPage,
      total: pagination.total,
      lastPage: pagination.lastPage,
      perPage: pagination.perPage,
      data: res,
    };
  } catch (error) {
    if (axios.isAxiosError(error))
      return {
        success: false,
        hasNextPage: false,
        currentPage: 0,
        total: 0,
        lastPage: 0,
        perPage: 0,
        data: [],
        error: `Request failed ${error.message}`,
        status: error.response?.status || 500,
      };
    return {
      success: false,
      hasNextPage: false,
      currentPage: 0,
      total: 0,
      lastPage: 0,
      perPage: 0,
      data: [],
      status: 500,
      error: error instanceof Error ? error.message : 'Contact dev ',
    };
  }
}

///
export interface SuccessAnilistInfoRes extends SuccessResponse {
  data: AnilistData;
}
export interface ErrorAnilistInfoRes extends ErrorResponse {
  data: null;
}
export type AnilistInfo = SuccessAnilistInfoRes | ErrorAnilistInfoRes;
export async function fetchAnimeById(id: number): Promise<AnilistInfo> {
  if (!id) {
    return {
      success: false,
      status: 400,
      data: null,
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
      },
    );

    if (!response.data)
      return {
        success: false,
        status: 204,
        error: 'Server returned an empty response',
        data: null,
      };

    const res: AnilistData = {
      malId: response.data.data.Media.idMal,
      anilistId: response.data.data.Media.id,
      image:
        response.data.data.Media.coverImage.extraLarge ??
        response.data.data.Media.coverImage.large ??
        response.data.data.Media.coverImage.medium,
      color: response.data.data.Media.coverImage.color,

      bannerImage:
        response.data.data.Media.bannerImage ??
        response.data.data.Media.coverImage.extraLarge ??
        response.data.data.Media.coverImage.large ??
        response.data.data.Media.coverImage.medium,

      title: {
        romaji: response.data.data.Media.title.romaji ?? response.data.data.Media.title.userPreferred,
        english: response.data.data.Media.title.english,
        native: response.data.data.Media.title.native,
      },
      trailer: response.data.data.Media.trailer,
      type: response.data.data.Media.type,
      format: response.data.data.Media.format,
      status: response.data.data.Media.status,
      duration: response.data.data.Media.duration,
      score: response.data.data.Media.meanScore ?? response.data.data.media.averageScore,
      genres: response.data.data.Media.genres,
      episodes: response.data.data.Media.episodes,
      synopsis: response.data.data.Media.description,
      season: response.data.data.Media.season,
      startDate:
        response.data.data.Media.startDate && response.data.data.Media.startDate.year
          ? new Date(
              response.data.data.Media.startDate.year,
              response.data.data.Media.startDate.month - 1,
              response.data.data.Media.startDate.day,
            ).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          : 'Unknown',

      endDate:
        response.data.data.Media.endDate && response.data.data.Media.endDate.year
          ? new Date(
              response.data.data.Media.endDate.year,
              response.data.data.Media.endDate.month - 1,
              response.data.data.Media.endDate.day,
            ).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          : 'Unknown',

      studio: response.data.data.Media.studios.nodes.length > 0 ? response.data.data.Media.studios.nodes[0].name : null,
      producers: response.data.data.Media.studios.nodes.map((item2: any) => item2.name),
    };

    return {
      success: true,
      status: 200,
      data: res,
    };
  } catch (error) {
    if (axios.isAxiosError(error))
      return {
        success: false,
        data: null,
        error: `Request failed ${error.message}`,
        status: error.response?.status || 500,
      };
    return {
      success: false,
      data: null,
      status: 500,
      error: error instanceof Error ? error.message : 'Unknown Err',
    };
  }
}

export type AnilistUpcoming = SuccessAnilistResponse | ErrorAnilistResponse;
export async function fetchUpcoming(
  page: number,
  perPage: number,
  type: MediaType = MediaType.Anime,
  status: Status = Status.NOT_YET_RELEASED,
  isAdult: boolean = false,
  sort: Sort = Sort.POPULARITY_DESC,
): Promise<AnilistUpcoming> {
  try {
    const variables = { page, perPage, type, status, isAdult, sort };
    const response = await axios.post(
      baseURL,
      {
        query: topQuery,
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
      },
    );
    if (!response.data)
      return {
        success: false,
        status: 204,
        error: 'Server returned an empty response',
        data: [],
        hasNextPage: false,
        currentPage: 0,
        total: 0,
        lastPage: 0,
        perPage: 0,
      };
    const pagination: Pagination = {
      hasNextPage: response.data.data.Page.pageInfo.hasNextPage,
      total: response.data.data.Page.pageInfo.total,
      lastPage: response.data.data.Page.pageInfo.lastPage,
      currentPage: response.data.data.Page.pageInfo.currentPage,
      perPage: response.data.data.Page.pageInfo.perPage,
    };
    const res: AnilistData[] = response.data.data.Page.media.map((item: any) => ({
      malId: item.idMal,
      anilistId: item.id,
      image: item.coverImage.extraLarge ?? item.coverImage.large ?? item.coverImage.medium,
      bannerImage: item.bannerImage ?? item.coverImage.extraLarge ?? item.coverImage.large ?? item.coverImage.medium,
      title: {
        romaji: item.title.romaji ?? item.title.userPreferred,
        english: item.title.english,
        native: item.title.native,
      },
      trailer: item.trailer,
      type: item.type,
      status: item.status,
      genres: item.genres,
      synopsis: item.description,
      startDate:
        item.startDate && item.startDate.year
          ? new Date(item.startDate.year, item.startDate.month - 1, item.startDate.day).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          : 'Unknown',

      studio: item.studios.nodes.length > 0 ? item.studios.nodes[0].name : null,
      producers: item.studios.nodes.map((item2: any) => item2.name),
    }));

    return {
      success: true,
      status: 200,
      hasNextPage: pagination.hasNextPage,
      currentPage: pagination.currentPage,
      total: pagination.total,
      lastPage: pagination.lastPage,
      perPage: pagination.perPage,
      data: res,
    };
  } catch (error) {
    if (axios.isAxiosError(error))
      return {
        success: false,
        hasNextPage: false,
        currentPage: 0,
        total: 0,
        lastPage: 0,
        perPage: 0,
        data: [],
        error: `Request failed ${error.message}`,
        status: error.response?.status || 500,
      };
    return {
      success: false,
      hasNextPage: false,
      currentPage: 0,
      status: 500,
      total: 0,
      lastPage: 0,
      perPage: 0,
      data: [],

      error: error instanceof Error ? error.message : 'Unknown Err',
    };
  }
}

//

export type AnilistTopAiring = SuccessAnilistResponse | ErrorAnilistResponse;
export async function fetchTopAiring(
  page: number,
  perPage: number,
  type: MediaType = MediaType.Anime,
  format: Format = Format.TV,
  status: Status = Status.RELEASING,
  isAdult: boolean = false,
  sort: Sort = Sort.SCORE_DESC,
): Promise<AnilistTopAiring> {
  try {
    const variables = { page, perPage, type, format, status, isAdult, sort };
    const response = await axios.post(
      baseURL,
      {
        query: topQuery,
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
      },
    );
    if (!response.data)
      return {
        success: false,
        status: 204,
        error: 'Server returned an empty response',
        hasNextPage: false,
        currentPage: 0,
        total: 0,
        lastPage: 0,
        perPage: 0,
        data: [],
      };
    const pagination: Pagination = {
      hasNextPage: response.data.data.Page.pageInfo.hasNextPage,
      total: response.data.data.Page.pageInfo.total,
      lastPage: response.data.data.Page.pageInfo.lastPage,
      currentPage: response.data.data.Page.pageInfo.currentPage,
      perPage: response.data.data.Page.pageInfo.perPage,
    };
    const res: AnilistData[] = response.data.data.Page.media.map((item: any) => ({
      malId: item.idMal,
      anilistId: item.id,
      image: item.coverImage.extraLarge ?? item.coverImage.large ?? item.coverImage.medium,

      bannerImage: item.bannerImage ?? item.coverImage.extraLarge ?? item.coverImage.large ?? item.coverImage.medium,
      title: {
        romaji: item.title.romaji ?? item.title.userPreferred,
        english: item.title.english,
        native: item.title.native,
      },
      trailer: item.trailer,
      type: item.type,
      format: item.format,
      status: item.status,
      duration: item.duration,
      score: item.meanScore ?? item.averageScore,
      genres: item.genres,
      episodes: item.episodes,
      synopsis: item.description,
      season: item.season,
      startDate:
        item.startDate && item.startDate.year
          ? new Date(item.startDate.year, item.startDate.month - 1, item.startDate.day).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          : 'Unknown',

      endDate:
        item.endDate && item.endDate.year
          ? new Date(item.endDate.year, item.endDate.month - 1, item.endDate.day).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          : 'Unknown',

      studio: item.studios.nodes.length > 0 ? item.studios.nodes[0].name : null,
      producers: item.studios.nodes.map((item2: any) => item2.name),
    }));

    return {
      success: true,
      status: 200,
      hasNextPage: pagination.hasNextPage,
      currentPage: pagination.currentPage,
      total: pagination.total,
      lastPage: pagination.lastPage,
      perPage: pagination.perPage,
      data: res,
    };
  } catch (error) {
    if (axios.isAxiosError(error))
      return {
        success: false,
        hasNextPage: false,
        currentPage: 0,
        total: 0,
        lastPage: 0,
        perPage: 0,
        data: [],
        error: `Request failed ${error.message}`,
        status: error.response?.status || 500,
      };
    return {
      success: false,
      hasNextPage: false,
      currentPage: 0,
      status: 500,
      total: 0,
      lastPage: 0,
      perPage: 0,
      data: [],
      error: error instanceof Error ? error.message : 'Unknown Err',
    };
  }
}
export type AnilistMostPopular = SuccessAnilistResponse | ErrorAnilistResponse;
export async function fetchPopular(
  page: number,
  perPage: number,
  format: Format,
  type: MediaType = MediaType.Anime,
  isAdult: boolean = false,
  sort: Sort = Sort.POPULARITY_DESC,
): Promise<AnilistMostPopular> {
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
      },
    );
    if (!response.data)
      return {
        success: false,
        status: 204,
        error: 'Server returned an empty response',
        hasNextPage: false,
        currentPage: 0,
        total: 0,
        lastPage: 0,
        perPage: 0,
        data: [],
      };
    const pagination: Pagination = {
      hasNextPage: response.data.data.Page.pageInfo.hasNextPage,
      total: response.data.data.Page.pageInfo.total,
      lastPage: response.data.data.Page.pageInfo.lastPage,
      currentPage: response.data.data.Page.pageInfo.currentPage,
      perPage: response.data.data.Page.pageInfo.perPage,
    };

    const res: AnilistData[] = response.data.data.Page.media.map((item: any) => ({
      malId: item.idMal,
      anilistId: item.id,
      image: item.coverImage.extraLarge ?? item.coverImage.large ?? item.coverImage.medium,

      bannerImage: item.bannerImage ?? item.coverImage.extraLarge ?? item.coverImage.large ?? item.coverImage.medium,
      title: {
        romaji: item.title.romaji ?? item.title.userPreferred,
        english: item.title.english,
        native: item.title.native,
      },
      trailer: item.trailer,
      type: item.type,
      format: item.format,
      status: item.status,
      duration: item.duration,
      score: item.meanScore ?? item.averageScore,
      genres: item.genres,
      episodes: item.episodes,
      synopsis: item.description,
      season: item.season,
      startDate:
        item.startDate && item.startDate.year
          ? new Date(item.startDate.year, item.startDate.month - 1, item.startDate.day).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          : 'Unknown',

      endDate:
        item.endDate && item.endDate.year
          ? new Date(item.endDate.year, item.endDate.month - 1, item.endDate.day).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          : 'Unknown',

      studio: item.studios.nodes.length > 0 ? item.studios.nodes[0].name : null,
      producers: item.studios.nodes.map((item2: any) => item2.name),
    }));
    return {
      success: true,
      status: 200,
      hasNextPage: pagination.hasNextPage,
      currentPage: pagination.currentPage,
      total: pagination.total,
      lastPage: pagination.lastPage,
      perPage: pagination.perPage,
      data: res,
    };
  } catch (error) {
    if (axios.isAxiosError(error))
      return {
        success: false,
        hasNextPage: false,
        currentPage: 0,
        total: 0,
        lastPage: 0,
        perPage: 0,
        data: [],
        error: `Request failed ${error.message}`,
        status: error.response?.status || 500,
      };
    return {
      success: false,
      status: 500,
      hasNextPage: false,
      currentPage: 0,
      total: 0,
      lastPage: 0,
      perPage: 0,
      data: [],
      error: error instanceof Error ? error.message : 'Unknown err',
    };
  }
}
export type AnilistTopRated = SuccessAnilistResponse | ErrorAnilistResponse;
export async function fetchTopRated(
  page: number,
  perPage: number,
  format: Format,
  isAdult: boolean = false,
  type: MediaType = MediaType.Anime,
  sort: Sort = Sort.SCORE_DESC,
): Promise<AnilistTopRated> {
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
      },
    );
    if (!response.data)
      return {
        success: false,
        status: 204,
        error: 'Server returned an empty response',
        hasNextPage: false,
        currentPage: 0,
        total: 0,
        lastPage: 0,
        perPage: 0,
        data: [],
      };
    const pagination: Pagination = {
      hasNextPage: response.data.data.Page.pageInfo.hasNextPage,
      total: response.data.data.Page.pageInfo.total,
      lastPage: response.data.data.Page.pageInfo.lastPage,
      currentPage: response.data.data.Page.pageInfo.currentPage,
      perPage: response.data.data.Page.pageInfo.perPage,
    };

    const res: AnilistData[] = response.data.data.Page.media.map((item: any) => ({
      malId: item.idMal,
      anilistId: item.id,
      image: item.coverImage.extraLarge ?? item.coverImage.large ?? item.coverImage.medium,

      bannerImage: item.bannerImage ?? item.coverImage.extraLarge ?? item.coverImage.large ?? item.coverImage.medium,
      title: {
        romaji: item.title.romaji ?? item.title.userPreferred,
        english: item.title.english,
        native: item.title.native,
      },
      trailer: item.trailer,
      type: item.type,
      format: item.format,
      status: item.status,
      duration: item.duration,
      score: item.meanScore ?? item.averageScore,
      genres: item.genres,
      episodes: item.episodes,
      synopsis: item.description,
      season: item.season,
      startDate:
        item.startDate && item.startDate.year
          ? new Date(item.startDate.year, item.startDate.month - 1, item.startDate.day).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          : 'Unknown',

      endDate:
        item.endDate && item.endDate.year
          ? new Date(item.endDate.year, item.endDate.month - 1, item.endDate.day).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          : 'Unknown',

      studio: item.studios.nodes.length > 0 ? item.studios.nodes[0].name : null,
      producers: item.studios.nodes.map((item2: any) => item2.name),
    }));
    return {
      success: true,
      status: 200,
      hasNextPage: pagination.hasNextPage,
      currentPage: pagination.currentPage,
      total: pagination.total,
      lastPage: pagination.lastPage,
      perPage: pagination.perPage,
      data: res,
    };
  } catch (error) {
    if (axios.isAxiosError(error))
      return {
        success: false,
        hasNextPage: false,
        currentPage: 0,
        total: 0,
        lastPage: 0,
        perPage: 0,
        data: [],
        error: `Request failed ${error.message}`,
        status: error.response?.status || 500,
      };
    return {
      success: false,
      status: 500,
      hasNextPage: false,
      currentPage: 0,
      total: 0,
      lastPage: 0,
      perPage: 0,
      data: [],
      error: error instanceof Error ? error.message : 'Unknown err',
    };
  }
}
export type AnilistSeason = SuccessAnilistResponse | ErrorAnilistResponse;
export async function fetchSeason(
  season: Seasons,
  seasonYear: number,
  page: number,
  perPage: number,
  format: Format,
  isAdult: boolean = false,
  type: MediaType = MediaType.Anime,
  sort: Sort = Sort.POPULARITY_DESC,
): Promise<AnilistSeason> {
  if (!season || !seasonYear) {
    return {
      success: false,
      status: 400,
      hasNextPage: false,
      currentPage: 0,
      total: 0,
      lastPage: 0,
      perPage: 0,
      data: [],
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
      },
    );
    if (!response.data)
      return {
        success: false,
        status: 204,
        error: 'Server returned an empty response',
        hasNextPage: false,
        currentPage: 0,
        total: 0,
        lastPage: 0,
        perPage: 0,
        data: [],
      };
    const pagination: Pagination = {
      hasNextPage: response.data.data.Page.pageInfo.hasNextPage,
      total: response.data.data.Page.pageInfo.total,
      lastPage: response.data.data.Page.pageInfo.lastPage,
      currentPage: response.data.data.Page.pageInfo.currentPage,
      perPage: response.data.data.Page.pageInfo.perPage,
    };

    const res: AnilistData[] = response.data.data.Page.media.map((item: any) => ({
      malId: item.idMal,
      anilistId: item.id,
      image: item.coverImage.extraLarge ?? item.coverImage.large ?? item.coverImage.medium,

      bannerImage: item.bannerImage ?? item.coverImage.extraLarge ?? item.coverImage.large ?? item.coverImage.medium,
      title: {
        romaji: item.title.romaji ?? item.title.userPreferred,
        english: item.title.english,
        native: item.title.native,
      },
      trailer: item.trailer,
      type: item.type,
      format: item.format,
      status: item.status,
      duration: item.duration,
      score: item.meanScore ?? item.averageScore,
      genres: item.genres,
      episodes: item.episodes,
      synopsis: item.description,
      season: item.season,
      startDate:
        item.startDate && item.startDate.year
          ? new Date(item.startDate.year, item.startDate.month - 1, item.startDate.day).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          : 'Unknown',

      endDate:
        item.endDate && item.endDate.year
          ? new Date(item.endDate.year, item.endDate.month - 1, item.endDate.day).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          : 'Unknown',

      studio: item.studios.nodes.length > 0 ? item.studios.nodes[0].name : null,
      producers: item.studios.nodes.map((item2: any) => item2.name),
    }));
    return {
      success: true,
      status: 200,
      hasNextPage: pagination.hasNextPage,
      currentPage: pagination.currentPage,
      total: pagination.total,
      lastPage: pagination.lastPage,
      perPage: pagination.perPage,
      data: res,
    };
  } catch (error) {
    if (axios.isAxiosError(error))
      return {
        success: false,
        hasNextPage: false,
        currentPage: 0,
        total: 0,
        lastPage: 0,
        perPage: 0,
        data: [],
        error: `Request failed ${error.message}`,
        status: error.response?.status || 500,
      };
    return {
      success: false,
      status: 500,
      hasNextPage: false,
      currentPage: 0,
      total: 0,
      lastPage: 0,
      perPage: 0,
      data: [],
      error: error instanceof Error ? error.message : 'Unknown err',
    };
  }
}

//
export type AnilistTrends = SuccessAnilistResponse | ErrorAnilistResponse;
export async function getTrends(page: number, perPage: number): Promise<AnilistTrends> {
  const variables = {
    page,
    perPage,
  };
  try {
    const response = await axios.post(
      baseURL,
      {
        query: mediaTrendQuery,
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
      },
    );
    if (!response.data)
      return {
        success: false,
        status: 204,
        error: 'Server returned an empty response',
        hasNextPage: false,
        currentPage: 0,
        total: 0,
        lastPage: 0,
        perPage: 0,
        data: [],
      };
    const pagination: Pagination = {
      hasNextPage: response.data.data.Page.pageInfo.hasNextPage,
      total: response.data.data.Page.pageInfo.total,
      lastPage: response.data.data.Page.pageInfo.lastPage,
      currentPage: response.data.data.Page.pageInfo.currentPage,
      perPage: response.data.data.Page.pageInfo.perPage,
    };

    const res: AnilistData[] = response.data.data.Page.media.map((item: any) => ({
      malId: item.idMal,
      anilistId: item.id,
      image: item.coverImage.extraLarge ?? item.coverImage.large ?? item.coverImage.medium,
      title: {
        romaji: item.title.romaji ?? item.title.userPreferred,
        english: item.title.english,
        native: item.title.native,
      },
      format: item.format,
      status: item.status,
      popularity: item.popularity,
      score: item.meanScore ?? item.averageScore,
      genres: item.genres,
      episodes: item.episodes,
      synopsis: item.description,
      season: item.season,
      startDate:
        item.startDate && item.startDate.year
          ? new Date(item.startDate.year, item.startDate.month - 1, item.startDate.day).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          : 'Unknown',

      endDate:
        item.endDate && item.endDate.year
          ? new Date(item.endDate.year, item.endDate.month - 1, item.endDate.day).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          : 'Unknown',

      studio: item.studios.nodes.length > 0 ? item.studios.nodes[0].name : null,
      producers: item.studios?.nodes.map((item2: any) => item2.name),
    }));
    return {
      success: true,
      status: 200,
      hasNextPage: pagination.hasNextPage,
      currentPage: pagination.currentPage,
      total: pagination.total,
      lastPage: pagination.lastPage,
      perPage: pagination.perPage,
      data: res,
    };
  } catch (error) {
    if (axios.isAxiosError(error))
      return {
        success: false,
        hasNextPage: false,
        currentPage: 0,
        total: 0,
        lastPage: 0,
        perPage: 0,
        data: [],
        error: `Request failed ${error.message}`,
        status: error.response?.status || 500,
      };
    return {
      success: false,
      status: 500,
      hasNextPage: false,
      currentPage: 0,
      total: 0,
      lastPage: 0,
      perPage: 0,
      data: [],
      error: error instanceof Error ? error.message : 'Unknown err',
    };
  }
}
export type RelatedAnilistData = {
  anilistId: number;
  malId: number;
  title: {
    romaji: string;
    english: string;
    native: string;
  };
  type: string;
  score: number;
  image: string;
  bannerImage: string;
  color: string;
};
export interface SuccessRelatedRes extends SuccessResponse {
  data: RelatedAnilistData[];
}
export interface ErrorRelatedRes extends ErrorResponse {
  data: [];
}
export type AnilistRelatedData = SuccessRelatedRes | ErrorRelatedRes;
export async function getRelated(mediaId: number, type: MediaType = MediaType.Anime): Promise<AnilistRelatedData> {
  if (!mediaId)
    return {
      success: false,
      status: 400,
      data: [],
      error: 'Missing a required param : season | seasonYear',
    };
  const variables = {
    mediaId,
    type,
  };
  try {
    const response = await axios.post(
      baseURL,
      {
        query: relatedQuery,
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
      },
    );
    if (!response.data)
      return {
        success: false,
        status: 204,
        error: 'Server returned an empty response',
        data: [],
      };

    const res: RelatedAnilistData[] = response.data.data.Media.relations.edges.map((item: any) => ({
      anilistId: item.node.id,
      malId: item.node.idMal,
      title: {
        romaji: item.node.title.romaji ?? item.node.title.userPreferred,
        english: item.node.title.english,
        native: item.node.title.native,
      },
      type: item.node.type,
      score: item.node.averageScore ?? item.node.meanScore,
      image: item.node.coverImage.extraLarge ?? item.node.coverImage.large ?? item.node.coverImage.medium,
      bannerImage: item.node.bannerImage ?? item.node.coverImage.extraLarge ?? item.node.coverImage.large,
      color: item.node.coverImage.color ?? null,
    }));

    return {
      success: true,
      status: 200,
      data: res,
    };
  } catch (error) {
    if (axios.isAxiosError(error))
      return {
        success: false,
        data: [],
        error: `Request failed ${error.message}`,
        status: error.response?.status || 500,
      };
    return {
      success: false,
      data: [],
      status: 500,
      error: error instanceof Error ? error.message : 'Unknown Err',
    };
  }
}
type character = {
  role: string;
  id: number;
  name: string;
  image: string;
  voiceActors: voiceActors[];
};
type voiceActors = {
  name: string;
  image: string;
  language: string;
};
export type ACharacters = {
  anilistId: number;
  malId: number;
  title: {
    romaji: string;
    english: string;
    native: string;
  };
  characters: character[];
};
export interface SuccessAnilistCharacterRes extends SuccessResponse {
  data: ACharacters;
}
export interface ErrorAnilistCharacterRes extends ErrorResponse {
  data: null;
}
export type AnilistCharacters = SuccessAnilistCharacterRes | ErrorAnilistCharacterRes;
export async function fetchAnimeCharacters(
  mediaId: number,
  sort: Charactersort,
  voiceActorsSort2: Charactersort,
): Promise<AnilistCharacters> {
  if (!mediaId) {
    return {
      success: false,
      status: 400,
      data: null,
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
      },
    );
    if (!response.data)
      return {
        success: false,
        status: 204,
        error: 'Server returned an empty response',
        data: null,
      };
    const res: ACharacters = {
      malId: response.data.data.Media.idMal,
      anilistId: response.data.data.Media.id,
      title: {
        romaji: response.data.data.Media.title.romaji ?? response.data.data.Media.title.userPreferred,
        english: response.data.data.Media.title.english,
        native: response.data.data.Media.title.native,
      },
      characters: response.data.data?.Media.characters.edges.map((item: any) => ({
        role: item.role,
        id: item.node.id,
        name: item.node.name.full,
        image: item.node.image.large ?? item.node.image.medium,
        voiceActors: item.voiceActors.map((item2: any) => ({
          name: item2.name.full,
          language: item2.languageV2,
          image: item2.image.large ?? item2.image.medium,
        })),
      })),
    };

    return {
      success: true,
      status: 200,
      data: res,
    };
  } catch (error) {
    if (axios.isAxiosError(error))
      return {
        success: false,
        data: null,
        error: `Request failed ${error.message}`,
        status: error.response?.status || 500,
      };
    return {
      success: false,
      status: 500,
      data: null,
      error: error instanceof Error ? error.message : 'Unknown err',
    };
  }
}

type AnimeZRes = {
  animeId: string;
  name: string;
  altName: string;
  score: number;
};
type hianimeRes = {
  animeId: string;
  name: string;
  romaji: string;
  score: number;
};
export interface SuccessAnilistProviderId extends SuccessAnilistInfoRes {
  data: AnilistData;
  animeZ: AnimeZRes;
  hiAnime: hianimeRes;
}
export interface ErrorAnilistProviderId extends ErrorAnilistInfoRes {
  data: null;
  animeZ: null;
  hiAnime: null;
}
export type AnilistProviderId = SuccessAnilistProviderId | ErrorAnilistProviderId;
export async function fetchProviderId(id: number): Promise<AnilistProviderId> {
  if (!id) {
    return {
      success: false,
      status: 400,
      data: null,
      animeZ: null,
      hiAnime: null,
      error: 'Invalid or missing required parameter: id!',
    };
  }

  try {
    const anilistData = await fetchAnimeById(id);
    if (!anilistData?.data?.title) {
      throw new Error('Title not found.');
    }

    const titles = anilistData.data.title;
    const englishTitle = titles.english?.split(':')?.at(0)?.trim() || '';
    const userPref = titles.romaji?.split(' ').slice(0, 3).join(' ') || '';

    const searchAnimeZ = async (title: string) => {
      try {
        const result = await new AnimeZ().search(title);
        return (
          result.data?.map((item: any) => ({
            animeId: item.id,
            name: item.title,
            romaji: item.altName,
          })) || []
        );
      } catch (error) {
        console.error('Error fetching from AnimeZ:', error);
        return [];
      }
    };

    const searchHiAnime = async (title: string) => {
      try {
        const result = await new HiAnime().search(title);
        return (
          result.data?.map((item: any) => ({
            animeId: item.id,
            name: item.name,
            romaji: item.romanji,
          })) || []
        );
      } catch (error) {
        console.error('Error fetching from HiAnime:', error);
        return [];
      }
    };

    const [animeZResults, hiAnimeResults] = await Promise.allSettled([searchAnimeZ(englishTitle), searchHiAnime(userPref)]);

    const data = {
      hiAnime: hiAnimeResults.status === 'fulfilled' ? bestHianimeTitle(titles, hiAnimeResults.value) : null,
      animeZ: animeZResults.status === 'fulfilled' ? bestanimeZTitle(titles, animeZResults.value) : null,
    };

    return {
      success: true,
      status: 200,
      data: anilistData.data,
      hiAnime: data.hiAnime as hianimeRes,
      animeZ: data.animeZ as AnimeZRes,
    };
  } catch (error) {
    return {
      success: false,
      status: 500,
      data: null,
      animeZ: null,
      hiAnime: null,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
type pagination = {
  hasNextPage: boolean;
  currentPage: number;
  totalPages: number;
};
type animeRes = {
  episodeId: string;
  number: number;
  title?: string;
  // category?: string;
};

type CrossMatchedEpisodes = {
  episodeNumber: number;
  rating: number;
  aired: boolean;
  episodeId: string;
  title: string;
  overview: string;
  thumbnail: string;
};

export interface SuccessEpisodesres extends SuccessResponse {
  data: AnilistData;
  pagination?: pagination;
  episodes: animeRes[] | CrossMatchedEpisodes[];
}
export interface ErrorEpisodesres extends ErrorResponse {
  data: null;
}
export type AnilistEpisodes = SuccessEpisodesres | ErrorEpisodesres;
export async function getEpisodeswithInfo(
  anilistId: number,
  provider: AnimeProvider,
  page: number,
): Promise<AnilistEpisodes> {
  if (!anilistId && !provider) {
    return {
      success: false,
      status: 400,
      data: null,
      error: 'Missing required parameter : id! || provider',
    };
  }
  try {
    const anilistData = await fetchProviderId(anilistId);
    const zoro = anilistData.hiAnime;
    const animezId = anilistData.animeZ;

    const fetchEpisodesHianime = async (animeId: string) => {
      const hiAnime = new HiAnime();
      try {
        const result = await hiAnime.fetchEpisodes(animeId);
        return result.data.map((item: any) => ({
          episodeId: item.episodeId,
          number: item.number,
          title: item.title,
        }));
      } catch (error) {
        console.error('Error fetching from HiAnime:', error);
        return null;
      }
    };
    const fetchEpisodesAnimeZ = async (id: string, page: number) => {
      const animeZ = new AnimeZ();
      try {
        const result = await animeZ.fetchEpisodes(id, page);
        const pagination = {
          hasNextPage: result.hasNextPage,
          currentPage: result.currentPage,
          totalPages: result.totalPages,
        };
        const data = {
          pagination: pagination,
          result: result.data?.map((item: any) => ({
            episodeId: item.episodeId as string,
            number: item.number as number,
            // category: item.category as string,
          })),
        };
        return data;
      } catch (error) {
        console.error('Error fetching from AnimeZ:', error);
        return null;
      }
    };
    if (animezId && zoro) {
      switch (provider) {
        case AnimeProvider.AnimeZ:
          if (anilistId === 21 || anilistId === 269) {
            const response = await fetchEpisodesAnimeZ(animezId.animeId as string, page as number);
            return {
              success: true,
              status: 200,
              data: anilistData.data,
              pagination: response?.pagination as pagination,
              episodes: response?.result as animeRes[],
            };
          } else {
            const [animeZ, aniMapping] = await Promise.all([
              fetchEpisodesAnimeZ(animezId.animeId as string, page as number),
              getAnilistMapping(anilistId),
            ]);

            const episodeMap = new Map(aniMapping.episodes?.map(item => [item.episodeAnimeNumber, item]));

            const matchingResults = animeZ?.result.map((anime: any) => {
              const episodes = episodeMap.get(anime.number);

              return {
                episodeNumber: episodes?.episodeAnimeNumber ?? anime.number ?? null,
                rating: episodes?.rating ?? null,
                aired: episodes?.aired ?? null,
                episodeId: anime.episodeId ?? null,
                title: episodes?.title?.english ?? episodes?.title?.romanizedJapanese ?? null,
                overview: episodes?.overview ?? 'No overview available',
                thumbnail: episodes?.image ?? null,
              };
            });

            if (animeZ && matchingResults)
              return {
                success: true,
                status: 200,
                data: anilistData.data,
                pagination: animeZ.pagination as pagination,
                episodes: matchingResults as CrossMatchedEpisodes[],
              };
          }
        case AnimeProvider.HiAnime:
          if (anilistId === 21 || anilistId === 269) {
            const response = await fetchEpisodesHianime(zoro.animeId as string);
            return {
              success: true,
              status: 200,
              data: anilistData.data,
              episodes: response as animeRes[],
            };
          } else {
            const [hianime, aniMapping2] = await Promise.all([
              fetchEpisodesHianime(zoro.animeId as string),
              getAnilistMapping(anilistId),
            ]);

            const episodeMap2 = new Map(aniMapping2.episodes?.map(item => [item.episodeAnimeNumber, item]));

            const matchingResults2 = hianime?.map((anime: any) => {
              const episodes = episodeMap2.get(anime.number);

              return {
                episodeNumber: episodes?.episodeAnimeNumber ?? anime.number ?? null,
                rating: episodes?.rating ?? null,
                aired: episodes?.aired ?? null,
                episodeId: anime.episodeId ?? null,
                title: episodes?.title?.english ?? episodes?.title?.romanizedJapanese ?? null,
                overview: episodes?.overview ?? 'No overview available',
                thumbnail: episodes?.image ?? null,
              };
            });

            return {
              success: true,
              status: 200,
              data: anilistData.data,
              episodes: matchingResults2 as CrossMatchedEpisodes[],
            };
          }
      }
    }
  } catch (error) {
    if (axios.isAxiosError(error))
      return {
        success: false,
        data: null,
        error: `Request failed ${error.message}`,
        status: error.response?.status || 500,
      };
    return {
      success: false,
      data: null,
      status: 500,
      error: error instanceof Error ? error.message : 'Unknown Err',
    };
  }
  return {
    success: false,
    data: null,
    status: 500,
    error: 'yea its messed up',
  };
}
