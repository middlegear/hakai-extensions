import axios from 'axios';
import { Format, Seasons, Status } from '../../../types/types.js';
import { RakuzanAnime } from '../../index.js';
import { ZoroAnimeTitle } from './mapperjikan.js';
import { getMalMapping } from '../anizip/index.js';

const jikanBaseUrl = 'https://api.jikan.moe/v4';

export interface ErrorResponse {
  success: boolean;
  status: number;
  error: string;
}
export interface SuccessResponse {
  success: true;
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
    const { data } = await axios.get(`${jikanBaseUrl}/anime?q=${query}&page=${page}&limit=${limit}`);
    if (!data)
      return {
        success: false,
        status: 204,
        error: 'Server returned an empty response',
        hasNextPage: false,
        total: 0,
        lastPage: 0,
        currentPage: 0,
        perPage: 0,
        data: [],
      };
    const pagination: Pagination = {
      hasNextPage: data.pagination.has_next_page,
      lastPage: data.pagination.last_visible_page,
      currentPage: page,
      total: data.pagination.items.total,
      perPage: data.pagination.items.per_page,
    };
    const search: JIkanData[] = data.data.map((item: any) => ({
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
      success: true,
      status: 200,
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
        hasNextPage: false,
        total: 0,
        lastPage: 0,
        currentPage: 0,
        perPage: 0,
        data: [],
        error: `Request failed ${error.message}`,
        status: error.response?.status || 500,
      };
    return {
      success: false,
      hasNextPage: false,
      total: 0,
      lastPage: 0,
      currentPage: 0,
      perPage: 0,
      data: [],
      status: 500,
      error: error instanceof Error ? error.message : 'Unknown err ',
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
      status: 400,
      data: null,
      error: 'Missing required parameter : id!',
    };
  }
  try {
    const { data } = await axios.get(`${jikanBaseUrl}/anime/${Id}`);
    if (!data)
      return {
        success: false,
        status: 204,
        error: 'Server returned an empty response',
        data: null,
      };
    const animeInfo: JIkanData = {
      malId: data.data.mal_id,
      title: {
        romaji: data.data.title,
        english: data.data.title_english,
        native: data.data.title_japanese,
      },
      image: data.data.images.jpg.large_image_url ?? data.data.images.webp.large_image_url,
      bannerImage: data.data.images.jpg.large_image_url ?? data.data.images.webp.large_image_url,
      trailer: data.data.trailer.embed_url ?? data.data.trailer.url,
      episodes: data.data.episodes,

      startDate:
        data.data.aired.prop && data.data.aired.prop.from.year
          ? new Date(
              data.data.aired.prop.from.year,
              data.data.aired.prop.from.month - 1,
              data.data.aired.prop.from.day,
            ).toLocaleString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          : data.data.aired.from || 'Unknown',

      endDate:
        data.data.aired.prop && data.data.aired.prop.to.year
          ? new Date(
              data.data.aired.prop.to.year,
              data.data.aired.prop.to.month - 1,
              data.data.aired.prop.to.day,
            ).toLocaleString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          : data.data.aired.to || 'Unknown',
      format: data.data.type,
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
      status: 200,
      data: animeInfo as JIkanData,
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
      error: error instanceof Error ? error.message : 'Unknown err ',
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
      status: 400,
      data: [],
      error: 'Missing required parameter : id!',
    };
  }
  try {
    const { data } = await axios.get(`${jikanBaseUrl}/anime/${id}/characters`);
    if (!data)
      return {
        success: false,
        status: 204,
        error: 'Server returned an empty response',
        data: [],
      };
    const res: Char[] = data.data.map((item: any) => ({
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
      success: true,
      status: 200,
      data: res as Char[],
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
      error: error instanceof Error ? error.message : 'Unknown err ',
    };
  }
}

export type JikanSeason = SuccessJIkanRes | ErrorJIkanRes;

export async function getCurrentSeason(page: number, limit: number, filter: Format): Promise<JikanSeason> {
  if (!filter) {
    return {
      success: false,
      status: 400,
      hasNextPage: false,
      total: 0,
      lastPage: 0,
      currentPage: 0,
      perPage: 0,
      data: [],
      error: 'Missing required parameter : filter!',
    };
  }
  const newFormat = filter.toLowerCase();
  try {
    const { data } = await axios.get(`${jikanBaseUrl}/seasons/now?filter=${newFormat}&?sfw&page=${page}&limit=${limit}`);
    if (!data)
      return {
        success: false,
        status: 204,
        error: 'Server returned an empty response',
        hasNextPage: false,
        total: 0,
        lastPage: 0,
        currentPage: 0,
        perPage: 0,
        data: [],
      };

    const res = data;
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
      success: true,
      status: 200,
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
        hasNextPage: false,
        total: 0,
        lastPage: 0,
        currentPage: 0,
        perPage: 0,
        data: [],
        error: `Request failed ${error.message}`,
        status: error.response?.status || 500,
      };
    return {
      success: false,
      hasNextPage: false,
      total: 0,
      lastPage: 0,
      currentPage: 0,
      perPage: 0,
      data: [],
      status: 500,
      error: error instanceof Error ? error.message : 'Unknown err ',
    };
  }
}

export async function getNextSeason(page: number, limit: number, filter: Format): Promise<JikanSeason> {
  if (!filter) {
    return {
      success: false,
      status: 400,
      hasNextPage: false,
      total: 0,
      lastPage: 0,
      currentPage: 0,
      perPage: 0,
      data: [],
      error: 'Missing required parameter :filter!',
    };
  }
  const newFormat = filter.toLowerCase();
  try {
    const { data } = await axios.get(
      `${jikanBaseUrl}/seasons/upcoming?filter=${newFormat}&?sfw&page=${page}&limit=${limit}`,
    );
    if (!data)
      return {
        success: false,
        status: 204,
        error: 'Server returned an empty response',
        hasNextPage: false,
        total: 0,
        lastPage: 0,
        currentPage: 0,
        perPage: 0,
        data: [],
      };
    const res = data;
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
      success: true,
      status: 200,
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
        hasNextPage: false,
        total: 0,
        lastPage: 0,
        currentPage: 0,
        perPage: 0,
        data: [],
        error: `Request failed ${error.message}`,
        status: error.response?.status || 500,
      };
    return {
      success: false,
      hasNextPage: false,
      total: 0,
      lastPage: 0,
      currentPage: 0,
      perPage: 0,
      data: [],
      status: 500,
      error: error instanceof Error ? error.message : 'Unknown err ',
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
      hasNextPage: false,
      total: 0,
      lastPage: 0,
      currentPage: 0,
      perPage: 0,
      data: [],
      error: 'Missing required parameter : year & season',
    };
  }
  try {
    const newSeason = season.toLowerCase();
    const newFormat = filter.toLowerCase();
    const { data } = await axios.get(
      `${jikanBaseUrl}/seasons/${year}/${newSeason}?filter=${newFormat}&?sfw&page=${page}&limit=${limit}`,
    );
    if (!data)
      return {
        success: false,
        status: 204,
        error: 'Server returned an empty response',
        hasNextPage: false,
        total: 0,
        lastPage: 0,
        currentPage: 0,
        perPage: 0,
        data: [],
      };

    const res = data;
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
      success: true,
      status: 200,
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
        hasNextPage: false,
        total: 0,
        lastPage: 0,
        currentPage: 0,
        perPage: 0,
        data: [],
        error: `Request failed ${error.message}`,
        status: error.response?.status || 500,
      };
    return {
      success: false,
      hasNextPage: false,
      total: 0,
      lastPage: 0,
      currentPage: 0,
      perPage: 0,
      data: [],
      status: 500,
      error: error instanceof Error ? error.message : 'Unknown err ',
    };
  }
}
export type JikanTopAnime = SuccessJIkanRes | ErrorJIkanRes;
export async function getTopUpcoming(page: number, perPage: number, filter: Status): Promise<JikanTopAnime> {
  try {
    const { data } = await axios.get(`${jikanBaseUrl}/top/anime?filter=${filter}&?sfw&page=${page}&limit=${perPage}`);
    if (!data)
      return {
        success: false,
        status: 204,
        error: 'Server returned an empty response',
        hasNextPage: false,
        total: 0,
        lastPage: 0,
        currentPage: 0,
        perPage: 0,
        data: [],
      };
    const res = data;
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
      success: true,
      status: 200,
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
        hasNextPage: false,
        total: 0,
        lastPage: 0,
        currentPage: 0,
        perPage: 0,
        data: [],
        error: `Request failed ${error.message}`,
        status: error.response?.status || 500,
      };
    return {
      success: false,
      hasNextPage: false,
      total: 0,
      lastPage: 0,
      currentPage: 0,
      perPage: 0,
      data: [],
      status: 500,
      error: error instanceof Error ? error.message : 'Unknown err ',
    };
  }
}
export async function getTopAnime(page: number, limit: number, filter: Status, type: Format): Promise<JikanTopAnime> {
  const newType = type.toLowerCase();

  try {
    const { data } = await axios.get(
      `${jikanBaseUrl}/top/anime?filter=${filter}&type=${newType}&?sfw&page=${page}&limit=${limit}`,
    );
    if (!data)
      return {
        success: false,
        status: 204,
        error: 'Server returned an empty response',
        hasNextPage: false,
        total: 0,
        lastPage: 0,
        currentPage: 0,
        perPage: 0,
        data: [],
      };
    const res = data;
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
      success: true,
      status: 200,
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
        hasNextPage: false,
        total: 0,
        lastPage: 0,
        currentPage: 0,
        perPage: 0,
        data: [],
        error: `Request failed ${error.message}`,
        status: error.response?.status || 500,
      };
    return {
      success: false,
      hasNextPage: false,
      total: 0,
      lastPage: 0,
      currentPage: 0,
      perPage: 0,
      data: [],
      status: 500,
      error: error instanceof Error ? error.message : 'Unknown err ',
    };
  }
}
type episodePagination = {
  hasNextPage: boolean;
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
  lastPage: number;
}
export interface ErrorJikanEpisodes extends ErrorResponse {
  data: [];
  hasNextPage: boolean;
  lastPage: number;
}
export type JikanEpisodes = SuccessJikanEpisodes | ErrorJikanEpisodes;
export async function getEpisodes(id: number, page: number): Promise<JikanEpisodes> {
  if (!id) {
    return {
      success: false,
      status: 400,
      data: [],
      hasNextPage: false,
      lastPage: 0,
      error: 'Missing required parameter : Malid!',
    };
  }

  try {
    const response = await axios.get(`${jikanBaseUrl}/anime/${id}/episodes?page=${page}`);
    if (!response.data)
      return {
        success: false,
        status: 204,
        error: 'Server returned an empty response',
        data: [],
        hasNextPage: false,
        lastPage: 0,
      };
    const pagination: episodePagination = {
      hasNextPage: response.data.pagination.has_next_page,
      lastPage: response.data.pagination.last_visible_page,
    };

    const data: EpisodeRes[] = response.data.data.map((item: any) => ({
      number: item.mal_id,
      title: item.title,
      filler: item.filler,
      recap: item.recap,
      score: item.score,
    }));
    return {
      success: true,
      status: 200,
      hasNextPage: pagination.hasNextPage,
      lastPage: pagination.lastPage,
      data: data as EpisodeRes[],
    };
  } catch (error) {
    if (axios.isAxiosError(error))
      return {
        success: false,
        hasNextPage: false,
        lastPage: 0,
        data: [],
        error: `Request failed ${error.message}`,
        status: error.response?.status || 500,
      };
    return {
      success: false,
      hasNextPage: false,
      lastPage: 0,
      data: [],
      status: 500,
      error: error instanceof Error ? error.message : 'Unknown err ',
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
      data: null,
      error: 'Missing required parameter : Malid! || episodeNumber',
    };
  }

  try {
    const response = await axios.get(`${jikanBaseUrl}/anime/${Id}/episodes/${episodeNumber}`);
    if (!response.data)
      return {
        success: false,
        status: 204,
        error: 'Server returned an empty response',
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
      success: true,
      status: 200,
      data: data,
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
      error: error instanceof Error ? error.message : 'Unknown err ',
    };
  }
}

