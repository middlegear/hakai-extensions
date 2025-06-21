import {
  _getInfo,
  _getServers,
  _search,
  type FlixServerRes,
  type FLixInfoRes,
  type FlixSearchRes,
  type FLixSourcesRes,
  _getsources,
} from './flixhq';
import { StreamingServers } from './types';

class FlixHQ {
  /**
   * Searches for media based on the provided query.
   * @param {string} query - The search query string (required).
   * @param {number} [page=1] - The page number for pagination (optional, defaults to 1).
   * @returns {Promise<FlixSearchRes>} - An array of tv/movies  related to the search query.
   */
  async search(query: string, page: number = 1): Promise<FlixSearchRes> {
    return _search(query, page);
  }

  /**
   * Fetches detailed information about a specific media .
   * @param {string} mediaId - The unique identifier for the media (required).
   * @returns {Promise<FLixInfoRes>} - An object containing media details including episodes.
   */
  async fetchMediaInfo(mediaId: string): Promise<FLixInfoRes> {
    return _getInfo(mediaId);
  }

  /**
   * Fetches available server information for a specific episode.
   * @param {string} episodeId - The unique identifier for the episode (required).
   * @returns {Promise<FlixServerRes>} - An object containing server information.
   */
  async fetchMediaServers(episodeId: string): Promise<FlixServerRes> {
    return _getServers(episodeId);
  }

  /**
   * Fetches streaming sources for a selected media episode.
   * @param {string} episodeId - The unique identifier for the episode (required).
   * @param {StreamingServers} [server=StreamingServers.Akcloud] - The server to use (optional, defaults to StreamingServers.Akcloud).Upcloud is Cors protected (Error 403). Use a proxy or switch to Akcloud or Vidcloud
   * @returns {Promise<FLixSourcesRes>} - An object containing streaming sources.
   */
  async fetchSources(episodeId: string, server: StreamingServers = StreamingServers.Akcloud): Promise<FLixSourcesRes> {
    return _getsources(episodeId, server);
  }
}
export { FlixHQ };
