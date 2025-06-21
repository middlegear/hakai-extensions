import {
  searchAnime,
  fetchAnimeById,
  fetchTopAiring,
  fetchAnimeProviderIdWithInfo,
  fetchPopular,
  fetchTopRated,
  fetchSeason,
  fetchAnimeCharacters,
  getAnimeProviderEpisodes,
  getTrends,
  getRelated,
  fetchUpcoming,
} from './anilist.js';
import type {
  AnilistSearch,
  AnilistInfo,
  AnilistUpcoming,
  AnilistTopAiring,
  AnilistMostPopular,
  AnilistTopRated,
  AnilistSeason,
  AnilistTrends,
  AnilistRelatedData,
  AnilistCharacters,
  AnilistEpisodes,
  AnilistProviderId,
} from './anilist.js';
import { AnimeProvider, Charactersort, Format, Seasons } from '../../../types/types.js';

/**
 * A class for interacting with the Anilist API to search for anime, fetch detailed information,
 * retrieve various lists (trending, popular, top-rated, seasonal, upcoming), and get character
 * and episode information from specific providers.
 */
class Anilist {
  /**
   * Searches for anime based on the provided query string.
   * @param {string} search - The search query string (required).
   * @param {number} [page=1] - The page number for pagination (optional, defaults to 1).
   * @param {number} [perPage=20] - The number of results per page (optional, defaults to 20).
   * @returns {Promise<AnilistSearch>} A promise that resolves to an object containing an array of anime related to the search query.
   */
  async search(search: string, page: number = 1, perPage: number = 20): Promise<AnilistSearch> {
    return searchAnime(search, page, perPage);
  }

  /**
   * Fetches detailed information about a specific anime using its Anilist ID.
   * @param {number} id - The unique Anilist anime ID (required).
   * @returns {Promise<AnilistInfo>} A promise that resolves to an object containing detailed anime information.
   */
  async fetchInfo(id: number): Promise<AnilistInfo> {
    return fetchAnimeById(id);
  }

  /**
   * Fetches anime information along with a provider-specific anime ID.
   * This is useful for linking Anilist entries to external streaming provider IDs.
   * @param {number} id - The unique Anilist anime ID (required).
   * @param {AnimeProvider} [provider=AnimeProvider.HiAnime] - The anime provider to fetch the ID for (optional, defaults to AnimeProvider.HiAnime).
   * @returns {Promise<AnilistProviderId>} A promise that resolves to an object containing the provider-specific anime ID and core anime info.
   */
  async fetchProviderAnimeId(id: number, provider: AnimeProvider = AnimeProvider.HiAnime): Promise<AnilistProviderId> {
    return fetchAnimeProviderIdWithInfo(id, provider);
  }

  /**
   * Fetches a list of the top airing anime.
   * @param {number} [page=1] - The page number for pagination (optional, defaults to 1).
   * @param {number} [perPage=20] - The number of results per page (optional, defaults to 20).
   * @returns {Promise<AnilistTopAiring>} A promise that resolves to an object containing an array of top-airing anime.
   */
  async fetchAiring(page: number = 1, perPage: number = 20): Promise<AnilistTopAiring> {
    return fetchTopAiring(page, perPage);
  }

  /**
   * Fetches a list of the most popular anime.
   * @param {number} [page=1] - The page number for pagination (optional, defaults to 1).
   * @param {number} [perPage=20] - The number of results per page (optional, defaults to 20).
   * @param {Format} [format=Format.TV] - The anime format to filter by (optional, defaults to Format.TV).
   * @returns {Promise<AnilistMostPopular>} A promise that resolves to an object containing an array of popular anime.
   */
  async fetchMostPopular(page: number = 1, perPage: number = 20, format: Format = Format.TV): Promise<AnilistMostPopular> {
    return fetchPopular(page, perPage, format);
  }

  /**
   * Fetches a list of the top-rated anime.
   * @param {number} [page=1] - The page number for pagination (optional, defaults to 1).
   * @param {number} [perPage=20] - The number of results per page (optional, defaults to 20).
   * @param {Format} [format=Format.TV] - The anime format to filter by (optional, defaults to Format.TV).
   * @returns {Promise<AnilistTopRated>} A promise that resolves to an object containing an array of top-rated anime.
   */
  async fetchTopRatedAnime(page: number = 1, perPage: number = 20, format: Format = Format.TV): Promise<AnilistTopRated> {
    return fetchTopRated(page, perPage, format);
  }

