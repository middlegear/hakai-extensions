import {
  fetchAnimeInfo,
  fetchSources,
  matchingSearcResponse,
} from './animeZ.js';

class AnimeZ {
  /**
   *
   * @param query search query string
   * @param page number (optional) defaults to 1
   * @returns an array of anime related to search
   */
  async search(query: string, page: number = 1) {
    return matchingSearcResponse(query, page);
  }

  /**
   *
   * @param animeId string
   * @returns anime information with episode data
   */
  async fetchInfo(animeId: string) {
    return fetchAnimeInfo(animeId);
  }
  /**
   *
   * @param episodeId string
   * @returns streaming sources
   */

  async fetchSources(episodeId: string) {
    return fetchSources(episodeId);
  }
}
export { AnimeZ };
