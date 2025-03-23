import axios from 'axios';
import { AnimeProvider, Format, Seasons, JikanStatus } from '../../../types/types.js';
import { bestTitleMatch } from '../../../utils/mapper.js';
import { getMalMapping } from '../anizip/index.js';
import { HiAnime } from '../../anime/hianime/index.js';
import { AnimeKai } from '../../anime/animekai/index.js';
import { normalizeLowerCaseSeason, normalizeLowerCaseFormat } from '../../../utils/normalize.js';

const jikanBaseUrl = 'https://api.jikan.moe/v4';

export interface ErrorResponse {
  success: boolean;
  status: number;
  error: string;
}
export interface SuccessResponse {
  success: boolean;
  status: number;
}
export type JIkanData = {
  malId: number;
  image: string;
  bannerImage: string;
  title: {
    romaji: string;
    english: string;
    native: string;
  };
  trailer: string;
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
export interface SuccessJIkanRes extends SuccessResponse {
  data: JIkanData[];
  hasNextPage: boolean;
  total: number;
  lastPage: number;
  currentPage: number;
  perPage: number;
}
export interface ErrorJIkanRes extends ErrorResponse {
  data: [];
  hasNextPage: boolean;
  total: number;
  lastPage: number;
  currentPage: number;
  perPage: number;
}
export type JIkanSearch = SuccessJIkanRes | ErrorJIkanRes;
export async function searchAnime(query: string, page: number, limit: number): Promise<JIkanSearch> {
  if (!query) {
    return {
      success: false,
      status: 400,
      hasNextPage: false,
      total: 0,
      lastPage: 0,
      currentPage: 0,
      perPage: 0,
      data: [],
      error: 'Missing required fields : search',
    };
  }
  try {
    const response = await axios.get(`${jikanBaseUrl}/anime?q=${query}&page=${page}&limit=${limit}`);
    if (!response.data)
      return {
        success: response.status === 200,
        status: response.status,
        error: 'Server returned an empty response',
        hasNextPage: false,
        total: 0,
        lastPage: 0,
        currentPage: 0,
        perPage: 0,
        data: [],
      };
    const pagination: Pagination = {
      hasNextPage: response.data.pagination.has_next_page,
      lastPage: response.data.pagination.last_visible_page,
      currentPage: page,
      total: response.data.pagination.items.total,
      perPage: response.data.pagination.items.per_page,
    };
    const search: JIkanData[] = response.data.data.map((item: any) => ({
      malId: item.mal_id,
      title: {
        romaji: item.title,
        english: item.title_english,
        native: item.title_japanese,
      },
      image: item.images.jpg.large_image_url ?? item.images.webp.large_image_url,
      bannerImage: item.images.jpg.large_image_url ?? item.images.webp.large_image_url,
      trailer: item.trailer.embed_url ?? item.trailer.url,
      episodes: item.episodes,
      startDate:
        item.aired.prop && item.aired.prop.from.year
          ? new Date(item.aired.prop.from.year, item.aired.prop.from.month - 1, item.aired.prop.from.day).toLocaleString(
              'en-US',
              {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              },
            )
          : item.aired.from || 'Unknown',

      endDate:
        item.aired.prop && item.aired.prop.to.year
          ? new Date(item.aired.prop.to.year, item.aired.prop.to.month - 1, item.aired.prop.to.day).toLocaleString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          : item.aired.to || 'Unknown',
      format: item.type,
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
      success: response.status === 200,
      status: response.status,
      hasNextPage: pagination.hasNextPage,
      total: pagination.total,
      lastPage: pagination.lastPage,
      currentPage: pagination.currentPage,
      perPage: pagination.perPage,
      data: search as JIkanData[],
    };
  } catch (error) {
    if (axios.isAxiosError(error))
      return {
        success: false,
        status: error.response?.status || 500,
        error: `Request failed ${error.message}`,
        hasNextPage: false,
        total: 0,
        lastPage: 0,
        currentPage: 0,
        perPage: 0,
        data: [],
      };
    return {
      success: false,
      status: 500,
      error: error instanceof Error ? error.message : 'Unknown err ',
      hasNextPage: false,
      total: 0,
      lastPage: 0,
      currentPage: 0,
      perPage: 0,
      data: [],
    };
  }
}
export interface SuccessJIkanInfo extends SuccessResponse {
  data: JIkanData;
}
export interface ErrorJikanInfo extends ErrorResponse {
  data: null;
}
export type JikanInfo = SuccessJIkanInfo | ErrorJikanInfo;
export async function getInfoById(Id: number): Promise<JikanInfo> {
  if (!Id) {
    return {
      success: false,
      error: 'Missing required parameter : MALId!',
      status: 400,
      data: null,
    };
  }
  try {
    const response = await axios.get(`${jikanBaseUrl}/anime/${Id}`);
    if (!response.data)
      return {
        success: response.status === 200,
        status: response.status,
        error: response.statusText || 'Server returned an empty response',
        data: null,
      };
    const animeInfo: JIkanData = {
      malId: response.data.data.mal_id,
      title: {
        romaji: response.data.data.title,
        english: response.data.data.title_english,
        native: response.data.data.title_japanese,
      },
      image: response.data.data.images.jpg.large_image_url ?? response.data.data.images.webp.large_image_url,
      bannerImage: response.data.data.images.jpg.large_image_url ?? response.data.data.images.webp.large_image_url,
      trailer: response.data.data.trailer.embed_url ?? response.data.data.trailer.url,
      episodes: response.data.data.episodes,

      startDate:
        response.data.data.aired.prop && response.data.data.aired.prop.from.year
          ? new Date(
              response.data.data.aired.prop.from.year,
              response.data.data.aired.prop.from.month - 1,
              response.data.data.aired.prop.from.day,
            ).toLocaleString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          : response.data.data.aired.from || 'Unknown',

      endDate:
        response.data.data.aired.prop && response.data.data.aired.prop.to.year
          ? new Date(
              response.data.data.aired.prop.to.year,
              response.data.data.aired.prop.to.month - 1,
              response.data.data.aired.prop.to.day,
            ).toLocaleString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          : response.data.data.aired.to || 'Unknown',
      format: response.data.data.type,
      status: response.data.data.status,
      genres: response.data.data.genres.map((item2: any) => item2.name),
      duration: response.data.data.duration,
      score: response.data.data.score,
      synopsis: response.data.data.synopsis,
      season: response.data.data.season,
      studio: response.data.data.studios,
      producers: response.data.data.producers,
    };
    return {
      success: response.status === 200,
      status: response.status,
      data: animeInfo as JIkanData,
    };
  } catch (error) {
    if (axios.isAxiosError(error))
      return {
        success: false,
        status: error.response?.status || 500,
        error: `Request failed ${error.message}`,
        data: null,
      };
    return {
      success: false,
      status: 500,
      error: error instanceof Error ? error.message : 'Unknown err ',
      data: null,
    };
  }
}
type Char = {
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
export interface SuccessCharJikanRes extends SuccessResponse {
  data: Char[];
}
export interface ErrorCharJikanRes extends ErrorResponse {
  data: [];
}
export type JikanCharacters = SuccessCharJikanRes | ErrorCharJikanRes;
export async function getAnimeCharacters(id: number): Promise<JikanCharacters> {
  if (!id) {
    return {
      success: false,
      error: 'Missing required parameter : MALId!',
      status: 400,
      data: [],
    };
  }
  try {
    const response = await axios.get(`${jikanBaseUrl}/anime/${id}/characters`);
    if (!response.data)
      return {
        success: response.status === 200,
        status: response.status,
        error: response.statusText || 'Server returned an empty response',
        data: [],
      };
    const res: Char[] = response.data.data.map((item: any) => ({
      role: item.role,
      id: item.character.mal_id,
      name: item.character.name,
      image:
        item.character.images.jpg.image_url ??
        item.character.images.webp.image_url ??
        item.character.images.webp.small_image_url,

      voiceActors: item.voice_actors.map((item2: any) => ({
        name: item2.person.name,
        image: item2.person.images.jpg.image_url,
        language: item2.language,
      })),
    }));
    return {
      success: response.status === 200,
      status: response.status,
      data: res as Char[],
    };
  } catch (error) {
    if (axios.isAxiosError(error))
      return {
        success: false,
        status: error.response?.status || 500,
        error: `Request failed ${error.message}`,
        data: [],
      };
    return {
      success: false,
      status: 500,
      error: error instanceof Error ? error.message : 'Unknown err ',
      data: [],
    };
  }
}

export type JikanSeason = SuccessJIkanRes | ErrorJIkanRes;

export async function getCurrentSeason(page: number, limit: number, filter: Format): Promise<JikanSeason> {
  if (!filter) {
    return {
      success: false,
      status: 400,
      error: 'Missing required parameter : filter!',
      hasNextPage: false,
      total: 0,
      lastPage: 0,
      currentPage: 0,
      perPage: 0,
      data: [],
    };
  }
  const newFormat = filter.toLowerCase();
  try {
    const response = await axios.get(`${jikanBaseUrl}/seasons/now?filter=${newFormat}&?sfw&page=${page}&limit=${limit}`);
    if (!response.data)
      return {
        success: response.status === 200,
        status: response.status,
        error: response.statusText || 'Server returned an empty response',
        hasNextPage: false,
        total: 0,
        lastPage: 0,
        currentPage: 0,
        perPage: 0,
        data: [],
      };

    const res = response.data;
    const pagination: Pagination = {
      hasNextPage: res.pagination.has_next_page,
      lastPage: res.pagination.last_visible_page,
      currentPage: page,
      total: res.pagination.items.total,
      perPage: res.pagination.items.per_page,
    };
    const currentSeason: JIkanData[] = res.data.map((item: any) => ({
      malId: item.mal_id,
      title: {
        romaji: item.title,
        english: item.title_english,
        native: item.title_japanese,
      },
      image: item.images.jpg.large_image_url ?? item.images.webp.large_image_url,
      bannerImage: item.images.jpg.large_image_url ?? item.images.webp.large_image_url,
      trailer: item.trailer.embed_url ?? item.trailer.url,
      episodes: item.episodes,
      startDate:
        item.aired.prop && item.aired.prop.from.year
          ? new Date(item.aired.prop.from.year, item.aired.prop.from.month - 1, item.aired.prop.from.day).toLocaleString(
              'en-US',
              {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              },
            )
          : item.aired.from || 'Unknown',

      endDate:
        item.aired.prop && item.aired.prop.to.year
          ? new Date(item.aired.prop.to.year, item.aired.prop.to.month - 1, item.aired.prop.to.day).toLocaleString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          : item.aired.to || 'Unknown',
      format: item.type,
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
      success: response.status === 200,
      status: response.status,
      hasNextPage: pagination.hasNextPage,
      total: pagination.total,
      lastPage: pagination.lastPage,
      currentPage: pagination.currentPage,
      perPage: pagination.perPage,
      data: currentSeason as JIkanData[],
    };
  } catch (error) {
    if (axios.isAxiosError(error))
      return {
        success: false,
        status: error.response?.status || 500,
        error: `Request failed ${error.message}`,
        hasNextPage: false,
        total: 0,
        lastPage: 0,
        currentPage: 0,
        perPage: 0,
        data: [],
      };
    return {
      success: false,
      status: 500,
      error: error instanceof Error ? error.message : 'Unknown err ',
      hasNextPage: false,
      total: 0,
      lastPage: 0,
      currentPage: 0,
      perPage: 0,
      data: [],
    };
  }
}

export async function getNextSeason(page: number, limit: number, filter: Format): Promise<JikanSeason> {
  if (!filter) {
    return {
      success: false,
      status: 400,
      error: 'Missing required parameter :filter!',
      hasNextPage: false,
      total: 0,
      lastPage: 0,
      currentPage: 0,
      perPage: 0,
      data: [],
    };
  }
  const newFormat = filter.toLowerCase();
  try {
    const response = await axios.get(
      `${jikanBaseUrl}/seasons/upcoming?filter=${newFormat}&?sfw&page=${page}&limit=${limit}`,
    );
    if (!response.data)
      return {
        success: response.status === 200,
        status: response.status,
        error: response.statusText || 'Server returned an empty response',
        hasNextPage: false,
        total: 0,
        lastPage: 0,
        currentPage: 0,
        perPage: 0,
        data: [],
      };
    const res = response.data;
    const pagination: Pagination = {
      hasNextPage: res.pagination.has_next_page,
      lastPage: res.pagination.last_visible_page,
      currentPage: page,
      total: res.pagination.items.total,
      perPage: res.pagination.items.per_page,
    };

    const NextSeason: JIkanData[] = res.data.map((item: any) => ({
      malId: item.mal_id,
      title: {
        romaji: item.title,
        english: item.title_english,
        native: item.title_japanese,
      },
      image: item.images.jpg.large_image_url ?? item.images.webp.large_image_url,
      bannerImage: item.images.jpg.large_image_url ?? item.images.webp.large_image_url,
      trailer: item.trailer.embed_url ?? item.trailer.url,
      episodes: item.episodes,
      startDate:
        item.aired.prop && item.aired.prop.from.year
          ? new Date(item.aired.prop.from.year, item.aired.prop.from.month - 1, item.aired.prop.from.day).toLocaleString(
              'en-US',
              {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              },
            )
          : item.aired.from || 'Unknown',

      endDate:
        item.aired.prop && item.aired.prop.to.year
          ? new Date(item.aired.prop.to.year, item.aired.prop.to.month - 1, item.aired.prop.to.day).toLocaleString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          : item.aired.to || 'Unknown',
      format: item.type,
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
      success: response.status === 200,
      status: response.status,
      hasNextPage: pagination.hasNextPage,
      total: pagination.total,
      lastPage: pagination.lastPage,
      currentPage: pagination.currentPage,
      perPage: pagination.perPage,
      data: NextSeason as JIkanData[],
    };
  } catch (error) {
    if (axios.isAxiosError(error))
      return {
        success: false,
        status: error.response?.status || 500,
        error: `Request failed ${error.message}`,
        hasNextPage: false,
        total: 0,
        lastPage: 0,
        currentPage: 0,
        perPage: 0,
        data: [],
      };
    return {
      success: false,
      status: 500,
      error: error instanceof Error ? error.message : 'Unknown err ',
      hasNextPage: false,
      total: 0,
      lastPage: 0,
      currentPage: 0,
      perPage: 0,
      data: [],
    };
  }
}

export async function getSeason(
  year: number,
  season: Seasons,
  filter: Format,
  page: number,
  limit: number,
): Promise<JikanSeason> {
  if (!year || !season) {
    return {
      success: false,
      status: 400,
      error: 'Missing required parameter : year & season',
      hasNextPage: false,
      total: 0,
      lastPage: 0,
      currentPage: 0,
      perPage: 0,
      data: [],
    };
  }
  try {
    const newseason = normalizeLowerCaseSeason(season);
    const format = normalizeLowerCaseFormat(filter);
    const response = await axios.get(
      `${jikanBaseUrl}/seasons/${year}/${newseason}?filter=${format}&?sfw&page=${page}&limit=${limit}`,
    );
    if (!response.data)
      return {
        success: response.status === 200,
        status: response.status,
        error: response.statusText || 'Server returned an empty response',
        hasNextPage: false,
        total: 0,
        lastPage: 0,
        currentPage: 0,
        perPage: 0,
        data: [],
      };

    const res = response.data;
    const pagination: Pagination = {
      hasNextPage: res.pagination.has_next_page,
      lastPage: res.pagination.last_visible_page,
      currentPage: page,
      total: res.pagination.items.total,
      perPage: res.pagination.items.per_page,
    };

    const Season: JIkanData[] = res.data.map((item: any) => ({
      malId: item.mal_id,
      title: {
        romaji: item.title,
        english: item.title_english,
        native: item.title_japanese,
      },
      image: item.images.jpg.large_image_url ?? item.images.webp.large_image_url,
      bannerImage: item.images.jpg.large_image_url ?? item.images.webp.large_image_url,
      trailer: item.trailer.embed_url ?? item.trailer.url,
      episodes: item.episodes,

      startDate:
        item.aired.prop && item.aired.prop.from.year
          ? new Date(item.aired.prop.from.year, item.aired.prop.from.month - 1, item.aired.prop.from.day).toLocaleString(
              'en-US',
              {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              },
            )
          : item.aired.from || 'Unknown',

      endDate:
        item.aired.prop && item.aired.prop.to.year
          ? new Date(item.aired.prop.to.year, item.aired.prop.to.month - 1, item.aired.prop.to.day).toLocaleString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          : item.aired.to || 'Unknown',
      format: item.type,
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
      success: response.status === 200,
      status: response.status,
      hasNextPage: pagination.hasNextPage,
      total: pagination.total,
      lastPage: pagination.lastPage,
      currentPage: pagination.currentPage,
      perPage: pagination.perPage,
      data: Season as JIkanData[],
    };
  } catch (error) {
    if (axios.isAxiosError(error))
      return {
        success: false,
        status: error.response?.status || 500,
        error: `Request failed ${error.message}`,
        hasNextPage: false,
        total: 0,
        lastPage: 0,
        currentPage: 0,
        perPage: 0,
        data: [],
      };
    return {
      success: false,
      status: 500,
      error: error instanceof Error ? error.message : 'Unknown err ',
      hasNextPage: false,
      total: 0,
      lastPage: 0,
      currentPage: 0,
      perPage: 0,
      data: [],
    };
  }
}
export type JikanTopAnime = SuccessJIkanRes | ErrorJIkanRes;
export async function getTopUpcoming(
  page: number,
  perPage: number,
  filter: JikanStatus = JikanStatus.Upcoming,
): Promise<JikanTopAnime> {
  try {
    const response = await axios.get(`${jikanBaseUrl}/top/anime?filter=${filter}&?sfw&page=${page}&limit=${perPage}`);
    if (!response.data)
      return {
        success: response.status === 200,
        status: response.status,
        error: response.statusText || 'Server returned an empty response',
        hasNextPage: false,
        total: 0,
        lastPage: 0,
        currentPage: 0,
        perPage: 0,
        data: [],
      };
    const res = response.data;
    const pagination: Pagination = {
      hasNextPage: res.pagination.has_next_page,
      lastPage: res.pagination.last_visible_page,
      currentPage: page,
      total: res.pagination.items.total,
      perPage: res.pagination.items.per_page,
    };

    const topAnime: JIkanData[] = res.data.map((item: any) => ({
      malId: item.mal_id,
      title: {
        romaji: item.title,
        english: item.title_english,
        native: item.title_japanese,
      },
      image: item.images.jpg.large_image_url ?? item.images.webp.large_image_url,
      bannerImage: item.images.jpg.large_image_url ?? item.images.webp.large_image_url,
      trailer: item.trailer.embed_url ?? item.trailer.url,
      episodes: item.episodes,

      startDate:
        item.aired.prop && item.aired.prop.from.year
          ? new Date(item.aired.prop.from.year, item.aired.prop.from.month - 1, item.aired.prop.from.day).toLocaleString(
              'en-US',
              {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              },
            )
          : item.aired.from || 'Unknown',

      endDate:
        item.aired.prop && item.aired.prop.to.year
          ? new Date(item.aired.prop.to.year, item.aired.prop.to.month - 1, item.aired.prop.to.day).toLocaleString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          : item.aired.to || 'Unknown',

      format: item.type,
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
      success: response.status === 200,
      status: response.status,
      hasNextPage: pagination.hasNextPage,
      total: pagination.total,
      lastPage: pagination.lastPage,
      currentPage: pagination.currentPage,
      perPage: pagination.perPage,
      data: topAnime as JIkanData[],
    };
  } catch (error) {
    if (axios.isAxiosError(error))
      return {
        success: false,
        status: error.response?.status || 500,
        error: `Request failed ${error.message}`,
        hasNextPage: false,
        total: 0,
        lastPage: 0,
        currentPage: 0,
        perPage: 0,
        data: [],
      };
    return {
      success: false,
      status: 500,
      error: error instanceof Error ? error.message : 'Unknown err ',
      hasNextPage: false,
      total: 0,
      lastPage: 0,
      currentPage: 0,
      perPage: 0,
      data: [],
    };
  }
}
export async function getTopAnime(page: number, limit: number, filter: JikanStatus, type: Format): Promise<JikanTopAnime> {
  try {
    const format = normalizeLowerCaseFormat(type);
    const response = await axios.get(
      `${jikanBaseUrl}/top/anime?filter=${filter}&type=${format}&?sfw&page=${page}&limit=${limit}`,
    );
    if (!response.data)
      return {
        success: response.status === 200,
        status: response.status,
        error: response.statusText || 'Server returned an empty response',
        hasNextPage: false,
        total: 0,
        lastPage: 0,
        currentPage: 0,
        perPage: 0,
        data: [],
      };
    const res = response.data;
    const pagination: Pagination = {
      hasNextPage: res.pagination.has_next_page,
      lastPage: res.pagination.last_visible_page,
      currentPage: page,
      total: res.pagination.items.total,
      perPage: res.pagination.items.per_page,
    };

    const topAnime: JIkanData[] = res.data.map((item: any) => ({
      malId: item.mal_id,
      title: {
        romaji: item.title,
        english: item.title_english,
        native: item.title_japanese,
      },
      image: item.images.jpg.large_image_url ?? item.images.webp.large_image_url,
      bannerImage: item.images.jpg.large_image_url ?? item.images.webp.large_image_url,
      trailer: item.trailer.embed_url ?? item.trailer.url,
      episodes: item.episodes,

      startDate:
        item.aired.prop && item.aired.prop.from.year
          ? new Date(item.aired.prop.from.year, item.aired.prop.from.month - 1, item.aired.prop.from.day).toLocaleString(
              'en-US',
              {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              },
            )
          : item.aired.from || 'Unknown',

      endDate:
        item.aired.prop && item.aired.prop.to.year
          ? new Date(item.aired.prop.to.year, item.aired.prop.to.month - 1, item.aired.prop.to.day).toLocaleString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          : item.aired.to || 'Unknown',
      format: item.type,
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
      success: response.status === 200,
      status: response.status,
      hasNextPage: pagination.hasNextPage,
      total: pagination.total,
      lastPage: pagination.lastPage,
      currentPage: pagination.currentPage,
      perPage: pagination.perPage,
      data: topAnime as JIkanData[],
    };
  } catch (error) {
    if (axios.isAxiosError(error))
      return {
        success: false,
        status: error.response?.status || 500,
        error: `Request failed ${error.message}`,
        hasNextPage: false,
        total: 0,
        lastPage: 0,
        currentPage: 0,
        perPage: 0,
        data: [],
      };
    return {
      success: false,
      status: 500,
      error: error instanceof Error ? error.message : 'Unknown err ',
      hasNextPage: false,
      total: 0,
      lastPage: 0,
      currentPage: 0,
      perPage: 0,
      data: [],
    };
  }
}
type episodePagination = {
  hasNextPage: boolean;
  currentPage: number;
  lastPage: number;
};
type EpisodeRes = {
  number: number;
  title: string;
  filler: boolean;
  recap?: boolean;
  score?: number;
};
export interface SuccessJikanEpisodes extends SuccessResponse {
  data: EpisodeRes[];
  hasNextPage: boolean;
  currentPage: number;
  lastPage: number;
}
export interface ErrorJikanEpisodes extends ErrorResponse {
  data: [];
  hasNextPage: boolean;
  currentPage: number;
  lastPage: number;
}
export type JikanEpisodes = SuccessJikanEpisodes | ErrorJikanEpisodes;
export async function getEpisodes(id: number, page: number): Promise<JikanEpisodes> {
  if (!id) {
    return {
      success: false,
      status: 400,
      error: 'Missing required parameter : Malid!',
      data: [],
      hasNextPage: false,
      currentPage: 0,
      lastPage: 0,
    };
  }

  try {
    const response = await axios.get(`${jikanBaseUrl}/anime/${id}/episodes?page=${page}`);
    if (!response.data)
      return {
        success: response.status === 200,
        status: response.status,
        error: response.statusText || 'Server returned an empty response',
        data: [],
        hasNextPage: false,
        currentPage: 0,
        lastPage: 0,
      };
    const pagination: episodePagination = {
      hasNextPage: response.data.pagination.has_next_page,
      lastPage: response.data.pagination.last_visible_page,
      currentPage: page,
    };

    const data: EpisodeRes[] = response.data.data.map((item: any) => ({
      number: item.mal_id,
      title: item.title,
      filler: item.filler,
      recap: item.recap,
      score: item.score,
    }));
    return {
      success: response.status === 200,
      status: response.status,
      hasNextPage: pagination.hasNextPage,
      currentPage: pagination.currentPage,
      lastPage: pagination.lastPage,
      data: data as EpisodeRes[],
    };
  } catch (error) {
    if (axios.isAxiosError(error))
      return {
        success: false,
        status: error.response?.status || 500,
        error: `Request failed ${error.message}`,
        hasNextPage: false,
        lastPage: 0,
        currentPage: 0,
        data: [],
      };
    return {
      success: false,
      status: 500,
      error: error instanceof Error ? error.message : 'Unknown err ',
      hasNextPage: false,
      lastPage: 0,
      currentPage: 0,
      data: [],
    };
  }
}
export interface SuccessJikanEpisodesInfo extends SuccessResponse {
  data: EpisodeRes;
}
export interface ErrorJikanEpisodesInfo extends ErrorResponse {
  data: null;
}
export type JikanEpisodeInfo = SuccessJikanEpisodesInfo | ErrorJikanEpisodesInfo;
export async function getEpisodeInfo(Id: number, episodeNumber: number): Promise<JikanEpisodeInfo> {
  if (!Id && !episodeNumber) {
    return {
      success: false,
      status: 400,
      error: 'Missing required parameter : Malid! || episodeNumber',
      data: null,
    };
  }

  try {
    const response = await axios.get(`${jikanBaseUrl}/anime/${Id}/episodes/${episodeNumber}`);
    if (!response.data)
      return {
        success: response.status === 200,
        status: response.status,
        error: response.statusText || 'Server returned an empty response',
        data: null,
      };
    const data = {
      number: response.data.data.mal_id,
      title: response.data.data.title,
      duration: Number(response.data.data.duration) / 60 || null,
      filler: response.data.data.filler,
      synopsis: response.data.data.synopsis,
    };
    return {
      success: response.status === 200,
      status: response.status,
      data: data,
    };
  } catch (error) {
    if (axios.isAxiosError(error))
      return {
        success: false,
        status: error.response?.status || 500,
        error: `Request failed ${error.message}`,
        data: null,
      };
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown err ',
      data: null,
      status: 500,
    };
  }
}

type titleRes = {
  animeId: string;
  name: string;
  romaji: string;
  score: number;
};
export interface SuccessJikanProviderId extends SuccessJIkanInfo {
  data: JIkanData;
  animeProvider: titleRes;
}
export interface ErrorJikanProviderId extends ErrorJikanInfo {
  data: null;
  animeProvider: null;
}
export type JikanProviderId = SuccessJikanProviderId | ErrorJikanProviderId;
async function getZoroProviderId(id: number): Promise<JikanProviderId> {
  if (!id) {
    return {
      success: false,
      status: 400,
      error: 'Invalid or missing required parameter: MALId!',
      data: null,
      animeProvider: null,
    };
  }

  try {
    const Jikan = await getInfoById(id);
    if (!Jikan?.data?.title) {
      throw new Error('Title not found.');
    }

    const titles = Jikan.data.title;

    const userPref = titles.romaji?.split(' ').slice(0, 3).join(' ') || '';

    const searchZoro = async (title: string) => {
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

    const ZoroResults = await searchZoro(userPref);

    const data = {
      animeInfo: Jikan,
      zoro: bestTitleMatch(titles, ZoroResults),
    };

    return {
      success: true,
      status: 200,
      data: Jikan.data,
      animeProvider: data.zoro as titleRes,
    };
  } catch (error) {
    return {
      success: false,
      status: 500,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      data: null,
      animeProvider: null,
    };
  }
}

async function getKaiProviderId(id: number): Promise<JikanProviderId> {
  if (!id) {
    return {
      success: false,
      status: 400,
      error: 'Invalid or missing required parameter: MALId!',
      data: null,
      animeProvider: null,
    };
  }

  try {
    const Jikan = await getInfoById(id);
    if (!Jikan?.data?.title) {
      throw new Error('Title not found.');
    }

    const titles = Jikan.data.title;

    const userPref = titles.english;

    const searchKai = async (title: string) => {
      try {
        const result = await new AnimeKai().search(title);
        return (
          result.data?.map((item: any) => ({
            animeId: item.id,
            name: item.title,
            romaji: item.romaji,
          })) || []
        );
      } catch (error) {
        console.error('Error fetching from HiAnime:', error);
        return [];
      }
    };

    const KaiResults = await searchKai(userPref);

    const data = {
      animeInfo: Jikan,
      kai: bestTitleMatch(titles, KaiResults),
    };

    return {
      success: true,
      status: 200,
      data: Jikan.data,
      animeProvider: data.kai as titleRes,
    };
  } catch (error) {
    return {
      success: false,
      status: 500,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      data: null,
      animeProvider: null,
    };
  }
}

export async function getAnimeProviderIdWithInfo(id: number, provider: AnimeProvider): Promise<JikanProviderId> {
  if (!id) {
    return {
      success: false,
      status: 400,
      error: 'Invalid or missing required parameter: MALId!',
      data: null,
      animeProvider: null,
    };
  }
  try {
    switch (provider) {
      case AnimeProvider.Animekai:
        const response = await getKaiProviderId(id);
        return response;
      default:
        AnimeProvider.HiAnime;
        const data = await getZoroProviderId(id);
        return data;
    }
  } catch (error) {
    return {
      success: false,
      status: 500,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      data: null,
      animeProvider: null,
    };
  }
}

type animeRes = {
  episodeId: string;
  episodeNumber: number;
  title: string;
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
  data: JIkanData;

  providerEpisodes: animeRes[] | CrossMatchedEpisodes[];
}
export interface ErrorEpisodesres extends ErrorResponse {
  data: null;
  providerEpisodes: [];
}
export type JikanMatchedEpisodes = SuccessEpisodesres | ErrorEpisodesres;
async function getZoroEpisodeswithInfo(jikanId: number): Promise<JikanMatchedEpisodes> {
  if (!jikanId) {
    return {
      success: false,
      status: 400,
      error: 'Missing required parameter : MALId',
      providerEpisodes: [],
      data: null,
    };
  }
  try {
    const Jikan = await getZoroProviderId(jikanId);
    const zoro = Jikan.animeProvider;

    const fetchZoroEpisodes = async (animeId: string) => {
      const zoro = new HiAnime();
      try {
        const result = await zoro.fetchEpisodes(animeId);
        return (
          result.data?.map((item: any) => ({
            episodeId: item.episodeId,
            episodeNumber: item.number,
            title: item.title,
          })) || []
        );
      } catch (error) {
        console.error('Error fetching from HiAnime:', error);
        return null;
      }
    };

    if (zoro) {
      if (Jikan.data.episodes == null || Jikan.data.episodes > 64) {
        const zoroEpisodes = await fetchZoroEpisodes(zoro.animeId as string);
        return {
          success: true,
          status: 200,
          data: Jikan.data,
          providerEpisodes: zoroEpisodes as animeRes[],
        };
      } else {
        const [zoroanime, aniMapping2] = await Promise.all([
          fetchZoroEpisodes(zoro.animeId as string),
          getMalMapping(jikanId),
        ]);

        const episodeMap2 = new Map(aniMapping2.episodes?.map(item => [item.episodeAnimeNumber, item]));

        const matchingResults2 = zoroanime?.map((anime: any) => {
          const episodes = episodeMap2.get(anime.episodeNumber);

          return {
            episodeNumber: episodes?.episodeAnimeNumber ?? anime.episodeNumber ?? null,
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
          data: Jikan.data,
          providerEpisodes: matchingResults2 as CrossMatchedEpisodes[],
        };
      }
    }
  } catch (error) {
    if (axios.isAxiosError(error))
      return {
        success: false,
        status: error.response?.status || 500,
        error: `Request failed ${error.message}`,
        data: null,
        providerEpisodes: [],
      };
    return {
      success: false,
      status: 500,
      error: error instanceof Error ? error.message : 'Unknown err ',
      data: null,
      providerEpisodes: [],
    };
  }
  return {
    success: false,
    status: 500,
    error: 'Check the MALId',
    data: null,
    providerEpisodes: [],
  };
}
async function getEpisodeswithInfoKai(jikanId: number): Promise<JikanMatchedEpisodes> {
  if (!jikanId) {
    return {
      success: false,
      status: 400,
      error: 'Missing required parameter : MALid! ',
      providerEpisodes: [],
      data: null,
    };
  }
  try {
    const Jikan = await getKaiProviderId(jikanId);
    const kai = Jikan.animeProvider;

    const fetchKaiEpisodes = async (animeId: string) => {
      const kai = new AnimeKai();
      try {
        const result = await kai.fetchAnimeInfo(animeId);
        return (
          result.providerEpisodes.map((item: any) => ({
            episodeId: item.episodeId,
            episodeNumber: item.number,
            title: item.title,
          })) || []
        );
      } catch (error) {
        console.error('Error fetching from HiAnime:', error);
        return null;
      }
    };

    if (kai) {
      if (Jikan.data.episodes == null || Jikan.data.episodes > 64) {
        const AnimekaiEpisodes = await fetchKaiEpisodes(kai.animeId as string);
        return {
          success: true,
          status: 200,
          data: Jikan.data,
          providerEpisodes: AnimekaiEpisodes as animeRes[],
        };
      } else {
        const [animekaiEps, aniMapping2] = await Promise.all([
          fetchKaiEpisodes(kai.animeId as string),
          getMalMapping(jikanId),
        ]);

        const episodeMap2 = new Map(aniMapping2.episodes?.map(item => [item.episodeAnimeNumber, item]));

        const matchingResults2 = animekaiEps?.map((anime: any) => {
          const episodes = episodeMap2.get(anime.episodeNumber);

          return {
            episodeNumber: episodes?.episodeAnimeNumber ?? anime.episodeNumber ?? null,
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
          data: Jikan.data,
          providerEpisodes: matchingResults2 as CrossMatchedEpisodes[],
        };
      }
    }
  } catch (error) {
    if (axios.isAxiosError(error))
      return {
        success: false,
        status: error.response?.status || 500,
        error: `Request failed ${error.message}`,
        data: null,
        providerEpisodes: [],
      };
    return {
      success: false,
      status: 500,
      error: error instanceof Error ? error.message : 'Unknown err ',
      data: null,
      providerEpisodes: [],
    };
  }
  return {
    success: false,
    status: 500,
    error: 'Check for malId',
    data: null,
    providerEpisodes: [],
  };
}

export async function getAnimeProviderEpisodes(id: number, provider: AnimeProvider): Promise<JikanMatchedEpisodes> {
  if (!id) {
    return {
      success: false,
      status: 400,
      error: 'Missing required parameter : id! || provider',
      data: null,
      providerEpisodes: [],
    };
  }
  try {
    switch (provider) {
      case AnimeProvider.Animekai:
        const data = await getEpisodeswithInfoKai(id);
        return data;

      default:
        AnimeProvider.HiAnime;
        const response = await getZoroEpisodeswithInfo(id);
        return response;
    }
  } catch (error) {
    return {
      success: false,
      status: 500,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      data: null,
      providerEpisodes: [],
    };
  }
}