  /**
   * Fetches seasonal anime for a given year and season.
   * @param {Seasons} season - The target season (e.g., WINTER, SPRING, SUMMER, FALL) (required).
   * @param {number} seasonYear - The target year (e.g., 2023, 2024) (required).
   * @param {Format} [format=Format.TV] - The anime format to filter by (optional, defaults to Format.TV).
   * @param {number} [page=1] - The page number for pagination (optional, defaults to 1).
   * @param {number} [perPage=20] - The number of results per page (optional, defaults to 20).
   * @returns {Promise<AnilistSeason>} A promise that resolves to an object containing an array of seasonal anime.
   */
  async fetchSeasonalAnime(
    season: Seasons,
    seasonYear: number,
    format: Format = Format.TV,
    page: number = 1,
    perPage: number = 20,
  ): Promise<AnilistSeason> {
    return fetchSeason(season, seasonYear, page, perPage, format);
  }

  /**
   * Fetches a list of currently trending anime.
   * @param {number} [page=1] - The page number for pagination (optional, defaults to 1).
   * @param {number} [perPage=20] - The number of results per page (optional, defaults to 20).
   * @returns {Promise<AnilistTrends>} A promise that resolves to an object containing an array of trending anime.
   */
  async fetchTrending(page: number = 1, perPage: number = 20): Promise<AnilistTrends> {
    return getTrends(page, perPage);
  }

  /**
   * Fetches a list of the most anticipated upcoming anime.
   * @param {number} [page=1] - The page number for pagination (optional, defaults to 1).
   * @param {number} [perPage=20] - The number of results per page (optional, defaults to 20).
   * @returns {Promise<AnilistUpcoming>} A promise that resolves to an object containing an array of upcoming anime.
   */
  async fetchTopUpcoming(page: number = 1, perPage: number = 20): Promise<AnilistUpcoming> {
    return fetchUpcoming(page, perPage);
  }

  /**
   * Fetches anime titles related to a specific anime ID, such as sequels, prequels, or spin-offs.
   * @param {number} id - The unique Anilist anime ID (required).
   * @returns {Promise<AnilistRelatedData>} A promise that resolves to an object containing an array of related anime information.
   */
  async fetchRelatedAnime(id: number): Promise<AnilistRelatedData> {
    return getRelated(id);
  }

  /**
   * Fetches characters associated with a specific anime.
   * @param {number} id - The unique Anilist anime ID (required).
   * @param {Charactersort} [sort=Charactersort.RELEVANCE] - The sorting method for characters (optional, defaults to Charactersort.RELEVANCE).
   * @param {Charactersort} [voiceActorsSort=Charactersort.RELEVANCE] - The sorting method for voice actors (optional, defaults to Charactersort.RELEVANCE).
   * @returns {Promise<AnilistCharacters>} A promise that resolves to an object containing an array of anime characters and their voice actors.
   */
  async fetchCharacters(
    id: number,
    sort: Charactersort = Charactersort.RELEVANCE,
    voiceActorsSort: Charactersort = Charactersort.RELEVANCE,
  ): Promise<AnilistCharacters> {
    return fetchAnimeCharacters(id, sort, voiceActorsSort);
  }

  /**
   * Fetches anime information along with provider-specific episode details using the Anilist ID.
   * This is used to get streamable episodes from a given provider.
   * @param {number} id - The unique Anilist ID of the anime (required).
   * @param {AnimeProvider} [provider=AnimeProvider.HiAnime] - The anime provider to fetch episodes from (optional, defaults to AnimeProvider.HiAnime).
   * @returns {Promise<AnilistEpisodes>} A promise that resolves to an object containing anime info and its episodes from the specified provider.
   */
  async fetchAnimeProviderEpisodes(id: number, provider: AnimeProvider = AnimeProvider.HiAnime): Promise<AnilistEpisodes> {
    return getAnimeProviderEpisodes(id, provider);
  }
}

export { Anilist };
