import { _getInfo, _getServers, _search, _getsources } from './flixhq.js';
import type { FlixServerRes, FLixInfoRes, FlixSearchRes, FLixSourcesRes } from './flixhq.js';
import { StreamingServers } from './types.js';

/**
 * A class for interacting with  FlixHQ to search for media, fetch detailed media information,
 * retrieve server options, and get streaming sources.
 */
class FlixHQ {
  /**
   * Searches for movies and TV shows based on the provided query.
   * @param {string} query - The search query string (required).
   * @param {number} [page=1] - The page number for pagination (optional, defaults to 1).
   * @returns {Promise<FlixSearchRes>} A promise that resolves to an object containing an array of TV shows/movies related to the search query.
   */
  async search(query: string, page: number = 1): Promise<FlixSearchRes> {
    return _search(query, page);
  }

  /**
   * Fetches detailed information about a specific movie or TV show.
   * @param {string} mediaId - The unique identifier for the movie or TV show (required).
   * @returns {Promise<FLixInfoRes>} A promise that resolves to an object containing detailed media information, including episodes for TV shows.
   */
  async fetchMediaInfo(mediaId: string): Promise<FLixInfoRes> {
    return _getInfo(mediaId);
  }

  /**
   * Fetches available server information for a specific media episode.
   * @param {string} episodeId - The unique identifier for the episode/movie (required). Found in the episodes array.
   * @returns {Promise<FlixServerRes>} A promise that resolves to an object containing server information for the episode.
   */
  async fetchMediaServers(episodeId: string): Promise<FlixServerRes> {
    return _getServers(episodeId);
  }

  /**
   * Fetches streaming sources for a selected media episode from a specified server.
   * @param {string} episodeId - The unique identifier for the episode/movie (required). Found in the episodes array
   * @param {StreamingServers} [server=StreamingServers.VidCloud] - The server to use (optional, defaults to StreamingServers.Vidcloud). Note: Upcloud is CORS protected (Error 403). Use a proxy or switch to Akcloud or Vidcloud.
   * @returns {Promise<FLixSourcesRes>} A promise that resolves to an object containing streaming sources for the media.
   */
  async fetchSources(episodeId: string, server: StreamingServers = StreamingServers.VidCloud): Promise<FLixSourcesRes> {
    return _getsources(episodeId, server);
  }
}

export { FlixHQ };
