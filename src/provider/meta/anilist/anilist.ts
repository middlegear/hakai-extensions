import axios from 'axios';
import {
  // bestAnitakuTitle,
  bestHianimeTitle,
  bestanimeZTitle,
} from './mapper.js';
import { AnimeZ, Anitaku, HiAnime } from '../../index.js';

import {
  airingQuery,
  characterQuery,
  fetchByIdQuery,
  popularAnimeQuery,
  searchQuery,
  seasonQuery,
} from './queries.js';

import { USER_AGENT_HEADER } from '../../index.js';

import { MediaType, Format, Status, Sort, Seasons, Charactersort } from './types.js';
import { AnimeProvider } from '../../../types/types.js';
import { getAnilistMapping } from '../anizip/index.js';

const baseURL = `https://graphql.anilist.co`;
const Referer = 'https://anilist.co';
const Origin = 'https://anilist.co';

export async function searchAnime(
  search: string,
  page: number,
  perPage: number,
  type: MediaType = MediaType.Anime,
  isAdult: boolean = false,
) {
  if (!search) {
    return {
      success: false,
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
        pagination: null,
      };
    const pagination = {
      hasNextPage: response.data.data.Page.pageInfo.hasNextPage,
      total: response.data.data.Page.pageInfo.total,
      lastPage: response.data.data.Page.pageInfo.lastPage,
      currentPage: response.data.data.Page.pageInfo.currentPage,
      perPage: response.data.data.Page.pageInfo.perPage,
    };

    const res = response.data.data.Page.media.map((item: any) => ({
      malId: item.idMal,
      anilistId: item.id,
      image: item.coverImage.extraLarge ?? item.coverImage.large ?? item.coverImage.medium,
      color: item.coverImage.color,
      bannerImage:
        item.bannerImage ?? item.coverImage.extraLarge ?? item.coverImage.large ?? item.coverImage.medium,
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
        ? new Date(item.startDate.year, item.startDate.month - 1, item.startDate.day).toLocaleDateString(
            'en-US',
            {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            },
          )
        : null,
      endDate: item.endDate
        ? new Date(item.endDate.year, item.endDate.month - 1, item.endDate.day).toLocaleDateString('en-US', {
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
      status: 200,
      pagination: pagination,
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
      error: error instanceof Error ? error.message : 'Contact dev ',
    };
  }
}
export async function fetchAnimeById(id: number) {
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

    const res = {
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
      status: response.data.data.Media.status,
      duration: response.data.data.Media.duration,
      score: response.data.data.Media.meanScore ?? response.data.data.media.averageScore,
      genres: response.data.data.Media.genres,
      episodes: response.data.data.Media.episodes,
      synopsis: response.data.data.Media.description,
      season: response.data.data.Media.season,
      studio:
        response.data.data.Media.studios.nodes.length > 0
          ? response.data.data.Media.studios.nodes[0].name
          : null,
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

export async function fetchTopAiring(
  page: number,
  perPage: number,
  type: MediaType = MediaType.Anime,
  format: Format = Format.TV,
  status: Status = Status.RELEASING,
  isAdult: boolean = false,
  sort: Sort = Sort.SCORE_DESC,
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
      },
    );
    if (!response.data)
      return {
        success: false,
        status: 204,
        error: 'Server returned an empty response',
        data: [],
        pagination: null,
      };
    const pagination = {
      hasNextPage: response.data.data.Page.pageInfo.hasNextPage,
      total: response.data.data.Page.pageInfo.total,
      lastPage: response.data.data.Page.pageInfo.lastPage,
      currentPage: response.data.data.Page.pageInfo.currentPage,
      perPage: response.data.data.Page.pageInfo.perPage,
    };
    const res = response.data.data.Page.media.map((item: any) => ({
      malId: item.idMal,
      anilistId: item.id,
      image: item.coverImage.extraLarge ?? item.coverImage.large ?? item.coverImage.medium,

      bannerImage:
        item.bannerImage ?? item.coverImage.extraLarge ?? item.coverImage.large ?? item.coverImage.medium,
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
        ? new Date(item.startDate.year, item.startDate.month - 1, item.startDate.day).toLocaleDateString(
            'en-US',
            {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            },
          )
        : null,
      endDate: item.endDate
        ? new Date(item.endDate.year, item.endDate.month - 1, item.endDate.day).toLocaleDateString('en-US', {
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
      status: 200,
      pagination: pagination,
      data: res,
    };
  } catch (error) {
    if (axios.isAxiosError(error))
      return {
        success: false,
        data: [],
        pagination: null,
        error: `Request failed ${error.message}`,
        status: error.response?.status || 500,
      };
    return {
      success: false,
      data: [],
      pagination: null,
      error: error instanceof Error ? error.message : 'Unknown Err',
    };
  }
}

export async function fetchPopular(
  page: number,
  perPage: number,
  format: Format,
  type: MediaType = MediaType.Anime,
  isAdult: boolean = false,
  sort: Sort = Sort.POPULARITY_DESC,
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
      },
    );
    if (!response.data)
      return {
        success: false,
        status: 204,
        error: 'Server returned an empty response',
        data: [],
        pagination: null,
      };
    const pagination = {
      hasNextPage: response.data.data.Page.pageInfo.hasNextPage,
      total: response.data.data.Page.pageInfo.total,
      lastPage: response.data.data.Page.pageInfo.lastPage,
      currentPage: response.data.data.Page.pageInfo.currentPage,
      perPage: response.data.data.Page.pageInfo.perPage,
    };

    const res = response.data.data.Page.media.map((item: any) => ({
      malId: item.idMal,
      anilistId: item.id,
      image: item.coverImage.extraLarge ?? item.coverImage.large ?? item.coverImage.medium,

      bannerImage:
        item.bannerImage ?? item.coverImage.extraLarge ?? item.coverImage.large ?? item.coverImage.medium,
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
        ? new Date(item.startDate.year, item.startDate.month - 1, item.startDate.day).toLocaleDateString(
            'en-US',
            {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            },
          )
        : null,
      endDate: item.endDate
        ? new Date(item.endDate.year, item.endDate.month - 1, item.endDate.day).toLocaleDateString('en-US', {
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
      status: 200,
      pagination: pagination,
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
      status: 500,
      data: [],
      pagination: null,
      error: error instanceof Error ? error.message : 'Unknown err',
    };
  }
}

export async function fetchTopRated(
  page: number,
  perPage: number,
  format: Format,
  isAdult: boolean = false,
  type: MediaType = MediaType.Anime,
  sort: Sort = Sort.SCORE_DESC,
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
      },
    );
    if (!response.data)
      return {
        success: false,
        status: 204,
        error: 'Server returned an empty response',
        data: [],
        pagination: null,
      };
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
      image: item.coverImage.extraLarge ?? item.coverImage.large ?? item.coverImage.medium,

      bannerImage:
        item.bannerImage ?? item.coverImage.extraLarge ?? item.coverImage.large ?? item.coverImage.medium,
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
        ? new Date(item.startDate.year, item.startDate.month - 1, item.startDate.day).toLocaleDateString(
            'en-US',
            {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            },
          )
        : null,
      endDate: item.endDate
        ? new Date(item.endDate.year, item.endDate.month - 1, item.endDate.day).toLocaleDateString('en-US', {
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
    if (axios.isAxiosError(error))
      return {
        success: false,
        data: [],
        pagination: null,
        error: `Request failed ${error.message}`,
        status: error.response?.status || 500,
      };
    return {
      success: false,
      status: 500,
      error: error instanceof Error ? error.message : 'Unknown err',
    };
  }
}

export async function fetchSeason(
  season: Seasons,
  seasonYear: number,
  page: number,
  perPage: number,
  format: Format,
  isAdult: boolean = false,
  type: MediaType = MediaType.Anime,
  sort: Sort = Sort.POPULARITY_DESC,
) {
  if (!season || !seasonYear) {
    return {
      success: false,
      status: 400,
      data: [],
      pagination: null,
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
        data: [],
        pagination: null,
      };
    const pagination = {
      hasNextPage: response.data.data.Page.pageInfo.hasNextPage,
      total: response.data.data.Page.pageInfo.total,
      lastPage: response.data.data.Page.pageInfo.lastPage,
      currentPage: response.data.data.Page.pageInfo.currentPage,
      perPage: response.data.data.Page.pageInfo.perPage,
    };

    const res = response.data.data.Page.media.map((item: any) => ({
      malId: item.idMal,
      anilistId: item.id,
      image: item.coverImage.extraLarge ?? item.coverImage.large ?? item.coverImage.medium,

      bannerImage:
        item.bannerImage ?? item.coverImage.extraLarge ?? item.coverImage.large ?? item.coverImage.medium,
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
        ? new Date(item.startDate.year, item.startDate.month - 1, item.startDate.day).toLocaleDateString(
            'en-US',
            {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            },
          )
        : null,
      endDate: item.endDate
        ? new Date(item.endDate.year, item.endDate.month - 1, item.endDate.day).toLocaleDateString('en-US', {
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
      status: 200,
      pagination: pagination,
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
      pagination: null,
      status: 500,
      error: error instanceof Error ? error.message : 'Unknown err',
    };
  }
}

export async function fetchAnimeCharacters(
  mediaId: number,
  sort: Charactersort,
  voiceActorsSort2: Charactersort,
) {
  if (!mediaId) {
    return {
      success: false,
      status: 400,
      data: [],
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
    const res = {
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

export async function fetchProviderId(id: number) {
  if (!id) {
    return {
      success: false,
      status: 400,
      data: null,
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
      animeInfo: anilistData,
      hiAnime: hiAnimeResults.status === 'fulfilled' ? bestHianimeTitle(titles, hiAnimeResults.value) : null,
      animeZ: animeZResults.status === 'fulfilled' ? bestanimeZTitle(titles, animeZResults.value) : null,
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

export async function getEpisodeswithInfo(anilistId: number, provider: AnimeProvider) {
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
    const zoro = anilistData.data?.hiAnime;
    const animezId = anilistData.data?.animeZ;

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
            getAnilistMapping(anilistId),
          ]);

          const matchingResults = animeZ?.map((anime: any) => {
            const episodes = aniMapping.episodes?.find(item => anime.number === item.episodeNumber);
            return {
              episodeNumber: episodes?.episodeNumber ?? anime.number ?? null,
              rating: episodes?.rating ?? null,
              aired: episodes?.aired ?? null,
              episodeId: anime.episodeId ?? null,
              title: episodes?.title.english ?? episodes?.title.romanizedJapanese ?? null,
              thumbnail: episodes?.image ?? null,
            };
          });

          return {
            success: true,
            info: anilistData.data?.animeInfo,
            episodes: matchingResults,
          };
        case AnimeProvider.HiAnime:
          const [hianime, aniMapping2] = await Promise.all([
            fetchEpisodesHianime(zoro.animeId as string),
            getAnilistMapping(anilistId),
          ]);

          const matchingResults2 = hianime?.map((anime: any) => {
            const episodes = aniMapping2.episodes?.find(item => anime.number === item.episodeNumber);
            return {
              episodeNumber: episodes?.episodeNumber ?? anime.number ?? null,
              rating: episodes?.rating ?? null,
              aired: episodes?.aired ?? null,
              episodeId: anime.episodeId ?? null,
              title: episodes?.title.english ?? episodes?.title.romanizedJapanese ?? anime.title ?? null,
              thumbnail: episodes?.image ?? null,
            };
          });

          return {
            success: true,
            info: anilistData.data?.animeInfo,
            episodes: matchingResults2,
          };
      }
    }
  } catch (error) {
    return {
      success: false,
      data: [],
      status: 200,
      error: error instanceof Error ? error.message : 'Unknown Err',
    };
  }
}
