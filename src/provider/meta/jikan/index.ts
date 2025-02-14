import { AnimeProvider, Format, Seasons, Status } from '../../../types/types.js';
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
  getTopUpcoming,
} from './jikan.js';

class Jikan {
  /**
   * Searches for anime by query.
   * @param {string} query - The search query (Required).
   * @param {number} [page=1] - The page number.
   * @param {number} [limit=25] - Number of results per page.
   * @param {AnimeType} [type=AnimeType.TV] - The anime type filter.
   * @returns {Promise<any>} - The search results.
   */
  async search(query: string, page: number = 1, limit: number = 1) {
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
  async fetchProviderAnimeId(id: number) {
    return getProviderId(id);
  }
  /**
   * Fetches anime provider episodes for an anime.
   * @param {number} id - The MAL ID (Required).
   * @param {AnimeProvider} - The anime provider Hianime / AnimeZ
   * @param {number} [page=1] - The page number is a must for Animez provider defaults to 1, dont be surpised by the order
   * @returns {Promise<any>} - The animeInfo with Episodes
   */
  async fetchAnimeEpisodes(id: number, provider: AnimeProvider, page: number = 1) {
    return getEpisodeswithInfo(id, provider, page);
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
   * @param {number} [page=1] - The page number. defaults to 1 Optional
   * @param {number} [limit=25] - Number of results per page.. defaults to 25 optional
   * @returns {Promise<Array>} - The top anime list.
   */
  async fetchTopUpcoming(page: number = 1, limit: number = 25, status: Status = Status.Upcoming) {
    return getTopUpcoming(page, limit, status);
  }

  /**
   * Fetches top airing anime.
   * @param {number} [page=1] - The page number. defaults to 1 Optional
   * @param {number} [limit=25] - Number of results per page.. defaults to 25 optional
   * @returns {Promise<Array>} - The top airing list.
   */
  async fetchTopAiring(page: number = 1, limit: number = 25, filter: Status = Status.Airing, type: Format = Format.TV) {
    return getTopAnime(page, limit, filter, type);
  }

  /**
   * Fetches top movies type category.
   * @param {number} [page=1] - The page number. defaults to 1 Optional
   * @param {number} [limit=25] - Number of results per page.. defaults to 25 optional.
   * @returns {Promise<Array>} - The top Movie category
   */
  async fetchTopMovies(
    page: number = 1,
    limit: number = 25,
    filter: Status = Status.Favourite,
    type: Format = Format.MOVIE,
  ) {
    return getTopAnime(page, limit, filter, type);
  }
  /**
   * Fetches most popular anime category.
   * @param {number} [page=1] - The page number. defaults to 1 Optional
   * @param {number} [limit=25] - Number of results per page.. defaults to 25 optional
   * @returns {Promise<Array>} - The most popular anime resource
   */
  async fetchMostPopular(
    page: number = 1,
    limit: number = 25,
    filter: Status = Status.Popularity,
    type: Format = Format.TV,
  ) {
    return getTopAnime(page, limit, filter, type);
  }
  /**
   * Fetches seasonal anime for a given year and season.
   * @param {number} year - The target year (Required).
   * @param {Season} season - The target season (winter, fall, etc.).
   * @param {Format} [Format = Format.TV] - The format type defaults to tv
   * @param {number} [page=1] - The page number.
   * @param {number} [limit=25] - Number of results per page.
   * @returns {Promise<any>} - The seasonal anime list.
   */
  async fetchSeason(year: number, season: Seasons, page = 1, limit = 25, format: Format = Format.TV) {
    return getSeason(year, season, format, page, limit);
  }

  /**
   * Fetches currently airing seasonal anime.
   * @param {Format} [Format = Format.TV] - The format type defaults to tv
   * @param {number} [page=1] - The page number.
   * @param {number} [limit=25] - Number of results per page.
   * @returns {Promise<any>} - The current seasonal anime.
   */
  async fetchCurrentSeason(format: Format = Format.TV, page = 1, limit = 25) {
    return getCurrentSeason(format, page, limit);
  }

  /**
   * Fetches anime for the upcoming season.
   * @param {Format} [Format = Format.TV] - The format type defaults to tv
   * @param {number} [page=1] - The page number.
   * @param {number} [limit=25] - Number of results per page.
   * @returns {Promise<any>} - The upcoming season's anime.
   */
  async fetchNextSeason(format: Format = Format.TV, page = 1, limit = 25) {
    return getNextSeason(format, page, limit);
  }

  /**
   * Fetches episode list for a given anime.
   * @param {number} id - The MAL ID (Required).
   * @param {number} [page=1] - The page number.
   * @returns {Promise<any>} - The anime episodes.
   */
  async fetchMalEpisodes(id: number, page = 1) {
    return getEpisodes(id, page);
  }

  /**
   * Fetches detailed information about a specific episode.
   * @param {number} id - The MAL ID (Required).
   * @param {number} episodeNumber - The episode number (Required).
   * @returns {Promise<any>} - The episode details.
   */
  async fetchMalEpisodeInfo(id: number, episodeNumber: number) {
    return getEpisodeInfo(id, episodeNumber);
  }
}

export { Jikan };
