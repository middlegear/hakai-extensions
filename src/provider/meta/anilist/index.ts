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
   * @param {string} search - The search query string (Required).
   * @param {number} [page=1] - Page number for pagination (Optional, defaults to 1).
   * @param {number} [perPage=20] - Number of results per page (Optional, defaults to 20).
   * @returns {Promise<AnilistSearch>} - An array of anime related to the search query.
   */
  async search(search: string, page: number = 1, perPage: number = 20): Promise<AnilistSearch> {
    return searchAnime(search, page, perPage);
  }

  /**
   * Fetches detailed information about an anime.
   * @param {number} id - The Anilist anime ID (Required).
   * @returns { Promise<AnilistInfo>} - An object containing detailed anime information.
   */
  async fetchInfo(id: number): Promise<AnilistInfo> {
    return fetchAnimeById(id);
  }

  /**
   * Fetches anime information returning a provider animeId.
   * @param {number} id - The Anilist anime ID (Required)
   * @param {AnimeProvider} provider - AnimeProvider enum (optional). Default is AnimeProvider.HiAnime
   * @returns { Promise<AnilistProviderId>} - An object containing provider animeId and anime info.
   */
  async fetchProviderAnimeId(id: number, provider: AnimeProvider = AnimeProvider.HiAnime): Promise<AnilistProviderId> {
    return fetchAnimeProviderIdWithInfo(id, provider);
  }

  /**
   * Fetches top airing anime.
   * @param {number} [page=1] - Page number for pagination (Optional, defaults to 1).
   * @param {number} [perPage=20] - Number of results per page (Optional, defaults to 20).
   * @returns { Promise<AnilistTopAiring> } - An array of top-airing anime.
   */
  async fetchAiring(page: number = 1, perPage: number = 20): Promise<AnilistTopAiring> {
    return fetchTopAiring(page, perPage);
  }

  /**
   * Fetches the most popular anime.
   * @param {number} [page=1] - Page number for pagination (Optional, defaults to 1).
   * @param {number} [perPage=20] - Number of results per page (Optional, defaults to 20).
   * @param {Format} [format=Format.TV] - Anime format (Optional, defaults to TV).
   * @returns { Promise<AnilistMostPopular>} - An array of popular anime.
   */
  async fetchMostPopular(page: number = 1, perPage: number = 20, format: Format = Format.TV): Promise<AnilistMostPopular> {
    return fetchPopular(page, perPage, format);
  }

  /**
   * Fetches top-rated anime.
   * @param {number} [page=1] - Page number for pagination (Optional, defaults to 1).
   * @param {number} [perPage=20] - Number of results per page (Optional, defaults to 20).
   * @param {Format} [format=Format.TV] - Anime format (Optional, defaults to TV)..
   * @returns { Promise<AnilistTopRated>} - An array of top-rated anime.
   */
  async fetchTopRatedAnime(page: number = 1, perPage: number = 20, format: Format = Format.TV): Promise<AnilistTopRated> {
    return fetchTopRated(page, perPage, format);
  }

  /**
   * Fetches seasonal anime.
   * @param {Seasons} season - The season (WINTER, SPRING, SUMMER, FALL) (Required).
   * @param {number} seasonYear - The year of the season (Required).
   * @param {number} [page=1] - Page number for pagination (Optional, defaults to 1).
   * @param {number} [perPage=20] - Number of results per page (Optional, defaults to 20).
   * @param {Format} [format=Format.TV] - Anime format (Optional, defaults to TV).
   * @param {Sort} [sort=Sort.POPULARITY_DESC] - Sorting order (Optional, defaults to Popularity Descending).
   * @returns { Promise<AnilistSeason>} - An array of seasonal anime.
   */
  async fetchSeasonalAnime(
    season: Seasons,
    seasonYear: number,
    page: number = 1,
    perPage: number = 20,
    format: Format = Format.TV,
  ): Promise<AnilistSeason> {
    return fetchSeason(season, seasonYear, page, perPage, format);
  }
  /**
   * Fetch trending anime
   * @param {number} [page=1] - Page number for pagination (Optional, defaults to 1).
   * @param {number} [perPage=20] - Number of results per page (Optional, defaults to 20).
   * @returns {Promise<AnilistTrends>} - An array of trendingAnime
   */
  async fetchTrending(page: number = 1, perPage: number = 20): Promise<AnilistTrends> {
    return getTrends(page, perPage);
  }
  /**
   * Fetch upcoming anime
   * @param {number} [page=1] - Page number for pagination (Optional, defaults to 1).
   * @param {number} [perPage=20] - Number of results per page (Optional, defaults to 20).
   * @returns { Promise<AnilistUpcoming>} - An array of  upcoming anime resource
   */
  async fetchTopUpcoming(page: number = 1, perPage: number = 20): Promise<AnilistUpcoming> {
    return fetchUpcoming(page, perPage);
  }
  /**
   * Fetches related information about an anime.
   * @param {number} id - The Anilist anime ID (Required).
   * @returns { Promise<AnilistRelatedData>} - An array containing related anime information.
   */
  async fetchRelatedAnime(id: number): Promise<AnilistRelatedData> {
    return getRelated(id);
  }
  /**
   * Fetches characters from an anime.
   * @param {number} Id - The Anilist anime ID (Required).
   * @returns {Promise<AnilistCharacters>} - An array of anime characters.
   */
  async fetchCharacters(
    Id: number,
    sort: Charactersort = Charactersort.RELEVANCE,
    voiceActorsSort2: Charactersort = Charactersort.RELEVANCE,
  ): Promise<AnilistCharacters> {
    return fetchAnimeCharacters(Id, sort, voiceActorsSort2);
  }
  /**
   * Fetches animeInfo with Provider episodes using AnilistId
    
   * @param {number} id - The AnilistId (Required).
   * @param {AnimeProvider} provider - AnimeProvider enum (optional). Default is AnimeProvider.HiAnime
   * @returns {Promise<AnilistEpisodes>} - An object of animeInfo with episodes
   */
  async fetchAnimeProviderEpisodes(id: number, provider: AnimeProvider = AnimeProvider.HiAnime): Promise<AnilistEpisodes> {
    return getAnimeProviderEpisodes(id, provider);
  }
}

export { Anilist };
