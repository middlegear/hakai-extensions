import { AnimeProvider, Format, Seasons, JikanStatus } from '../../../types/types.js';
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
  type JIkanSearch,
  type JikanInfo,
  type JikanMatchedEpisodes,
  type JikanCharacters,
  type JikanTopAnime,
  type JikanSeason,
  type JikanEpisodes,
  type JikanEpisodeInfo,
  type JikanProviderId,
  getAnimeProviderEpisodes,
} from './jikan.js';

class Jikan {
  /**
   * Searches for anime based on the provided query.
   * @param {string} query - The search query (required).
   * @param {number} [page=1] - Page number for pagination (optional, defaults to 1).
   * @param {number} [perPage=20] - Number of results per page (optional, defaults to 20). Max 25
   * @returns {Promise<JIkanSearch>} - An array of anime related to the search query.
   */
  async search(query: string, page: number = 1, perPage: number = 20): Promise<JIkanSearch> {
    return searchAnime(query, page, perPage);
  }

  /**
   * Fetches detailed information about an anime.
   * @param {number} id - The MAL ID (required).
   * @returns {Promise<JikanInfo>} - An object containing detailed anime information.
   */
  async fetchInfo(id: number): Promise<JikanInfo> {
    return getInfoById(id);
  }

  /**
   * Fetches anime information along with a provider-specific anime ID.
   * @param {number} id - The MAL ID (required).
   * @param {AnimeProvider} [provider=AnimeProvider.HiAnime] - The anime provider (optional, defaults to AnimeProvider.HiAnime or 'hianime').
   * @returns {Promise<JikanProviderId>} - An object containing the provider anime ID and anime info.
   */
  async fetchProviderAnimeId(id: number, provider: AnimeProvider = AnimeProvider.HiAnime): Promise<JikanProviderId> {
    return getAnimeProviderIdWithInfo(id, provider);
  }

  /**
   * Fetches anime information along with provider-specific episodes.
   * @param {number} id - The MAL ID (required).
   * @param {AnimeProvider} [provider=AnimeProvider.HiAnime] - The anime provider (optional, defaults to AnimeProvider.HiAnime or 'hianime').
   * @returns {Promise<JikanMatchedEpisodes>} - An object containing anime info with provider episodes.
   */
  async fetchAnimeProviderEpisodes(
    id: number,
    provider: AnimeProvider = AnimeProvider.HiAnime,
  ): Promise<JikanMatchedEpisodes> {
    return getAnimeProviderEpisodes(id, provider);
  }

  /**
   * Fetches characters for a given anime.
   * @param {number} id - The MAL ID (required).
   * @returns {Promise<JikanCharacters>} - An array of anime characters.
   */
  async fetchAnimeCharacters(id: number): Promise<JikanCharacters> {
    return getAnimeCharacters(id);
  }

  /**
   * Fetches the most anticipated upcoming anime.
   * @param {number} [page=1] - Page number for pagination (optional, defaults to 1).
   * @param {number} [perPage=20] - Number of results per page (optional, defaults to 20). Max 25
   * @returns {Promise<JikanTopAnime>} - An array of upcoming anime resources.
   */
  async fetchTopUpcoming(page: number = 1, perPage: number = 20): Promise<JikanTopAnime> {
    return getTopUpcoming(page, perPage);
  }

  /**
   * Fetches the top airing anime.
   * @param {number} [page] - Page number for pagination (optional, defaults to 1).
   * @param {number} [perPage] - Number of results per page (optional, defaults to 20). Max 25
   * @param {Format} [format] - The format type (optional, defaults to Format.TV).
   * @returns {Promise<JikanTopAnime>} - The top airing anime list.
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
   * Fetches the top anime movies.
   * @param {number} [page=1] - Page number for pagination (optional, defaults to 1).
   * @param {number} [perPage=20] - Number of results per page (optional, defaults to 20). Max 25
   * @returns {Promise<JikanTopAnime>} - The top anime movies list.
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
   * Fetches the most popular anime.
   * @param {number} [page] - Page number for pagination (optional, defaults to 1).
   * @param {number} [perPage] - Number of results per page (optional, defaults to 20). Max 25
   * @param {Format} [format] - The format type (optional, defaults to Format.TV).
   * @returns {Promise<JikanTopAnime>} - The most popular anime list.
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
   * @param {Seasons} season - The target season (e.g., WINTER, FALL) (required).
   * @param {number} year - The target year (required).
   * @param {Format} [format=Format.TV] - The format type (optional, defaults to Format.TV).
   * @param {number} [page=1] - Page number for pagination (optional, defaults to 1).
   * @param {number} [perPage=20] - Number of results per page (optional, defaults to 20). Max 25
   
   * @returns {Promise<JikanSeason>} - The seasonal anime list.
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
   * Fetches the current seasonal anime.
   * @param {number} [page=1] - Page number for pagination (optional, defaults to 1).
   * @param {number} [perPage=20] - Number of results per page (optional, defaults to 20). Max 25
   * @param {Format} [format=Format.TV] - The format type (optional, defaults to Format.TV).
   * @returns {Promise<JikanSeason>} - The current seasonal anime list.
   */
  async fetchCurrentSeason(page: number = 1, perPage: number = 20, format: Format = Format.TV): Promise<JikanSeason> {
    return getCurrentSeason(page, perPage, format);
  }

  /**
   * Fetches anime for the upcoming season.
   * @param {number} [page=1] - Page number for pagination (optional, defaults to 1).
   * @param {number} [perPage=20] - Number of results per page (optional, defaults to 20). Max 25
   * @param {Format} [format=Format.TV] - The format type (optional, defaults to Format.TV).
   * @returns {Promise<JikanSeason>} - The upcoming season's anime list.
   */
  async fetchNextSeason(page: number = 1, perPage: number = 20, format: Format = Format.TV): Promise<JikanSeason> {
    return getNextSeason(page, perPage, format);
  }

  /**
   * Fetches the episode list for a given anime from MyAnimeList (MAL).
   * @param {number} id - The MAL ID (required).
   * @param {number} [page=1] - The page number (optional, defaults to 1).
   * @returns {Promise<JikanEpisodes>} - The anime episodes list.
   */
  async fetchMalEpisodes(id: number, page: number = 1): Promise<JikanEpisodes> {
    return getEpisodes(id, page);
  }

  /**
   * Fetches detailed information about a specific episode from MyAnimeList (MAL).
   * @param {number} id - The MAL ID (required).
   * @param {number} episodeNumber - The episode number (required).
   * @returns {Promise<JikanEpisodeInfo>} - The episode details.
   */
  async fetchMalEpisodeInfo(id: number, episodeNumber: number): Promise<JikanEpisodeInfo> {
    return getEpisodeInfo(id, episodeNumber);
  }
}

export { Jikan };
