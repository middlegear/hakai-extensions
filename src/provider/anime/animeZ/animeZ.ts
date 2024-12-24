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
  async searchSuggestions(query: string) {
    return searchSuggestions(query);
  }
  async fetchInfo(animeId: string) {
    return fetchAnimeInfo(animeId);
  }

  async fetchSources(episodeId: string) {
    return fetchSources(episodeId);
  }
}
export { AnimeZ };
