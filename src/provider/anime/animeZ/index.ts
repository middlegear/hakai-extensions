import { fetchAnimeInfo, fetchSources, getAnimeEpisodes, matchingSearcResponse } from './animeZ.js';
import { category, servers } from './types.js';

class AnimeZ {
  /**
   * Searches for anime based on the provided query.
   * @param {string} query - The search query string. Required.
   * @param {number} [page=1] - The page number for pagination (optional, defaults to 1).
   * @returns {Promise<Array>} - An array of anime related to the search query.
   */
  async search(query: string, page: number = 1) {
    return matchingSearcResponse(query, page);
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
   * Fetches streaming sources for a given anime episode.
   * @param {string} episodeId - The unique identifier for the episode. Required.
   * @param {servers} [server=servers.SU57] - The server to use (optional, defaults to SU57).
   * @param {category} [dub=category.SUB] - The language category (optional, defaults to subbed).
   * @returns {Promise<Object>} - An object containing streaming sources.
   */
  async fetchSources(episodeId: string, server = servers.SU57, dub = category.SUB) {
    return fetchSources(episodeId, server, dub);
  }

  /**
   * Fetches episode list for a given anime.
   * @param {string} id - The anime ID. Required.
   * @returns {Promise<Array>} - An array containing episode details.
   */
  async fetchEpisodes(id: string) {
    return getAnimeEpisodes(id);
  }
}

export { AnimeZ };
