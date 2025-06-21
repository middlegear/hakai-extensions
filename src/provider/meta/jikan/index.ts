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
  getAnimeProviderIdWithInfo,
  getTopUpcoming,
  getAnimeProviderEpisodes,
} from './jikan.js';
import type {
  JIkanSearch,
  JikanInfo,
  JikanMatchedEpisodes,
  JikanCharacters,
  JikanTopAnime,
  JikanSeason,
  JikanEpisodes,
  JikanEpisodeInfo,
  JikanProviderId,
} from './jikan.js';
import { AnimeProvider, Format, Seasons, JikanStatus } from '../../../types/types.js';

/**
 * A class for interacting with the Jikan API (MyAnimeList unofficial API) to search for anime,
 * fetch detailed information, retrieve various top lists (airing, movies, popular, upcoming),
 * seasonal anime, character details, and episode information  from MyAnimeList.
 */
class Jikan {
  /**
   * Searches for anime titles based on the provided query string.
   * @param {string} query - The search query string (required).
   * @param {number} [page=1] - The page number for pagination (optional, defaults to 1).
   * @param {number} [perPage=20] - The number of results per page (optional, defaults to 20, maximum 25).
   * @returns {Promise<JIkanSearch>} A promise that resolves to an object containing an array of anime results related to the search query.
   */
  async search(query: string, page: number = 1, perPage: number = 20): Promise<JIkanSearch> {
    return searchAnime(query, page, perPage);
  }

  /**
   * Fetches detailed information about a specific anime using its MyAnimeList (MAL) ID.
   * @param {number} id - The unique MyAnimeList (MAL) ID for the anime (required).
   * @returns {Promise<JikanInfo>} A promise that resolves to an object containing comprehensive detailed anime information.
   */
  async fetchInfo(id: number): Promise<JikanInfo> {
    return getInfoById(id);
  }

  /**
   * Fetches anime information along with a provider-specific anime ID.
   * This is useful for linking MyAnimeList entries to external streaming provider IDs.
   * @param {number} id - The unique MyAnimeList (MAL) ID for the anime (required).
   * @param {AnimeProvider} [provider=AnimeProvider.HiAnime] - The anime provider to fetch the ID for (optional, defaults to AnimeProvider.HiAnime).
   * @returns {Promise<JikanProviderId>} A promise that resolves to an object containing the provider-specific anime ID and core anime info.
   */
  async fetchProviderAnimeId(id: number, provider: AnimeProvider = AnimeProvider.HiAnime): Promise<JikanProviderId> {
    return getAnimeProviderIdWithInfo(id, provider);
  }

  /**
   * Fetches anime information along with provider-specific episode details.
   * This is used to get streamable episodes from a given provider linked via MAL ID.
   * @param {number} id - The unique MyAnimeList (MAL) ID for the anime (required).
   * @param {AnimeProvider} [provider=AnimeProvider.HiAnime] - The anime provider to fetch episodes from (optional, defaults to AnimeProvider.HiAnime).
   * @returns {Promise<JikanMatchedEpisodes>} A promise that resolves to an object containing anime info with matched provider episodes.
   */
  async fetchAnimeProviderEpisodes(
    id: number,
    provider: AnimeProvider = AnimeProvider.HiAnime,
  ): Promise<JikanMatchedEpisodes> {
    return getAnimeProviderEpisodes(id, provider);
  }

  /**
   * Fetches characters associated with a specific anime.
   * @param {number} id - The unique MyAnimeList (MAL) ID for the anime (required).
   * @returns {Promise<JikanCharacters>} A promise that resolves to an object containing an array of anime characters.
   */
  async fetchAnimeCharacters(id: number): Promise<JikanCharacters> {
    return getAnimeCharacters(id);
  }

  /**
   * Fetches a list of the most anticipated upcoming anime.
   * @param {number} [page=1] - The page number for pagination (optional, defaults to 1).
   * @param {number} [perPage=20] - The number of results per page (optional, defaults to 20, maximum 25).
   * @returns {Promise<JikanTopAnime>} A promise that resolves to an object containing an array of upcoming anime resources.
   */
  async fetchTopUpcoming(page: number = 1, perPage: number = 20): Promise<JikanTopAnime> {
    return getTopUpcoming(page, perPage);
  }

  /**
   * Fetches a list of the top airing anime.
   * @param {number} [page=1] - The page number for pagination (optional, defaults to 1).
   * @param {number} [perPage=20] - The number of results per page (optional, defaults to 20, maximum 25).
   * @param {Format} [format=Format.TV] - The format type to filter by (optional, defaults to Format.TV).
   * @param {JikanStatus} [filter=JikanStatus.Airing] - The status filter for the anime (optional, defaults to JikanStatus.Airing).
   * @returns {Promise<JikanTopAnime>} A promise that resolves to an object containing the list of top airing anime.
   */
  async fetchTopAiring(
    page: number = 1,
    perPage: number = 20,
    format: Format = Format.TV,
    filter: JikanStatus = JikanStatus.Airing,
  ): Promise<JikanTopAnime> {
    return getTopAnime(page, perPage, filter, format);
  }

