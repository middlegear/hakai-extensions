import {
  _getTrendingTv,
  getTvEpisodes,
  getTvShowInfo,
  searchTmdbMovie,
  searchTVShows,
  _getPopularTv,
  _getTopRatedTv,
  _getAiringTv,
  getMovieInfo,
  _getTrendingMovies,
  _getPopularMovies,
  _getTopRatedMovies,
  _getReleasingMovies,
  _getUpcomingMovies,
} from './tmdb';
import type { TvEpisodes, ShowInfo, tmdbTV, tmdbMovie, MovieInfoRes } from './tmdb';
import { TimeWindow } from '../../../types/types';

/**
 * A class for interacting with The Movie Database (TMDb) API to search for and retrieve
 * information about TV shows and movies, including trending, popular, top-rated, and seasonal data.
 */
class TheMovieDb {
  private apiKey: string = 'b29bfe548cc2a3e4225effbd54ef0fda';

  /**
   * Searches for TV shows based on the provided query string.
   * @param {string} query - The search query string (required).
   * @param {number} [page=1] - The page number for pagination (optional, defaults to 1).
   * @returns {Promise<tmdbTV>} A promise that resolves to an object containing an array of TV shows related to the search query.
   */
  async searchShows(query: string, page: number = 1): Promise<tmdbTV> {
    return searchTVShows(query, page, this.apiKey);
  }

  /**
   * Fetches detailed information about a specific TV show using its TMDb ID.
   * @param {number} tmdbId - The unique TMDb ID for the TV show (required).
   * @returns {Promise<ShowInfo>} A promise that resolves to an object containing comprehensive TV show information.
   */
  async fetchShowInfo(tmdbId: number): Promise<ShowInfo> {
    return getTvShowInfo(tmdbId, this.apiKey);
  }

  /**
   * Fetches episodes available in a specific season of a TV show.
   * @param {number} tmdbId - The unique TMDb ID for the TV show (required).
   * @param {number} [season=1] - The season number for which to fetch episodes (optional, defaults to 1).
   * @returns {Promise<TvEpisodes>} A promise that resolves to an object containing an array of episodes and their information for the specified season.
   */
  async fetchTvEpisodes(tmdbId: number, season: number = 1): Promise<TvEpisodes> {
    return getTvEpisodes(tmdbId, season, this.apiKey);
  }

  /**
   * Fetches trending TV shows based on a specified time window.
   * @param {TimeWindow} [timeWindow=TimeWindow.Week] - The time window to fetch trending shows (day or week) (optional, defaults to TimeWindow.Week).
   * @param {number} [page=1] - The page number for pagination (optional, defaults to 1).
   * @returns {Promise<tmdbTV>} A promise that resolves to an object containing an array of trending TV shows.
   */
  async fetchTrendingTv(timeWindow: TimeWindow = TimeWindow.Week, page: number = 1): Promise<tmdbTV> {
    return _getTrendingTv(timeWindow, page, this.apiKey);
  }

  /**
   * Fetches popular TV shows.
   * @param {number} [page=1] - The page number for pagination (optional, defaults to 1).
   * @returns {Promise<tmdbTV>} A promise that resolves to an object containing an array of popular TV shows.
   */
  async fetchPopularTv(page: number = 1): Promise<tmdbTV> {
    return _getPopularTv(page, this.apiKey);
  }

  /**
   * Fetches top-rated TV shows.
   * @param {number} [page=1] - The page number for pagination (optional, defaults to 1).
   * @returns {Promise<tmdbTV>} A promise that resolves to an object containing an array of top-rated TV shows.
   */
  async fetchTopShows(page: number = 1): Promise<tmdbTV> {
    return _getTopRatedTv(page, this.apiKey);
  }

  /**
   * Fetches currently airing TV shows.
   * @param {number} [page=1] - The page number for pagination (optional, defaults to 1).
   * @returns {Promise<tmdbTV>} A promise that resolves to an object containing an array of airing TV shows.
   */
  async fetchAiringTv(page: number = 1): Promise<tmdbTV> {
    return _getAiringTv(page, this.apiKey);
  }

  /**
   * Searches for movies based on the provided query string.
   * @param {string} query - The search query string (required).
   * @param {number} [page=1] - The page number for pagination (optional, defaults to 1).
   * @returns {Promise<tmdbMovie>} A promise that resolves to an object containing an array of movies related to the search query.
   */
  async searchMovies(query: string, page: number = 1): Promise<tmdbMovie> {
    return searchTmdbMovie(query, page, this.apiKey);
  }

  /**
   * Fetches detailed information about a specific movie using its TMDb ID.
   * @param {number} tmdbId - The unique TMDb ID for the movie (required).
   * @returns {Promise<MovieInfoRes>} A promise that resolves to an object containing comprehensive movie information.
   */
  async fetchMovieInfo(tmdbId: number): Promise<MovieInfoRes> {
    return getMovieInfo(tmdbId, this.apiKey);
  }

  /**
   * Fetches trending movies based on a specified time window.
   * @param {TimeWindow} [timeWindow=TimeWindow.Week] - The time window to fetch trending movies (day or week) (optional, defaults to TimeWindow.Week).
   * @param {number} [page=1] - The page number for pagination (optional, defaults to 1).
   * @returns {Promise<tmdbMovie>} A promise that resolves to an object containing an array of trending movies.
   */
  async fetchTrendingMovies(timeWindow: TimeWindow = TimeWindow.Week, page: number = 1): Promise<tmdbMovie> {
    return _getTrendingMovies(timeWindow, page, this.apiKey);
  }

  /**
   * Fetches popular movies.
   * @param {number} [page=1] - The page number for pagination (optional, defaults to 1).
   * @returns {Promise<tmdbMovie>} A promise that resolves to an object containing an array of popular movies.
   */
  async fetchPopularMovies(page: number = 1): Promise<tmdbMovie> {
    return _getPopularMovies(page, this.apiKey);
  }

  /**
   * Fetches top-rated movies.
   * @param {number} [page=1] - The page number for pagination (optional, defaults to 1).
   * @returns {Promise<tmdbMovie>} A promise that resolves to an object containing an array of top-rated movies.
   */
  async fetchTopMovies(page: number = 1): Promise<tmdbMovie> {
    return _getTopRatedMovies(page, this.apiKey);
  }

  /**
   * Fetches movies that are currently in cinemas.
   * @param {number} [page=1] - The page number for pagination (optional, defaults to 1).
   * @returns {Promise<tmdbMovie>} A promise that resolves to an object containing an array of movies currently releasing in cinemas.
   */
  async fetchReleasingMovies(page: number = 1): Promise<tmdbMovie> {
    return _getReleasingMovies(page, this.apiKey);
  }

  /**
   * Fetches data on upcoming movies.
   * @param {number} [page=1] - The page number for pagination (optional, defaults to 1).
   * @returns {Promise<tmdbMovie>} A promise that resolves to an object containing an array of upcoming movies.
   */
  async fetchUpcomingMovies(page: number = 1): Promise<tmdbMovie> {
    return _getUpcomingMovies(page, this.apiKey);
  }
}

export { TheMovieDb };