type zoroRes = {
  animeId: string;
  name: string;
  romaji: string;
  score: number;
};
export interface SuccessJikanProviderId extends SuccessJIkanInfo {
  data: JIkanData;

  zoro: zoroRes;
}
export interface ErrorJikanProviderId extends ErrorJikanInfo {
  data: null;

  zoro: null;
}
export type JikanProviderId = SuccessJikanProviderId | ErrorJikanProviderId;
export async function getZoroProviderId(id: number): Promise<JikanProviderId> {
  if (!id) {
    return {
      success: false,
      status: 400,
      data: null,
      zoro: null,
      error: 'Invalid or missing required parameter: id!',
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
        const result = await new RakuzanAnime().search(title);
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
      zoro: ZoroAnimeTitle(titles, ZoroResults),
    };

    return {
      success: true,
      status: 200,
      data: Jikan.data,
      zoro: data.zoro as zoroRes,
    };
  } catch (error) {
    return {
      success: false,
      status: 500,
      data: null,
      zoro: null,
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
  pagination?: pagination;
  episodes: animeRes[] | CrossMatchedEpisodes[];
}
export interface ErrorEpisodesres extends ErrorResponse {
  data: null;
}
export type JikanMatchedEpisodes = SuccessEpisodesres | ErrorEpisodesres;
export async function getEpisodeswithInfo(jikanId: number): Promise<JikanMatchedEpisodes> {
  if (!jikanId) {
    return {
      success: false,
      status: 400,
      data: null,
      error: 'Missing required parameter : id! || provider',
    };
  }
  try {
    const Jikan = await getZoroProviderId(jikanId);
    const zoro = Jikan.zoro;

    const fetchZoroEpisodes = async (animeId: string) => {
      const zoro = new RakuzanAnime();
      try {
        const result = await zoro.fetchEpisodes(animeId);
        return (
          result.data?.map((item: any) => ({
            episodeId: item.episodeId,
            number: item.number,
            title: item.title,
          })) || []
        );
      } catch (error) {
        console.error('Error fetching from HiAnime:', error);
        return null;
      }
    };

    if (zoro) {
      const [hianime, aniMapping2] = await Promise.all([fetchZoroEpisodes(zoro.animeId as string), getMalMapping(jikanId)]);

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
        data: Jikan.data,
        episodes: matchingResults2 as CrossMatchedEpisodes[],
      };
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
      error: error instanceof Error ? error.message : 'Unknown err ',
    };
  }
  return {
    success: false,
    data: null,
    status: 500,
    error: 'yea its messed up',
  };
}
