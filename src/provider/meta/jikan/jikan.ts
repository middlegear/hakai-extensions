import axios from 'axios';

import { AnimeProvider, TINFO } from '../../../types/types.js';
import { AnimeZ, HiAnime } from '../../index.js';

import {
  animeZtitle,
  // anitakuTitle,
  hianimeTitle,
  // type JikanTitle,
} from './mapperjikan.js';
import { AnimeStatusFilter, AnimeType, Filters, Season } from './types.js';
import { getMalMapping } from '../anizip/index.js';
import { Jikan } from './index.js';

const jikanBaseUrl = 'https://api.jikan.moe/v4';
export async function searchAnime(
  query: string,
  page: number,
  limit: number,
  type: AnimeType = AnimeType.TV,
) {
  if (!query) {
    return {
      success: false,
      status: 400,
      data: [],
      error: 'Missing required fields : search',
    };
  }
  try {
    const { data } = await axios.get(
      `${jikanBaseUrl}/anime?q=${query}&page=${page}&limit=${limit}&type=${type}`,
    );
    if (!data)
      return {
        success: false,
        status: 204,
        error: 'Server returned an empty response',
        data: [],
        pagination: null,
      };
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
      image: item.images.jpg.large_image_url ?? item.images.webp.large_image_url,
      bannerImage: item.images.jpg.large_image_url ?? item.images.webp.large_image_url,
      trailer: item.trailer.embed_url,
      episodes: item.episodes,

      startDate: item.aired.prop.from
        ? new Date(
            item.aired.prop.from.year,
            item.aired.prop.from.month - 1,
            item.aired.prop.from.day,
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
            item.aired.prop.to.day,
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
      status: 200,
      data: search,
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
      error: error instanceof Error ? error.message : 'Contact dev ',
    };
  }
}

