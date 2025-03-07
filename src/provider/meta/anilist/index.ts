import { AnimeProvider, Charactersort, Format, Seasons } from '../../../types/types.js';
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
  type AnilistSearch,
  type AnilistInfo,
  type AnilistUpcoming,
  type AnilistTopAiring,
  type AnilistMostPopular,
  type AnilistTopRated,
  type AnilistSeason,
  type AnilistTrends,
  type AnilistRelatedData,
  type AnilistCharacters,
  type AnilistEpisodes,
  type AnilistProviderId,
} from './anilist.js';

class Anilist {
  /**
   * Searches for anime based on the provided query.
   * @param {string} search - The search query string (required).
   * @param {number} [page=1] - Page number for pagination (optional, defaults to 1).
   * @param {number} [perPage=20] - Number of results per page (optional, defaults to 20).
   * @returns {Promise<AnilistSearch>} - An array of anime related to the search query.
   */
  async search(search: string, page: number = 1, perPage: number = 20): Promise<AnilistSearch> {
    return searchAnime(search, page, perPage);
  }

  /**
   * Fetches detailed information about an anime.
   * @param {number} id - The Anilist anime ID (required).
   * @returns {Promise<AnilistInfo>} - An object containing detailed anime information.
   */
  async fetchInfo(id: number): Promise<AnilistInfo> {
    return fetchAnimeById(id);
  }

  /**
   * Fetches anime information along with a provider-specific anime ID.
   * @param {number} id - The Anilist anime ID (required).
   * @param {AnimeProvider} [provider=AnimeProvider.HiAnime] - The anime provider (optional, defaults to AnimeProvider.HiAnime or 'hianime').
   * @returns {Promise<AnilistProviderId>} - An object containing the provider anime ID and anime info.
   */
  async fetchProviderAnimeId(id: number, provider: AnimeProvider = AnimeProvider.HiAnime): Promise<AnilistProviderId> {
    return fetchAnimeProviderIdWithInfo(id, provider);
  }

  /**
   * Fetches the top airing anime.
   * @param {number} [page=1] - Page number for pagination (optional, defaults to 1).
   * @param {number} [perPage=20] - Number of results per page (optional, defaults to 20).
   * @returns {Promise<AnilistTopAiring>} - An array of top-airing anime.
   */
  async fetchAiring(page: number = 1, perPage: number = 20): Promise<AnilistTopAiring> {
    return fetchTopAiring(page, perPage);
  }

  /**
   * Fetches the most popular anime.
   * @param {number} [page=1] - Page number for pagination (optional, defaults to 1).
   * @param {number} [perPage=20] - Number of results per page (optional, defaults to 20).
   * @param {Format} [format=Format.TV] - The anime format (optional, defaults to Format.TV).
   * @returns {Promise<AnilistMostPopular>} - An array of popular anime.
   */
  async fetchMostPopular(page: number = 1, perPage: number = 20, format: Format = Format.TV): Promise<AnilistMostPopular> {
    return fetchPopular(page, perPage, format);
  }

  /**
   * Fetches the top-rated anime.
   * @param {number} [page=1] - Page number for pagination (optional, defaults to 1).
   * @param {number} [perPage=20] - Number of results per page (optional, defaults to 20).
   * @param {Format} [format=Format.TV] - The anime format (optional, defaults to Format.TV).
   * @returns {Promise<AnilistTopRated>} - An array of top-rated anime.
   */
  async fetchTopRatedAnime(page: number = 1, perPage: number = 20, format: Format = Format.TV): Promise<AnilistTopRated> {
    return fetchTopRated(page, perPage, format);
  }

  /**
   * Fetches seasonal anime for a given year and season.
   * @param {Seasons} season - The target season (e.g., WINTER, SPRING, SUMMER, FALL) (required).
   * @param {number} seasonYear - The target year (required).
   * @param {Format} [format=Format.TV] - The anime format (optional, defaults to Format.TV).
   * @param {number} [page=1] - Page number for pagination (optional, defaults to 1).
   * @param {number} [perPage=20] - Number of results per page (optional, defaults to 20).
   
   * @returns {Promise<AnilistSeason>} - An array of seasonal anime.
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
   * Fetches trending anime.
   * @param {number} [page=1] - Page number for pagination (optional, defaults to 1).
   * @param {number} [perPage=20] - Number of results per page (optional, defaults to 20).
   * @returns {Promise<AnilistTrends>} - An array of trending anime.
   */
  async fetchTrending(page: number = 1, perPage: number = 20): Promise<AnilistTrends> {
    return getTrends(page, perPage);
  }

  /**
   * Fetches the most anticipated upcoming anime.
   * @param {number} [page=1] - Page number for pagination (optional, defaults to 1).
   * @param {number} [perPage=20] - Number of results per page (optional, defaults to 20).
   * @returns {Promise<AnilistUpcoming>} - An array of upcoming anime.
   */
  async fetchTopUpcoming(page: number = 1, perPage: number = 20): Promise<AnilistUpcoming> {
    return fetchUpcoming(page, perPage);
  }

  /**
   * Fetches related information about an anime.
   * @param {number} id - The Anilist anime ID (required).
   * @returns {Promise<AnilistRelatedData>} - An array containing related anime information.
   */
  async fetchRelatedAnime(id: number): Promise<AnilistRelatedData> {
    return getRelated(id);
  }

  /**
   * Fetches characters from an anime.
   * @param {number} id - The Anilist anime ID (required).
   * @param {Charactersort} [sort=Charactersort.RELEVANCE] - The sorting method for characters (optional, defaults to Charactersort.RELEVANCE).
   * @param {Charactersort} [voiceActorsSort=Charactersort.RELEVANCE] - The sorting method for voice actors (optional, defaults to Charactersort.RELEVANCE).
   * @returns {Promise<AnilistCharacters>} - An array of anime characters.
   */
  async fetchCharacters(
    id: number,
    sort: Charactersort = Charactersort.RELEVANCE,
    voiceActorsSort: Charactersort = Charactersort.RELEVANCE,
  ): Promise<AnilistCharacters> {
    return fetchAnimeCharacters(id, sort, voiceActorsSort);
  }

  /**
   * Fetches anime information along with provider-specific episodes using the Anilist ID.
   * @param {number} id - The Anilist ID (required).
   * @param {AnimeProvider} [provider=AnimeProvider.HiAnime] - The anime provider (optional, defaults to AnimeProvider.HiAnime or 'hianime').
   * @returns {Promise<AnilistEpisodes>} - An object containing anime info with episodes.
   */
  async fetchAnimeProviderEpisodes(id: number, provider: AnimeProvider = AnimeProvider.HiAnime): Promise<AnilistEpisodes> {
    return getAnimeProviderEpisodes(id, provider);
  }
}

export { Anilist };
