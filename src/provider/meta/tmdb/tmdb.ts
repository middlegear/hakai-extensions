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
  };
  nextEpisode: {
    episodeId: number;
    title: string;
    episodeType: string;
    episodeNumber: number;
    season: number;
    summary: string;
    rating: number;
    airDate: string;
  };
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

export async function searchShows(query: string, page: number, apiKey: string) {
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
    const data: searchData[] = response.data.results.map((item: any) => ({
      tmdbId: item.id,
      name: item.name || item.original_name,
      posterImage: {
        small: `https://image.tmdb.org/t/p/w185${item.poster_path}`,
        medium: `https://image.tmdb.org/t/p/w342${item.poster_path}`,
        large: `https://image.tmdb.org/t/p/w780${item.poster_path}`,
        original: `https://image.tmdb.org/t/p/original${item.poster_path}`,
      },
      coverImage: {
        small: `https://image.tmdb.org/t/p/w300${item.backdrop_path}`,
        medium: `https://image.tmdb.org/t/p/w780${item.backdrop_path}`,
        large: `https://image.tmdb.org/t/p/w1280${item.backdrop_path}`,
        original: `https://image.tmdb.org/t/p/original${item.backdrop_path}`,
      },
      country: item.origin_country,
      language: item.original_language,
      startDate: item.first_air_date,
      summary: item.overview,
      genres: item.genre_ids,
      rating: item.vote_average,
    }));
    return {
      currentPage: pagination.currentPage,
      hasNextPage: pagination.hasNextPage,
      totalPages: pagination.totalPages,
      totalResults: pagination.totalResults,
      data: data as searchData[],
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

export async function getTvShowInfo(tmdbId: number, apiKey: string) {
  if (!tmdbId) {
    return {
      data: null,
      error: 'Missing required parameter. Query',
    };
  }
  try {
    const response = await axios.get(`${tmdbUrl}/tv/${tmdbId}?language=en-US&api_key=${apiKey}`);
    const data = {
      tmdbId: response.data.id,
      name: response.data.name,
      posterImage: {
        small: `https://image.tmdb.org/t/p/w185${response.data.poster_path}`,
        medium: `https://image.tmdb.org/t/p/w342${response.data.poster_path}`,
        large: `https://image.tmdb.org/t/p/w780${response.data.poster_path}`,
        original: `https://image.tmdb.org/t/p/original${response.data.poster_path}`,
      },
      coverImage: {
        small: `https://image.tmdb.org/t/p/w300${response.data.backdrop_path}`,
        medium: `https://image.tmdb.org/t/p/w780${response.data.backdrop_path}`,
        large: `https://image.tmdb.org/t/p/w1280${response.data.backdrop_path}`,
        original: `https://image.tmdb.org/t/p/original${response.data.backdrop_path}`,
      },
      status: response.data.status,
      country: response.data.origin_country,
      language: response.data.original_language,
      episodes: response.data.number_of_episodes,
      seasons: response.data.number_of_seasons,
      rating: response.data.vote_average,
      genres: response.data.genres,
      summary: response.data.overview,
      startDate: response.data.first_air_date,
      lastAired: response.data.last_air_date,
      latestEpisode: {
        episodeId: response.data.last_episode_to_air.id,
        title: response.data.last_episode_to_air.name,
        episodeNumber: response.data.last_episode_to_air.episode_number,
        episodeType: response.data.last_episode_to_air.episode_type,
        season: response.data.last_episode_to_air.season_number,
        summary: response.data.last_episode_to_air.overview,
        rating: response.data.last_episode_to_air.vote_average,
        airDate: response.data.last_episode_to_air.air_date,
      },
      nextEpisode: {
        episodeId: response.data.next_episode_to_air.id,
        title: response.data.next_episode_to_air.name,
        episodeType: response.data.next_episode_to_air.episode_type,
        episodeNumber: response.data.next_episode_to_air.episode_number,
        season: response.data.next_episode_to_air.season_number,
        summary: response.data.next_episode_to_air.overview,
        rating: response.data.next_episode_to_air.vote_average,
        airDate: response.data.next_episode_to_air.air_date,
      },
    };
    const seasons: seasons[] = response.data.seasons.map((item: any) => ({
      airDate: item.air_date,
      id: item.id,
      name: item.name,
      rating: item.vote_average,
      summary: item.overview,
      seasonNumber: item.season_number,
      posterImage: {
        small: `https://image.tmdb.org/t/p/w185${item.poster_path}`,
        medium: `https://image.tmdb.org/t/p/w342${item.poster_path}`,
        large: `https://image.tmdb.org/t/p/w780${item.poster_path}`,
        original: `https://image.tmdb.org/t/p/original${item.poster_path}`,
      },
    }));
    return { data: data as Info, seasons: seasons as seasons[] };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
export async function getTvEpisodes(tmdbId: number, season: number, apiKey: string) {
  if (!tmdbId) {
    return { data: [], error: 'Missing required params :tmdbId!' };
  }
  try {
    const response = await axios.get(`${tmdbUrl}/tv/${tmdbId}/season/${season}?api_key=${apiKey}`);

    const episodes = response.data.episodes.map((item: any) => ({
      airDate: item.air_date,
      episodeNumber: item.episode_number,
      episodeType: item.episode_type,
      episodeId: item.id,
      title: item.name,
      summary: item.overview,
      rating: item.vote_average,
      seasonNumber: item.season_number,
      tmdbId: item.show_id,
      runtime: item.runtime,
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
export async function searchTmdbMovie(query: string, page: number, apiKey: string) {
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
    const data: searchData[] = response.data.results.map((item: any) => ({
      tmdbId: item.id,
      name: item.name || item.original_name,
      posterImage: {
        small: `https://image.tmdb.org/t/p/w185${item.poster_path}`,
        medium: `https://image.tmdb.org/t/p/w342${item.poster_path}`,
        large: `https://image.tmdb.org/t/p/w780${item.poster_path}`,
        original: `https://image.tmdb.org/t/p/original${item.poster_path}`,
      },
      coverImage: {
        small: `https://image.tmdb.org/t/p/w300${item.backdrop_path}`,
        medium: `https://image.tmdb.org/t/p/w780${item.backdrop_path}`,
        large: `https://image.tmdb.org/t/p/w1280${item.backdrop_path}`,
        original: `https://image.tmdb.org/t/p/original${item.backdrop_path}`,
      },
      country: item.origin_country,
      language: item.original_language,
      startDate: item.first_air_date,
      summary: item.overview,
      genres: item.genre_ids,
      rating: item.vote_average,
    }));
    return {
      currentPage: pagination.currentPage,
      hasNextPage: pagination.hasNextPage,
      totalPages: pagination.totalPages,
      totalResults: pagination.totalResults,
      data: data as searchData[],
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
