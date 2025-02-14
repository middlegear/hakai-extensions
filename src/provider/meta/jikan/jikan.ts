import axios from 'axios';
import { AnimeProvider, Format, Seasons, Status } from '../../../types/types.js';
import { AnimeZ, HiAnime } from '../../index.js';
import { animeZtitle, hianimeTitle } from './mapperjikan.js';
import { getMalMapping } from '../anizip/index.js';
const jikanBaseUrl = 'https://api.jikan.moe/v4';
export async function searchAnime(query: string, page: number, limit: number) {
  if (!query) {
    return {
      success: false,
      status: 400,
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
    const animeInfo = {
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
    const res = data.data.map((item: any) => ({
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
      error: error instanceof Error ? error.message : 'Unknown err ',
    };
  }
}

export async function getCurrentSeason(filter: Format, page: number, limit: number) {
  if (!filter) {
    return {
      success: false,
      status: 400,
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

export async function getNextSeason(filter: Format, page: number, limit: number) {
  if (!filter) {
    return {
      success: false,
      status: 400,
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

export async function getSeason(year: number, season: Seasons, filter: Format, page: number, limit: number) {
  if (!year || !season || !filter) {
    return {
      success: false,
      status: 400,
      data: [],
      error: 'Missing required parameter : year!|| ,season || ,Filters',
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
export async function getTopUpcoming(page: number, perPage: number, filter: Status) {
  try {
    const { data } = await axios.get(`${jikanBaseUrl}/top/anime?filter=${filter}&?sfw&page=${page}&limit=${perPage}`);
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
export async function getTopAnime(page: number, limit: number, filter: Status, type: Format) {
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

    const [animeZResults, hiAnimeResults] = await Promise.allSettled([searchAnimeZ(englishTitle), searchHiAnime(userPref)]);

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
export async function getEpisodeswithInfo(jikanId: number, provider: AnimeProvider, page?: number) {
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
    const fetchEpisodesAnimeZ = async (id: string, page: number) => {
      const animeZ = new AnimeZ();
      try {
        const result = await animeZ.fetchEpisodes(id, page);
        const pagination = {
          hasNextPage: result.hasNextPage || null,
          currentPage: result.currentPage || null,
          totalPages: result.totalPages || null,
        };
        const data = {
          pagination: pagination,
          result:
            result.data?.map((item: any) => ({
              episodeId: item.episodeId,
              number: item.number,
              category: item.category,
            })) || [],
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
          if (jikanId === 21 || jikanId === 269) {
            const response = await fetchEpisodesAnimeZ(animezId.animeId as string, page as number);
            return {
              success: true,
              info: Jikan.data?.animeInfo,
              episodePagination: response?.pagination,
              episodes: response?.result,
            };
          } else {
            const [animeZ, aniMapping] = await Promise.all([
              fetchEpisodesAnimeZ(animezId.animeId as string, page as number),
              getMalMapping(jikanId),
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

            if (animeZ)
              return {
                success: true,
                info: Jikan.data?.animeInfo,
                episodePagination: animeZ.pagination,
                episodes: matchingResults,
              };
          }
        case AnimeProvider.HiAnime:
          if (jikanId === 21 || jikanId === 269) {
            const response = await fetchEpisodesHianime(zoro.animeId as string);
            return {
              success: true,
              info: Jikan.data?.animeInfo,
              episodes: response,
            };
          } else {
            const [hianime, aniMapping2] = await Promise.all([
              fetchEpisodesHianime(zoro.animeId as string),
              getMalMapping(jikanId),
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
              info: Jikan.data?.animeInfo,
              episodes: matchingResults2,
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
      error: error instanceof Error ? error.message : 'Unknown err ',
    };
  }
}
