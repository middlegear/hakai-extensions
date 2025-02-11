import { fetchAnimeInfo, fetchEpisodeSources, fetchServers, searchAnime } from './hiAnime.js';
import { Dubbing, Servers } from './types.js';

class HiAnime {
  /**
   * Searches for anime based on the provided query.
   * @param {string} query - The search query string. Required.
   * @param {number} [page=1] - The page number for pagination (optional, defaults to 1).
   * @returns {Promise<Array>} - An array of anime related to the search query.
   */
  async search(query: string, page: number = 1) {
    return searchAnime(query, page);
  }
  /**
   * Fetches detailed information about a specific anime, including episode data.
   * @param {string} animeId - The unique identifier for the anime.
   * @returns {Promise<Object>} - An object containing anime details and episode information.
   */
  async fetchInfo(animeId: string) {
    return fetchAnimeInfo(animeId);
  }
  /**
   * Fetches available server infomation about the episode
   * @param {string} episodeId - The unique identifier for the episode
   * @returns {Promise<Object>}- An object containing server information
   */
  async fetchEpisodeServers(episodeId: string) {
    return fetchServers(episodeId);
  }
  /**
   * Fetches streaming sources for a given anime episode.
   * @param {string} episodeId - The unique identifier for the episode. Required.
   * @param {servers} [server=servers.HD1] - The server to use (optional, defaults to SU57).
   * @param {category} [category=Dubbing.SUB] - The language category (optional, defaults to subbed).
   * @returns {Promise<Object>} - An object containing streaming sources.
   */
  async fetchSources(episodeId: string, server: Servers = Servers.HD1, category: Dubbing = Dubbing.Sub) {
    return fetchEpisodeSources(episodeId, server, category);
  }
}
export { HiAnime };
