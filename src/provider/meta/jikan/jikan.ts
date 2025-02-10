import axios from 'axios';

import {
  AnimeStatusFilter,
  AnimeType,
  Filters,
  Season,
} from '../../../types/jikan.js';
import { TINFO } from '../../../types/types.js';
import { AnimeZ, HiAnime } from '../../index.js';
import { AnimeProvider } from '../../../types/jikan.js';
import {
  animeZtitle,
  // anitakuTitle,
  hianimeTitle,
  // type JikanTitle,
} from './mapperjikan.js';

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

export async function getEpisodes(id: number, page: number) {
  if (!id) {
    return {
      success: false,
      error: 'Missing require params :mal_id',
    };
  }

  try {
    const response = await axios.get(
      `${jikanBaseUrl}/anime/${id}/episodes?page=${page}`
    );

    // const pagination = response.data.pagination;
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
      pagination: pagination,
      data: data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'unknown err',
    };
  }
}

export async function getEpisodeInfo(jikanId: number, episodeNumber: number) {
  if (!jikanId) {
    return {
      success: false,
      error: 'Missing required params : mal_id',
    };
  }

  try {
    const response = await axios.get(
      `${jikanBaseUrl}/anime/${jikanId}/episodes/${episodeNumber}`
    );

    const data = {
      number: response.data.data.mal_id,
      title: response.data.data.title,
      duration: Number(response.data.data.duration) / 60 || null,
      filler: response.data.data.filler,
      synopsis: response.data.data.synopsis,
    };
    return {
      succes: true,
      data: data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'unknown err',
    };
  }
}

export async function getProviderId(id: number) {
  try {
    // Fetch anime info from Jikan API
    const data = await getInfoById(id);
    const englishTitle = data.animeInfo?.title?.english as string;
    const modifiedString = englishTitle?.split(':')?.at(0)?.trim();
    const romanjiTitle = data.animeInfo?.title.romaji as string;
    const titles = data?.animeInfo?.title;
    if (!titles) throw new Error('English title not found.');

    // Providers' search functions
    // const searchAnitaku = async (title: string) => {
    //   const anitaku = new Anitaku();
    //   try {
    //     const result = await anitaku.search(title);
    //     return (
    //       result.anime?.map((item: any) => ({
    //         animeId: item.id,
    //         name: item.title,
    //       })) || []
    //     );
    //   } catch (error) {
    //     console.error('Error fetching from Anitaku:', error);
    //     return [];
    //   }
    // };

    const searchAnimeZ = async (title: string) => {
      const animeZ = new AnimeZ();
      try {
        const result = await animeZ.search(title);
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
      const hiAnime = new HiAnime();
      try {
        const result = await hiAnime.search(title);
        return (
          result.anime?.map((item: any) => ({
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

    // Fetch results from all providers
    const fetchProviderResults = async (
      modifiedString: string,
      romanjiTitle: string
    ) => {
      const providerResults = await Promise.all([
        // searchAnitaku(romanjiTitle),
        searchAnimeZ(modifiedString),
        searchHiAnime(romanjiTitle),
      ]);

      const [animeZResults, hiAnimeResults] = providerResults;

      const separatedResults = {
        // anitaku: anitakuResults,
        animeZ: animeZResults,
        hiAnime: hiAnimeResults,
      };

      // const anitakures = separatedResults.anitaku;
      const hianimeres = separatedResults.hiAnime;

      // const gogoanime = anitakuTitle(titles, anitakures);
      const hiAnime = hianimeTitle(titles, hianimeres);
      const animeZ = animeZtitle(titles, animeZResults);

      return {
        data,
        // gogoanime,
        hiAnime,
        animeZ,
      };
    };

    return await fetchProviderResults(modifiedString as string, romanjiTitle);
  } catch (error) {
    console.error('Error in getAnimeTitle:', error);
    throw error;
  }
}
export async function getEpisodeswithInfo(
  jikanId: number,
  page: number,
  provider: AnimeProvider
) {
  try {
    const data = await getProviderId(jikanId);
    const zoro = data.hiAnime;
    const animezId = data.animeZ;

    const fetchEpisodesHianime = async (animeId: string) => {
      const hiAnime = new HiAnime();
      try {
        const result = await hiAnime.fetchInfo(animeId);
        return (
          result.episodes?.map((item: any) => ({
            episodeId: item.episodeId,
            number: item.number,
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
          result.episodes?.map((item: any) => ({
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

    switch (provider) {
      case AnimeProvider.AnimeZ:
        const res = await Promise.all([
          getEpisodes(jikanId, page),
          fetchEpisodesAnimeZ(animezId.animeId as string),
        ]);
        const [jikan, animezdata] = res;

        if (animezdata && animezdata.length > 20) {
          return {
            data: data.data,
            animezdata,
          };
        }

        const matchingEpisodes = animezdata?.map((item) => {
          const jikanEpisode = jikan.data.find(
            (item2: any) => item2.number === item.number
          );
          return {
            data: data.data,
            episodeId: item.episodeId,
            number: item.number,
            episodeTitle: jikanEpisode?.title || 'Unknown Title',
          };
        });

        return matchingEpisodes;

      case AnimeProvider.HiAnime:
        const [jikan2, hianime] = await Promise.all([
          getEpisodes(jikanId, page),
          fetchEpisodesHianime(zoro.animeId as string),
        ]);

        if (hianime && hianime.length > 20)
          return {
            data: data.data,
            hianime,
          };

        const matchingEpisodes2 = hianime?.map((item) => {
          const jikanEpisode2 = jikan2.data.find(
            (item2: any) => item2.number === item.number
          );
          return {
            data: data.data,
            episodeId: item.episodeId,
            number: item.number,
            title: jikanEpisode2.title,
          };
        });
        return matchingEpisodes2;
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown Err',
    };
  }
}
