import { TimeWindow } from '../../../types/types';
import {
  _getTrendingTv,
  type TvEpisodes,
  getTvEpisodes,
  getTvShowInfo,
  searchTmdbMovie,
  searchTVShows,
  type ShowInfo,
  type tmdbTV,
  _getPopularTv,
  _getTopRatedTv,
  _getAiringTv,
  type tmdbMovie,
} from './tmdb';

class TheMovieDb {
  private apiKey: string = 'b29bfe548cc2a3e4225effbd54ef0fda';
  /**
   * Searches for tv shows based on the provided query.
   *
   * @param {string} query - The search query string (required).
   * @param {number} [page=1] - Page number for pagination (optional, defaults to 1).
   *
   * @returns {Promise<tmdbTV>} Array of related tv shows
   */
  async searchShows(query: string, page: number = 1): Promise<tmdbTV> {
    return searchTVShows(query, page, this.apiKey);
  }
  /**
   * Fetches Information about a tvshow using tmdbId
   *
   * @param {number} tmdbId - The Show tmdbId (required)
   * @returns {Promise <ShowInfo>} An object having show info
   */
  async fetchShowInfo(tmdbId: number): Promise<ShowInfo> {
    return getTvShowInfo(tmdbId, this.apiKey);
  }

  /**
   *Fetches show episodes available in a season
   *
   * @param {number} tmdbId - The Show specific tmdbId (required)
   * @param {number} season - Show season number to fetch. Defaults to 1 (required)
   * @returns {Promise <EpisodesRes> } An Array containing episodes  and info
   */
  async fetchTvEpisodes(tmdbId: number, season: number = 1): Promise<TvEpisodes> {
    return getTvEpisodes(tmdbId, season, this.apiKey);
  }
  /**
   * Fetches Trending tv shows
   *
   * @param {TimeWindow} timeWindow - The timewindow to fetch(day or week). Default is TimeWindow.Week(Optional)
   * @param {number } page - The page number to fetch(optional).Defaults to 1
   * @returns {Promise<tmdbTV>} - An array containing trending Tv shows.
   */
  async fetchTrendingTv(timeWindow: TimeWindow = TimeWindow.Week, page: number = 1): Promise<tmdbTV> {
    return _getTrendingTv(timeWindow, page, this.apiKey);
  }

  /**
   * Fetches Popular Tv shows
   *
   * @param {number} page -  The page number to fetch(optional).Defaults to 1
   * @returns {Promise <tmdbTV>} An array containing popular tv shows
   */
  async fetchPopularTv(page: number): Promise<tmdbTV> {
    return _getPopularTv(page, this.apiKey);
  }

  /**
   * Fetches Top Tv Shows
   *
   * @param {number} page -  The page number to fetch(optional).Defaults to 1
   * @returns {Promise <tmdbTV>} An array containing top tv shows
   */
  async fetchTopShows(page: number = 1): Promise<tmdbTV> {
    return _getTopRatedTv(page, this.apiKey);
  }

  /**
   * Fetches airing shows
   *
   * @param {number} page -  The page number to fetch(optional).Defaults to 1
   * @returns {Promise <tmdbTV>} An array containing airing shows
   */
  async fetchAiringTv(page: number): Promise<tmdbTV> {
    return _getAiringTv(page, this.apiKey);
  }

  /**
   * Searches for Movies based on the provided query.
   *
   * @param {string} query - The search query string (required).
   * @param {number} [page=1] - Page number for pagination (optional, defaults to 1).
   *
   * @returns {Promise <tmdbMovie>} Array of related movies
   */
  async searchMovies(query: string, page: number = 1): Promise<tmdbMovie> {
    return searchTmdbMovie(query, page, this.apiKey);
  }
}
export { TheMovieDb };