  /**
   * Fetches a list of the top anime movies.
   * @param {number} [page=1] - The page number for pagination (optional, defaults to 1).
   * @param {number} [perPage=20] - The number of results per page (optional, defaults to 20, maximum 25).
   * @param {JikanStatus} [filter=JikanStatus.Favourite] - The status filter for the anime (optional, defaults to JikanStatus.Favourite).
   * @param {Format} [format=Format.MOVIE] - The format type to filter by (optional, defaults to Format.MOVIE).
   * @returns {Promise<JikanTopAnime>} A promise that resolves to an object containing the list of top anime movies.
   */
  async fetchTopMovies(
    page: number = 1,
    perPage: number = 20,
    filter: JikanStatus = JikanStatus.Favourite,
    format: Format = Format.MOVIE,
  ): Promise<JikanTopAnime> {
    return getTopAnime(page, perPage, filter, format);
  }

  /**
   * Fetches a list of the most popular anime.
   * @param {number} [page=1] - The page number for pagination (optional, defaults to 1).
   * @param {number} [perPage=20] - The number of results per page (optional, defaults to 20, maximum 25).
   * @param {Format} [format=Format.TV] - The format type to filter by (optional, defaults to Format.TV).
   * @param {JikanStatus} [filter=JikanStatus.Popularity] - The status filter for the anime (optional, defaults to JikanStatus.Popularity).
   * @returns {Promise<JikanTopAnime>} A promise that resolves to an object containing the list of most popular anime.
   */
  async fetchMostPopular(
    page: number = 1,
    perPage: number = 20,
    format: Format = Format.TV,
    filter: JikanStatus = JikanStatus.Popularity,
  ): Promise<JikanTopAnime> {
    return getTopAnime(page, perPage, filter, format);
  }

  /**
   * Fetches seasonal anime for a given year and season.
   * @param {Seasons} season - The target season (e.g., WINTER, SPRING, SUMMER, FALL) (required).
   * @param {number} year - The target year (e.g., 2023, 2024) (required).
   * @param {Format} [format=Format.TV] - The anime format to filter by (optional, defaults to Format.TV).
   * @param {number} [page=1] - The page number for pagination (optional, defaults to 1).
   * @param {number} [perPage=20] - The number of results per page (optional, defaults to 20, maximum 25).
   * @returns {Promise<JikanSeason>} A promise that resolves to an object containing the list of seasonal anime.
   */
  async fetchSeason(
    season: Seasons,
    year: number,
    format: Format = Format.TV,
    page: number = 1,
    perPage: number = 20,
  ): Promise<JikanSeason> {
    return getSeason(year, season, format, page, perPage);
  }

  /**
   * Fetches the anime list for the current season.
   * @param {number} [page=1] - The page number for pagination (optional, defaults to 1).
   * @param {number} [perPage=20] - The number of results per page (optional, defaults to 20, maximum 25).
   * @param {Format} [format=Format.TV] - The format type to filter by (optional, defaults to Format.TV).
   * @returns {Promise<JikanSeason>} A promise that resolves to an object containing the list of current seasonal anime.
   */
  async fetchCurrentSeason(page: number = 1, perPage: number = 20, format: Format = Format.TV): Promise<JikanSeason> {
    return getCurrentSeason(page, perPage, format);
  }

  /**
   * Fetches the anime list for the upcoming season.
   * @param {number} [page=1] - The page number for pagination (optional, defaults to 1).
   * @param {number} [perPage=20] - The number of results per page (optional, defaults to 20, maximum 25).
   * @param {Format} [format=Format.TV] - The format type to filter by (optional, defaults to Format.TV).
   * @returns {Promise<JikanSeason>} A promise that resolves to an object containing the list of upcoming season's anime.
   */
  async fetchNextSeason(page: number = 1, perPage: number = 20, format: Format = Format.TV): Promise<JikanSeason> {
    return getNextSeason(page, perPage, format);
  }

  /**
   * Fetches the episode list for a given anime directly from MyAnimeList (MAL).
   * @param {number} id - The unique MyAnimeList (MAL) ID for the anime (required).
   * @param {number} [page=1] - The page number for pagination (optional, defaults to 1).
   * @returns {Promise<JikanEpisodes>} A promise that resolves to an object containing the anime episodes list.
   */
  async fetchMalEpisodes(id: number, page: number = 1): Promise<JikanEpisodes> {
    return getEpisodes(id, page);
  }

  /**
   * Fetches detailed information about a specific episode from MyAnimeList (MAL).
   * @param {number} id - The unique MyAnimeList (MAL) ID for the anime (required).
   * @param {number} episodeNumber - The specific episode number (required).
   * @returns {Promise<JikanEpisodeInfo>} A promise that resolves to an object containing the detailed episode information.
   */
  async fetchMalEpisodeInfo(id: number, episodeNumber: number): Promise<JikanEpisodeInfo> {
    return getEpisodeInfo(id, episodeNumber);
  }
}

export { Jikan };
