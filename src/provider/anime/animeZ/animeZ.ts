import { searchAnime, searchSuggestions } from "./searchAnime";
import { fetchAnimeInfo } from "./fetchAnimeInfo";
import { fetchSources } from "./fetchSources";
class AnimeZ {
  /**
   *
   * @param query search query string
   * @param page number (optional) defaults to 1
   * @returns an array of anime related to search
   */
  async search(query: string, page: number = 1) {
    return searchAnime(query, page);
  }
  /**
   *
   * @param query search query  as string
   * @returns search results for anime
   */
  async searchSuggestions(query: string) {
    return searchSuggestions(query);
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
