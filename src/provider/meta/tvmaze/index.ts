import { getExternal, getInfoDetailed, searchImdb, searchShows, searchTvdb } from './tvmaze.js';
import type { ExternalDbRes, ExternalIdPromise, ShowInfo, TvMazeRes } from './tvmaze.js';

/**
 * A class for interacting with the TVMaze API to search for TV shows and fetch
 * detailed information using various identifiers (query, IMDb ID, TVDb ID, TVMaze ID).
 */
class TvMaze {
  /**
   * Searches for TV shows based on the provided query string.
   * @param {string} query - The search query string (required).
   * @returns {Promise<TvMazeRes>} A promise that resolves to an object containing an array of TV shows related to the search query.
   */
  async search(query: string): Promise<TvMazeRes> {
    return searchShows(query);
  }

  /**
   * Looks up TV shows on TVMaze using an IMDb ID.
   * @param {string} imdbId - The IMDb show ID (required).
   * @returns {Promise<ExternalDbRes>} A promise that resolves to an object containing TV show metadata.
   */
  async searchbyImDbId(imdbId: string): Promise<ExternalDbRes> {
    return searchImdb(imdbId);
  }

  /**
   * Looks up TV shows on TVMaze using a TVDb ID.
   * @param {number} tvdbId - The TVDb ID of the show (required).
   * @returns {Promise<ExternalDbRes>} A promise that resolves to an object containing TV show metadata.
   */
  async searchbyTvDbId(tvdbId: number): Promise<ExternalDbRes> {
    return searchTvdb(tvdbId);
  }

  /**
   * Looks up detailed information about a show using its TVMaze ID.
   * @param {number} tvMazeId - The TVMaze ID of the show (required).
   * @returns {Promise<ShowInfo>} A promise that resolves to an object containing comprehensive show metadata, including cast and episodes.
   */
  async fetchInfo(tvMazeId: number): Promise<ShowInfo> {
    return getInfoDetailed(tvMazeId);
  }

  /**
   * Looks up external TV show IDs linked to other databases (e.g., IMDb, TVDb, TheTVDB) using a TVMaze ID.
   * @param {number} tvMazeId - The TVMaze ID of the show (required).
   * @returns {Promise<ExternalIdPromise>} A promise that resolves to an object containing external IDs for other databases.
   */
  async fetchExternal(tvMazeId: number): Promise<ExternalIdPromise> {
    return getExternal(tvMazeId);
  }
}

export { TvMaze };
