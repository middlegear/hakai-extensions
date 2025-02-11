import {
  getAnimeCharacters,
  getCurrentSeason,
  getInfoById,
  getNextSeason,
  getSeason,
  getTopAnime,
  searchAnime,
  getEpisodeInfo,
  getEpisodes,
  getProviderId,
  getEpisodeswithInfo,
} from './jikan.js';
import { AnimeType, AnimeStatusFilter, Season, Filters, AnimeProvider } from './types.js';

class Jikan {
  /**
   * Searches for anime by query.
   * @param {string} query - The search query (Required).
   * @param {number} [page=1] - The page number.
   * @param {number} [limit=25] - Number of results per page.
   * @param {AnimeType} [type=AnimeType.TV] - The anime type filter.
   * @returns {Promise<any>} - The search results.
   */
  async search(query: string, page = 1, limit = 25) {
    return searchAnime(query, page, limit);
  }

  /**
   * Fetches anime details by MAL ID.
   * @param {number} id - The MAL ID (Required).
   * @returns {Promise<any>} - The anime information.
   */
  async fetchInfo(id: number) {
    return getInfoById(id);
  }

  /**
   * Fetches anime provider mappings for an anime.
   * @param {number} id - The MAL ID (Required).
   * @returns {Promise<any>} - The mapped providerId with anime details.
   */
  async fetchAnimeId(id: number) {
    return getProviderId(id);
  }
  /**
   * Fetches anime provider episodes for an anime.
   *@param {number} id - The MAL ID (Required).
   * @param {AnimeProvider} - The anime provider Zoro / AnimeZ
   * @returns {Promise<any>} - The animeInfo with Episodes
   */
  async fetchAnimeEpisodes(id: number, provider: AnimeProvider) {
    return getEpisodeswithInfo(id, provider);
  }
  /**
   * Fetches characters for a given anime.
   * @param {number} id - The MAL ID (Required).
   * @returns {Promise<any>} - The anime characters.
   */
  async fetchAnimeCharacters(id: number) {
    return getAnimeCharacters(id);
  }

  /**
   * Fetches top anime based on filters.
   * @param {AnimeStatusFilter} filter - The filter type (airing, upcoming, etc.).
   * @param {AnimeType} [type=AnimeType.TV] - The anime type.
   * @param {number} [page=1] - The page number.
   * @param {number} [limit=25] - Number of results per page.
   * @returns {Promise<any>} - The top anime list.
   */
  async fetchTopAnime(page = 1, limit = 25, filter: AnimeStatusFilter, type: AnimeType = AnimeType.TV) {
    return getTopAnime(page, limit, filter, type);
  }

  /**
   * Fetches seasonal anime for a given year and season.
   * @param {number} year - The target year (Required).
   * @param {Season} season - The target season (winter, fall, etc.).
   * @param {Filters} [filter=Filters.TV] - The filter type.
   * @param {number} [page=1] - The page number.
   * @param {number} [limit=25] - Number of results per page.
   * @returns {Promise<any>} - The seasonal anime list.
   */
  async fetchSeason(year: number, season: Season, page = 1, limit = 25, filter: Filters = Filters.TV) {
    return getSeason(year, season, filter, page, limit);
  }

  /**
   * Fetches currently airing seasonal anime.
   * @param {Filters} [filter=Filters.TV] - The filter type.
   * @param {number} [page=1] - The page number.
   * @param {number} [limit=25] - Number of results per page.
   * @returns {Promise<any>} - The current seasonal anime.
   */
  async fetchCurrentSeason(filter: Filters = Filters.TV, page = 1, limit = 25) {
    return getCurrentSeason(filter, page, limit);
  }

  /**
   * Fetches anime for the upcoming season.
   * @param {Filters} [filter=Filters.TV] - The filter type.
   * @param {number} [page=1] - The page number.
   * @param {number} [limit=25] - Number of results per page.
   * @returns {Promise<any>} - The upcoming season's anime.
   */
  async fetchNextSeason(filter: Filters = Filters.TV, page = 1, limit = 25) {
    return getNextSeason(filter, page, limit);
  }

  /**
   * Fetches episode list for a given anime.
   * @param {number} id - The MAL ID (Required).
   * @param {number} [page=1] - The page number.
   * @returns {Promise<any>} - The anime episodes.
   */
  async fetchEpisodes(id: number, page = 1) {
    return getEpisodes(id, page);
  }

  /**
   * Fetches detailed information about a specific episode.
   * @param {number} id - The MAL ID (Required).
   * @param {number} episodeNumber - The episode number (Required).
   * @returns {Promise<any>} - The episode details.
   */
  async fetchEpisodeInfo(id: number, episodeNumber: number) {
    return getEpisodeInfo(id, episodeNumber);
  }
}

export { Jikan };
