import axios from 'axios';

const tmdbUrl = 'https://api.themoviedb.org/3';
interface searchData {
  tmdbId: number;
  name: string;
  posterImage: {
    small: string;
    medium: string;
    large: string;
    original: string;
  };
  coverImage: {
    small: string;
    medium: string;
    large: string;
    original: string;
  };
  country: string;
  language: string;
  startDate: string;
  summary: string;
  genres: string;
  rating: string;
}
type pagination = {
  currentPage: number;
  hasNextPage: boolean;
  totalPages: number;
  totalResults: number;
};
interface Info extends searchData {
  lastAired: string;
  latestEpisode: {
    episodeId: string;
    title: string;
    episodeNumber: number;
    episodeType: string;
    season: number;
    summary: string;
    rating: number;
    airDate: string;
  } | null;
  nextEpisode: {
    episodeId: number;
    title: string;
    episodeType: string;
    episodeNumber: number;
    season: number;
    summary: string;
    rating: number;
    airDate: string;
  } | null;
}
type seasons = {
  airDate: string;
  id: string;
  name: string;
  rating: string;
  summary: string;
  seasonNumber: string;
  posterImage: {
    small: string;
    medium: string;
    large: string;
    original: string;
  };
};
interface successSearchRes {
  data: searchData[];
  currentPage: number;
  hasNextPage: boolean;
  totalPages: number;
  totalResults: number;
}
interface errorSearchRes {
  data: [];
  error: string;
  currentPage: number;
  hasNextPage: boolean;
  totalPages: number;
  totalResults: number;
}
export type tmdbSearch = successSearchRes | errorSearchRes;
export async function searchTVShows(query: string, page: number, apiKey: string): Promise<tmdbSearch> {
  if (!query) {
    return {
      data: [],
      currentPage: 0,
      hasNextPage: false,
      totalPages: 0,
      totalResults: 0,
      error: 'Missing required parameter. Query',
    };
  }
  try {
    const response = await axios.get(
      `${tmdbUrl}/search/tv?include_adult=false&language=en-US&page=${page}&api_key=${apiKey}&query=${query}`,
    );
    if (!response.data)
      return {
        data: [],
        currentPage: 0,
        hasNextPage: false,
        totalPages: 0,
        totalResults: 0,
        error: response.statusText,
      };
    const pagination: pagination = {
      currentPage: response.data.page,
      hasNextPage: response.data.total_pages > 1 ? true : false,
      totalPages: response.data.total_pages,
      totalResults: response.data.total_results,
    };
    const data = response.data.results.map((item: any) => ({
      tmdbId: item.id || null,
      name: item.name || item.original_name || null,
      posterImage: {
        small: `https://image.tmdb.org/t/p/w185${item.poster_path}` || null,
        medium: `https://image.tmdb.org/t/p/w342${item.poster_path}` || null,
        large: `https://image.tmdb.org/t/p/w780${item.poster_path}` || null,
        original: `https://image.tmdb.org/t/p/original${item.poster_path}` || null,
      },
      coverImage: {
        small: `https://image.tmdb.org/t/p/w300${item.backdrop_path}` || null,
        medium: `https://image.tmdb.org/t/p/w780${item.backdrop_path}` || null,
        large: `https://image.tmdb.org/t/p/w1280${item.backdrop_path}` || null,
        original: `https://image.tmdb.org/t/p/original${item.backdrop_path}` || null,
      },
      country: item.origin_country || null,
      language: item.original_language || null,
      startDate: item.first_air_date || null,
      summary: item.overview || null,
      genres: item.genre_ids || null,
      rating: item.vote_average || null,
    }));
    return {
      currentPage: pagination.currentPage,
      hasNextPage: pagination.hasNextPage,
      totalPages: pagination.totalPages,
      totalResults: pagination.totalResults,
      data: data,
    };
  } catch (error) {
    return {
      data: [],
      currentPage: 0,
      hasNextPage: false,
      totalPages: 0,
      totalResults: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
interface successShowInfo {
  data: Info;
  seasons: seasons;
}
interface errorShowInfo {
  data: null;
  seasons: [];
  error: string;
}
export type ShowInfo = successShowInfo | errorShowInfo;
export async function getTvShowInfo(tmdbId: number, apiKey: string): Promise<ShowInfo> {
  if (!tmdbId) {
    return {
      data: null,
      seasons: [],
      error: 'Missing required parameter. Query',
    };
  }
  try {
    const response = await axios.get(`${tmdbUrl}/tv/${tmdbId}?language=en-US&api_key=${apiKey}`);

    if (!response.data)
      return {
        data: null,
        seasons: [],
        error: response.statusText,
      };
    const data = {
      tmdbId: response.data.id || null,
      name: response.data.name || null,
      posterImage: {
        small: `https://image.tmdb.org/t/p/w185${response.data.poster_path}` || null,
        medium: `https://image.tmdb.org/t/p/w342${response.data.poster_path}` || null,
        large: `https://image.tmdb.org/t/p/w780${response.data.poster_path}` || null,
        original: `https://image.tmdb.org/t/p/original${response.data.poster_path}` || null,
      },
      coverImage: {
        small: `https://image.tmdb.org/t/p/w300${response.data.backdrop_path}` || null,
        medium: `https://image.tmdb.org/t/p/w780${response.data.backdrop_path}` || null,
        large: `https://image.tmdb.org/t/p/w1280${response.data.backdrop_path}` || null,
        original: `https://image.tmdb.org/t/p/original${response.data.backdrop_path}` || null,
      },
      status: response.data.status || null,
      country: response.data.origin_country || null,
      language: response.data.original_language || null,
      episodes: response.data.number_of_episodes || null,
      seasons: response.data.number_of_seasons || null,
      rating: response.data.vote_average || null,
      genres: response.data.genres || null,
      summary: response.data.overview || null,
      startDate: response.data.first_air_date || null,
      lastAired: response.data.last_air_date || null,
      latestEpisode: response.data.last_episode_to_air
        ? {
            episodeId: response.data.last_episode_to_air.id,
            title: response.data.last_episode_to_air.name,
            episodeNumber: response.data.last_episode_to_air.episode_number,
            episodeType: response.data.last_episode_to_air.episode_type,
            season: response.data.last_episode_to_air.season_number,
            summary: response.data.last_episode_to_air.overview,
            rating: response.data.last_episode_to_air.vote_average,
            airDate: response.data.last_episode_to_air.air_date,
          }
        : null,
      nextEpisode: response.data.next_episode_to_air
        ? {
            episodeId: response.data.next_episode_to_air.id,
            title: response.data.next_episode_to_air.name,
            episodeType: response.data.next_episode_to_air.episode_type,
            episodeNumber: response.data.next_episode_to_air.episode_number,
            season: response.data.next_episode_to_air.season_number,
            summary: response.data.next_episode_to_air.overview,
            rating: response.data.next_episode_to_air.vote_average,
            airDate: response.data.next_episode_to_air.air_date,
          }
        : null,
    };
    const seasons = response.data.seasons.map((item: any) => ({
      airDate: item.air_date || null,
      id: item.id || null,
      name: item.name || null,
      rating: item.vote_average || null,
      summary: item.overview || null,
      seasonNumber: item.season_number || null,
      posterImage: {
        small: `https://image.tmdb.org/t/p/w185${item.poster_path}` || null,
        medium: `https://image.tmdb.org/t/p/w342${item.poster_path}` || null,
        large: `https://image.tmdb.org/t/p/w780${item.poster_path}` || null,
        original: `https://image.tmdb.org/t/p/original${item.poster_path}` || null,
      },
    }));
    return { data: data as Info, seasons: seasons };
  } catch (error) {
    return { data: null, seasons: [], error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
type Episodes = {
  airDate: string | null;
  episodeNumber: number | null;
  episodeType: string | null;
  episodeId: number | null;
  title: string | null;
  summary: string | null;
  rating: number | null;
  seasonNumber: number | null;
  tmdbId: number | null;
  runtime: string | null;
  images: {
    small: string;
    medium: string;
    large: string;
    original: string;
  };
};
interface successEpisodesRes {
  data: Episodes[];
}
interface errorEpisodesRes {
  data: [];
  error: string;
}
export type EpisodesRes = successEpisodesRes | errorEpisodesRes;
export async function getTvEpisodes(tmdbId: number, season: number, apiKey: string): Promise<EpisodesRes> {
  if (!tmdbId) {
    return { data: [], error: 'Missing required params :tmdbId!' };
  }
  try {
    const response = await axios.get(`${tmdbUrl}/tv/${tmdbId}/season/${season}?api_key=${apiKey}`);

    if (!response.data)
      return {
        data: [],
        error: response.statusText,
      };
    const episodes = response.data.episodes.map((item: any) => ({
      airDate: item.air_date || null,
      episodeNumber: item.episode_number || null,
      episodeType: item.episode_type || null,
      episodeId: item.id || null,
      title: item.name || null,
      summary: item.overview || null,
      rating: item.vote_average || null,
      seasonNumber: item.season_number || null,
      tmdbId: item.show_id || null,
      runtime: item.runtime || null,
      images: {
        small: `https://image.tmdb.org/t/p/w185${item.still_path}`,
        medium: `https://image.tmdb.org/t/p/w342${item.still_path}`,
        large: `https://image.tmdb.org/t/p/w780${item.still_path}`,
        original: `https://image.tmdb.org/t/p/original${item.still_path}`,
      },
    }));
    return { data: episodes };
  } catch (error) {
    return { data: [], error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
export async function searchTmdbMovie(query: string, page: number, apiKey: string): Promise<tmdbSearch> {
  if (!query) {
    return {
      data: [],
      currentPage: 0,
      hasNextPage: false,
      totalPages: 0,
      totalResults: 0,
      error: 'Missing required parameter. Query',
    };
  }
  try {
    const response = await axios.get(
      `${tmdbUrl}/search/movie?include_adult=false&language=en-US&page=${page}&api_key=${apiKey}&query=${query}`,
    );
    if (!response.data)
      return {
        data: [],
        currentPage: 0,
        hasNextPage: false,
        totalPages: 0,
        totalResults: 0,
        error: response.statusText,
      };
    const pagination: pagination = {
      currentPage: response.data.page,
      hasNextPage: response.data.total_pages > 1 ? true : false,
      totalPages: response.data.total_pages,
      totalResults: response.data.total_results,
    };
    const data = response.data.results.map((item: any) => ({
      tmdbId: item.id || null,
      name: item.title || item.original_title || null,
      posterImage: {
        small: `https://image.tmdb.org/t/p/w185${item.poster_path}` || null,
        medium: `https://image.tmdb.org/t/p/w342${item.poster_path}` || null,
        large: `https://image.tmdb.org/t/p/w780${item.poster_path}` || null,
        original: `https://image.tmdb.org/t/p/original${item.poster_path}` || null,
      },
      coverImage: {
        small: `https://image.tmdb.org/t/p/w300${item.backdrop_path}` || null,
        medium: `https://image.tmdb.org/t/p/w780${item.backdrop_path}` || null,
        large: `https://image.tmdb.org/t/p/w1280${item.backdrop_path}` || null,
        original: `https://image.tmdb.org/t/p/original${item.backdrop_path}` || null,
      },

      language: item.original_language || null,
      releaseDate: item.release_date || null,
      summary: item.overview || null,
      genres: item.genre_ids || null,
      rating: item.vote_average || null,
    }));
    return {
      currentPage: pagination.currentPage,
      hasNextPage: pagination.hasNextPage,
      totalPages: pagination.totalPages,
      totalResults: pagination.totalResults,
      data: data,
    };
  } catch (error) {
    return {
      data: [],
      currentPage: 0,
      hasNextPage: false,
      totalPages: 0,
      totalResults: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
type Movie = {
  tmdbId: number;
  name: string | null;
  posterImage: {
    small: string | null;
    medium: string | null;
    large: string | null;
    original: string | null;
  };
  coverImage: {
    small: string | null;
    medium: string | null;
    large: string | null;
    original: string | null;
  };
  status: string | null;
  country: string | null;
  language: string | null;
  rating: number | null;
  genres: string[] | null;
  budget: number | null;
  collection: {
    id: number;
    name: string;
    posterImage: {
      small: string;
      medium: string;
      large: string;
      original: string;
    };
    coverImage: {
      small: string;
      medium: string;
      large: string;
      original: string;
    };
  } | null;
  summary: string | null;
  releaseDate: string | null;
};
interface SuccessMovieInfoRes {
  data: Movie;
}
interface ErrorMovieInfoRes {
  data: null;
  error: string;
}
export type MovieInfoRes = SuccessMovieInfoRes | ErrorMovieInfoRes;
export async function getMovieInfo(tmdbId: number, apiKey: string): Promise<MovieInfoRes> {
  if (!tmdbId) {
    return { data: null, error: 'Missing required params tmdbId!' };
  }
  try {
    const response = await axios.get(`${tmdbUrl}/movie/${tmdbId}?api_key=${apiKey}`);

    const data = {
      tmdbId: response.data.id || null,
      name: response.data.original_title || response.data.title || null,
      posterImage: {
        small: `https://image.tmdb.org/t/p/w185${response.data.poster_path}` || null,
        medium: `https://image.tmdb.org/t/p/w342${response.data.poster_path}` || null,
        large: `https://image.tmdb.org/t/p/w780${response.data.poster_path}` || null,
        original: `https://image.tmdb.org/t/p/original${response.data.poster_path}` || null,
      },
      coverImage: {
        small: `https://image.tmdb.org/t/p/w300${response.data.backdrop_path}` || null,
        medium: `https://image.tmdb.org/t/p/w780${response.data.backdrop_path}` || null,
        large: `https://image.tmdb.org/t/p/w1280${response.data.backdrop_path}` || null,
        original: `https://image.tmdb.org/t/p/original${response.data.backdrop_path}` || null,
      },
      status: response.data.status || null,
      country: response.data.origin_country || null,
      language: response.data.original_language || null,
      rating: response.data.vote_average || null,
      genres: response.data.genres || null,
      budget: response.data.budget || null,
      collection: response.data.belongs_to_collection
        ? {
            id: response.data.belongs_to_collection.id,
            name: response.data.belongs_to_collection.name,
            posterImage: {
              small: `https://image.tmdb.org/t/p/w185${response.data.belongs_to_collection.poster_path}`,
              medium: `https://image.tmdb.org/t/p/w342${response.data.belongs_to_collection.poster_path}`,
              large: `https://image.tmdb.org/t/p/w780${response.data.belongs_to_collection.poster_path}`,
              original: `https://image.tmdb.org/t/p/original${response.data.belongs_to_collection.poster_path}`,
            },
            coverImage: {
              small: `https://image.tmdb.org/t/p/w300${response.data.belongs_to_collection.backdrop_path}`,
              medium: `https://image.tmdb.org/t/p/w780${response.data.belongs_to_collection.backdrop_path}`,
              large: `https://image.tmdb.org/t/p/w1280${response.data.belongs_to_collection.backdrop_path}`,
              original: `https://image.tmdb.org/t/p/original${response.data.belongs_to_collection.backdrop_path}`,
            },
          }
        : null,
      summary: response.data.overview || null,
      releaseDate: response.data.release_date || null,
    };
    return { data: data };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
export async function getTrendingMovies(apiKey: string): Promise<tmdbSearch> {
  try {
    const response = await axios.get(`${tmdbUrl}/trending/movie/week?language=en-US&api_key=${apiKey}`);

    if (!response.data)
      return {
        data: [],
        currentPage: 0,
        hasNextPage: false,
        totalPages: 0,
        totalResults: 0,
        error: response.statusText,
      };
    const pagination: pagination = {
      currentPage: response.data.page,
      hasNextPage: response.data.total_pages > 1 ? true : false,
      totalPages: response.data.total_pages,
      totalResults: response.data.total_results,
    };
    const data = response.data.results.map((item: any) => ({
      tmdbId: item.id || null,
      name: item.title || item.original_title || null,
      posterImage: {
        small: `https://image.tmdb.org/t/p/w185${item.poster_path}` || null,
        medium: `https://image.tmdb.org/t/p/w342${item.poster_path}` || null,
        large: `https://image.tmdb.org/t/p/w780${item.poster_path}` || null,
        original: `https://image.tmdb.org/t/p/original${item.poster_path}` || null,
      },
      coverImage: {
        small: `https://image.tmdb.org/t/p/w300${item.backdrop_path}` || null,
        medium: `https://image.tmdb.org/t/p/w780${item.backdrop_path}` || null,
        large: `https://image.tmdb.org/t/p/w1280${item.backdrop_path}` || null,
        original: `https://image.tmdb.org/t/p/original${item.backdrop_path}` || null,
      },

      language: item.original_language || null,
      releaseDate: item.release_date || null,
      summary: item.overview || null,
      genres: item.genre_ids || null,
      rating: item.vote_average || null,
    }));
    return {
      currentPage: pagination.currentPage,
      hasNextPage: pagination.hasNextPage,
      totalPages: pagination.totalPages,
      totalResults: pagination.totalResults,
      data: data,
    };
  } catch (error) {
    return {
      data: [],
      currentPage: 0,
      hasNextPage: false,
      totalPages: 0,
      totalResults: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
export async function getPopularMovies(apiKey: string): Promise<tmdbSearch> {
  try {
    const response = await axios.get(`${tmdbUrl}/movie/popular?api_key=${apiKey}`);
    if (!response.data)
      return {
        data: [],
        currentPage: 0,
        hasNextPage: false,
        totalPages: 0,
        totalResults: 0,
        error: response.statusText,
      };
    const pagination: pagination = {
      currentPage: response.data.page,
      hasNextPage: response.data.total_pages > 1 ? true : false,
      totalPages: response.data.total_pages,
      totalResults: response.data.total_results,
    };
    const data = response.data.results.map((item: any) => ({
      tmdbId: item.id || null,
      name: item.title || item.original_title || null,
      posterImage: {
        small: `https://image.tmdb.org/t/p/w185${item.poster_path}` || null,
        medium: `https://image.tmdb.org/t/p/w342${item.poster_path}` || null,
        large: `https://image.tmdb.org/t/p/w780${item.poster_path}` || null,
        original: `https://image.tmdb.org/t/p/original${item.poster_path}` || null,
      },
      coverImage: {
        small: `https://image.tmdb.org/t/p/w300${item.backdrop_path}` || null,
        medium: `https://image.tmdb.org/t/p/w780${item.backdrop_path}` || null,
        large: `https://image.tmdb.org/t/p/w1280${item.backdrop_path}` || null,
        original: `https://image.tmdb.org/t/p/original${item.backdrop_path}` || null,
      },

      language: item.original_language || null,
      releaseDate: item.release_date || null,
      summary: item.overview || null,
      genres: item.genre_ids || null,
      rating: item.vote_average || null,
    }));
    return {
      currentPage: pagination.currentPage,
      hasNextPage: pagination.hasNextPage,
      totalPages: pagination.totalPages,
      totalResults: pagination.totalResults,
      data: data,
    };
  } catch (error) {
    return {
      data: [],
      currentPage: 0,
      hasNextPage: false,
      totalPages: 0,
      totalResults: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function getTopRatedMovies(apiKey: string): Promise<tmdbSearch> {
  try {
    const response = await axios.get(`${tmdbUrl}/movie/top_rated?api_key=${apiKey}`);
    if (!response.data)
      return {
        data: [],
        currentPage: 0,
        hasNextPage: false,
        totalPages: 0,
        totalResults: 0,
        error: response.statusText,
      };
    const pagination: pagination = {
      currentPage: response.data.page,
      hasNextPage: response.data.total_pages > 1 ? true : false,
      totalPages: response.data.total_pages,
      totalResults: response.data.total_results,
    };
    const data = response.data.results.map((item: any) => ({
      tmdbId: item.id || null,
      name: item.title || item.original_title || null,
      posterImage: {
        small: `https://image.tmdb.org/t/p/w185${item.poster_path}` || null,
        medium: `https://image.tmdb.org/t/p/w342${item.poster_path}` || null,
        large: `https://image.tmdb.org/t/p/w780${item.poster_path}` || null,
        original: `https://image.tmdb.org/t/p/original${item.poster_path}` || null,
      },
      coverImage: {
        small: `https://image.tmdb.org/t/p/w300${item.backdrop_path}` || null,
        medium: `https://image.tmdb.org/t/p/w780${item.backdrop_path}` || null,
        large: `https://image.tmdb.org/t/p/w1280${item.backdrop_path}` || null,
        original: `https://image.tmdb.org/t/p/original${item.backdrop_path}` || null,
      },

      language: item.original_language || null,
      releaseDate: item.release_date || null,
      summary: item.overview || null,
      genres: item.genre_ids || null,
      rating: item.vote_average || null,
    }));
    return {
      currentPage: pagination.currentPage,
      hasNextPage: pagination.hasNextPage,
      totalPages: pagination.totalPages,
      totalResults: pagination.totalResults,
      data: data,
    };
  } catch (error) {
    return {
      data: [],
      currentPage: 0,
      hasNextPage: false,
      totalPages: 0,
      totalResults: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function getUpcomingMovies(apiKey: string): Promise<tmdbSearch> {
  try {
    const response = await axios.get(`${tmdbUrl}/movie/upcoming?api_key=${apiKey}`);

    if (!response.data)
      return {
        data: [],
        currentPage: 0,
        hasNextPage: false,
        totalPages: 0,
        totalResults: 0,
        error: response.statusText,
      };
    const pagination: pagination = {
      currentPage: response.data.page,
      hasNextPage: response.data.total_pages > 1 ? true : false,
      totalPages: response.data.total_pages,
      totalResults: response.data.total_results,
    };
    const data = response.data.results.map((item: any) => ({
      tmdbId: item.id || null,
      name: item.title || item.original_title || null,
      posterImage: {
        small: `https://image.tmdb.org/t/p/w185${item.poster_path}` || null,
        medium: `https://image.tmdb.org/t/p/w342${item.poster_path}` || null,
        large: `https://image.tmdb.org/t/p/w780${item.poster_path}` || null,
        original: `https://image.tmdb.org/t/p/original${item.poster_path}` || null,
      },
      coverImage: {
        small: `https://image.tmdb.org/t/p/w300${item.backdrop_path}` || null,
        medium: `https://image.tmdb.org/t/p/w780${item.backdrop_path}` || null,
        large: `https://image.tmdb.org/t/p/w1280${item.backdrop_path}` || null,
        original: `https://image.tmdb.org/t/p/original${item.backdrop_path}` || null,
      },

      language: item.original_language || null,
      releaseDate: item.release_date || null,
      summary: item.overview || null,
      genres: item.genre_ids || null,
      rating: item.vote_average || null,
    }));
    return {
      currentPage: pagination.currentPage,
      hasNextPage: pagination.hasNextPage,
      totalPages: pagination.totalPages,
      totalResults: pagination.totalResults,
      data: data,
    };
  } catch (error) {
    return {
      data: [],
      currentPage: 0,
      hasNextPage: false,
      totalPages: 0,
      totalResults: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