export async function getInfoById(Id: number) {
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
        pagination: null,
      };
    const animeInfo: TINFO = {
      malId: data.data.mal_id,
      title: {
        romaji: data.data.title,
        english: data.data.title_english,
        native: data.data.title_japanese,
      },
      image: data.data.images.jpg.large_image_url ?? data.data.images.webp.large_image_url,
      bannerImage: data.data.images.jpg.large_image_url ?? data.data.images.webp.large_image_url,
      trailer: data.data.trailer.embed_url,
      episodes: data.data.episodes,

      startDate: data.data.aired.prop.from
        ? new Date(
            data.data.aired.prop.from.year,
            data.data.aired.prop.from.month - 1,
            data.data.aired.prop.from.day,
          ).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : null,
      endDate: data.data.aired.prop.to
        ? new Date(
            data.data.aired.prop.year,
            data.data.aired.prop.month,
            data.data.aired.prop.to.day,
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
      status: 200,
      data: animeInfo,
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
///get anime characters need to implement actual characters
export async function getAnimeCharacters(id: number) {
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
        pagination: null,
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

export async function getCurrentSeason(filter: Filters, page: number, limit: number) {
  if (!filter) {
    return {
      success: false,
      status: 400,
      data: [],
      error: 'Missing required parameter : filter!',
    };
  }
  try {
    const { data } = await axios.get(
      `${jikanBaseUrl}/seasons/now?filter=${filter}&?sfw&page=${page}&limit=${limit}`,
    );
    if (!data)
      return {
        success: false,
        status: 204,
        error: 'Server returned an empty response',
        data: [],
        pagination: null,
      };

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
      image: item.images.jpg.large_image_url ?? item.images.webp.large_image_url,
      bannerImage: item.images.jpg.large_image_url ?? item.images.webp.large_image_url,
      trailer: item.trailer.embed_url,
      episodes: item.episodes,

      startDate: item.aired.prop.from
        ? new Date(
            item.aired.prop.from.year,
            item.aired.prop.from.month - 1,
            item.aired.prop.from.day,
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
            item.aired.prop.to.day,
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
      status: 200,
      pagination: pagination,
      data: currentSeason,
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

export async function getNextSeason(filter: Filters, page: number, limit: number) {
  if (!filter) {
    return {
      success: false,
      status: 400,
      data: [],
      error: 'Missing required parameter :filter!',
    };
  }
  try {
    const { data } = await axios.get(
      `${jikanBaseUrl}/seasons/upcoming?filter=${filter}&?sfw&page=${page}&limit=${limit}`,
    );
    if (!data)
      return {
        success: false,
        status: 204,
        error: 'Server returned an empty response',
        data: [],
        pagination: null,
      };
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
      image: item.images.jpg.large_image_url ?? item.images.webp.large_image_url,
      bannerImage: item.images.jpg.large_image_url ?? item.images.webp.large_image_url,
      trailer: item.trailer.embed_url,
      episodes: item.episodes,

      startDate: item.aired.prop.from
        ? new Date(
            item.aired.prop.from.year,
            item.aired.prop.from.month - 1,
            item.aired.prop.from.day,
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
            item.aired.prop.to.day,
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
      status: 200,
      pagination: pagination,
      data: NextSeason,
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

export async function getSeason(year: number, season: Season, filter: Filters, page: number, limit: number) {
  if (!year || !season || !filter) {
    return {
      success: false,
      status: 400,
      data: [],
      error: 'Missing required parameter : year!|| ,season || ,Filters',
    };
  }
  try {
    const { data } = await axios.get(
      `${jikanBaseUrl}/seasons/${year}/${season}?filter=${filter}&?sfw&page=${page}&limit=${limit}`,
    );
    if (!data)
      return {
        success: false,
        status: 204,
        error: 'Server returned an empty response',
        data: [],
        pagination: null,
      };

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
      image: item.images.jpg.large_image_url ?? item.images.webp.large_image_url,
      bannerImage: item.images.jpg.large_image_url ?? item.images.webp.large_image_url,
      trailer: item.trailer.embed_url,
      episodes: item.episodes,

      startDate: item.aired.prop.from
        ? new Date(
            item.aired.prop.from.year,
            item.aired.prop.from.month - 1,
            item.aired.prop.from.day,
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
            item.aired.prop.to.day,
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
      status: 200,
      pagination: pagination,
      data: Season,
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

export async function getTopAnime(page: number, limit: number, filter: AnimeStatusFilter, type: AnimeType) {
  if (!filter || !type) {
    return {
      success: false,
      status: 400,
      data: [],
      error: 'Missing required parameter enum: AnimeStatusFilter  || animeType!',
    };
  }
  try {
    const { data } = await axios.get(
      `${jikanBaseUrl}/top/anime?filter=${filter}&type=${type}&?sfw&page=${page}&limit=${limit}`,
    );
    if (!data)
      return {
        success: false,
        status: 204,
        error: 'Server returned an empty response',
        data: [],
        pagination: null,
      };
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
      image: item.images.jpg.large_image_url ?? item.images.webp.large_image_url,
      bannerImage: item.images.jpg.large_image_url ?? item.images.webp.large_image_url,
      trailer: item.trailer.embed_url,
      episodes: item.episodes,

      startDate: item.aired.prop.from
        ? new Date(
            item.aired.prop.from.year,
            item.aired.prop.from.month - 1,
            item.aired.prop.from.day,
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
            item.aired.prop.to.day,
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
      status: 200,
      pagination: pagination,
      data: topAnime,
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

export async function getEpisodes(id: number, page: number) {
  if (!id) {
    return {
      success: false,
      status: 400,
      data: [],
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
        pagination: null,
      };
    const pagination = {
      hasNextPage: response.data.pagination.has_next_page,
      lastPage: response.data.pagination.last_visible_page,
    };

    const data = response.data.data.map((item: any) => ({
      number: item.mal_id,
      title: item.title,
      filler: item.filler,
      recap: item.recap,
    }));
    return {
      success: true,
      status: 200,
      pagination: pagination,
      data: data,
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

export async function getEpisodeInfo(Id: number, episodeNumber: number) {
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
        pagination: null,
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

export async function getProviderId(id: number) {
  if (!id) {
    return {
      success: false,
      status: 400,
      data: null,
      error: 'Invalid or missing required parameter: id!',
    };
  }

  try {
    const Jikan = await getInfoById(id);
    if (!Jikan?.data?.title) {
      throw new Error('Title not found.');
    }

    const titles = Jikan.data.title;
    const englishTitle = titles.english?.split(':')?.at(0)?.trim() || '';
    const userPref = titles.romaji?.split(' ').slice(0, 3).join(' ') || '';

    const searchAnimeZ = async (title: string) => {
      try {
        const result = await new AnimeZ().search(title);
        return (
          result.data?.map((item: any) => ({
            animeId: item.id,
            name: item.title,
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

    // Execute providers concurrently but independently
    const [animeZResults, hiAnimeResults] = await Promise.allSettled([
      searchAnimeZ(englishTitle),
      searchHiAnime(userPref),
    ]);

    const data = {
      animeInfo: Jikan,
      hiAnime: hiAnimeResults.status === 'fulfilled' ? hianimeTitle(titles, hiAnimeResults.value) : null,
      animeZ: animeZResults.status === 'fulfilled' ? animeZtitle(titles, animeZResults.value) : null,
    };

    return {
      success: true,
      status: 200,
      data,
    };
  } catch (error) {
    return {
      success: false,
      status: 500,
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function getEpisodeswithInfo(jikanId: number, provider: AnimeProvider) {
  if (!jikanId && !provider) {
    return {
      success: false,
      status: 400,
      data: null,
      error: 'Missing required parameter : id! || provider',
    };
  }
  try {
    const Jikan = await getProviderId(jikanId);
    const zoro = Jikan.data?.hiAnime;
    const animezId = Jikan.data?.animeZ;

    const fetchEpisodesHianime = async (animeId: string) => {
      const hiAnime = new HiAnime();
      try {
        const result = await hiAnime.fetchInfo(animeId);
        return (
          result.data?.episodes?.map((item: any) => ({
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
    const fetchEpisodesAnimeZ = async (id: string) => {
      const animeZ = new AnimeZ();
      try {
        const result = await animeZ.fetchEpisodes(id);
        return (
          result.data?.map((item: any) => ({
            episodeId: item.episodeId,
            number: item.number,
            category: item.category,
          })) || []
        );
      } catch (error) {
        console.error('Error fetching from AnimeZ:', error);
        return null;
      }
    };
    if (animezId && zoro) {
      switch (provider) {
        case AnimeProvider.AnimeZ:
          const [animeZ, aniMapping] = await Promise.all([
            fetchEpisodesAnimeZ(animezId.animeId as string),
            getMalMapping(jikanId),
          ]);

          const matchingResults = animeZ?.map((anime: any) => {
            const episodes = aniMapping.episodes?.find(item => anime.number === item.episodeAnimeNumber);
            return {
              episodeNumber: episodes?.episodeAnimeNumber ?? anime.number ?? null,
              rating: episodes?.rating ?? null,
              aired: episodes?.aired ?? null,
              episodeId: anime.episodeId ?? null,
              title: episodes?.title.english ?? episodes?.title.romanizedJapanese ?? null,
              overview: episodes?.overview ?? 'No overview available',
              thumbnail: episodes?.image ?? null,
            };
          });

          return {
            success: true,
            info: Jikan.data?.animeInfo,
            episodes: matchingResults,
          };
        case AnimeProvider.HiAnime:
          const [hianime, aniMapping2] = await Promise.all([
            fetchEpisodesHianime(zoro.animeId as string),
            getMalMapping(jikanId),
          ]);

          const matchingResults2 = hianime?.map((anime: any) => {
            const episodes = aniMapping2.episodes?.find(item => anime.number === item.episodeAnimeNumber);
            return {
              episodeNumber: episodes?.episodeAnimeNumber ?? anime.number ?? null,
              rating: episodes?.rating ?? null,
              aired: episodes?.aired ?? null,
              episodeId: anime.episodeId ?? null,
              title: episodes?.title.english ?? episodes?.title.romanizedJapanese ?? anime.title ?? null,
              overview: episodes?.overview ?? 'No overview available',
              thumbnail: episodes?.image ?? null,
            };
          });

          return {
            success: true,
            info: Jikan.data?.animeInfo,
            episodes: matchingResults2,
          };
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
      error: error instanceof Error ? error.message : 'Unknown err ',
    };
  }
}
