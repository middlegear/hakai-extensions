import { AnimeProvider } from '../../../types/types.js';
import {
  searchAnime,
  fetchAnimeById,
  fetchProviderId,
  fetchTopAiring,
  fetchPopular,
  fetchTopRated,
  fetchSeason,
  fetchAnimeCharacters,
  getEpisodeswithInfo,
} from './anilist.js';
import { Format, Seasons, Charactersort } from './types.js';

class Anilist {
  /**
   * Searches for anime based on the provided query.
   * @param {string} search - The search query string (Required).
   * @param {number} [page=1] - Page number for pagination (Optional, defaults to 1).
   * @param {number} [perPage=20] - Number of results per page (Optional, defaults to 20).
   * @returns {Promise<Array>} - An array of anime related to the search query.
   */
  async search(search: string, page: number = 1, perPage: number = 20) {
    return searchAnime(search, page, perPage);
  }

  /**
   * Fetches detailed information about an anime.
   * @param {number} id - The Anilist anime ID (Required).
   * @returns {Promise<Object>} - An object containing detailed anime information.
   */
  async fetchInfo(id: number) {
    return fetchAnimeById(id);
  }

  /**
   * Fetches anime information by provider ID.
   * @param {number} id - The Anilist anime ID (Required).
   * @returns {Promise<Object>} - An object containing provider IDs and anime info.
   */
  async fetchMapping(id: number) {
    return fetchProviderId(id);
  }

  /**
   * Fetches top airing anime.
   * @param {number} [page=1] - Page number for pagination (Optional, defaults to 1).
   * @param {number} [perPage=20] - Number of results per page (Optional, defaults to 20).
   * @returns {Promise<Array>} - An array of top-airing anime.
   */
  async fetchAiring(page: number = 1, perPage: number = 20) {
    return fetchTopAiring(page, perPage);
  }

  /**
   * Fetches the most popular anime.
   * @param {number} [page=1] - Page number for pagination (Optional, defaults to 1).
   * @param {number} [perPage=20] - Number of results per page (Optional, defaults to 20).
   * @param {Format} [format=Format.TV] - Anime format (Optional, defaults to TV).
   * @returns {Promise<Array>} - An array of popular anime.
   */
  async fetchMostPopular(page: number = 1, perPage: number = 20, format: Format = Format.TV) {
    return fetchPopular(page, perPage, format);
  }

  /**
   * Fetches top-rated anime.
   * @param {number} [page=1] - Page number for pagination (Optional, defaults to 1).
   * @param {number} [perPage=20] - Number of results per page (Optional, defaults to 20).
   * @param {Format} [format=Format.TV] - Anime format (Optional, defaults to TV)..
   * @returns {Promise<Array>} - An array of top-rated anime.
   */
  async fetchTopRatedAnime(page: number = 1, perPage: number = 20, format: Format = Format.TV) {
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
   * @returns {Promise<Array>} - An array of seasonal anime.
   */
  async fetchSeasonalAnime(
    season: Seasons,
    seasonYear: number,
    page: number = 1,
    perPage: number = 20,
    format: Format = Format.TV,
  ) {
    return fetchSeason(season, seasonYear, page, perPage, format);
  }

  /**
   * Fetches characters from an anime.
   * @param {number} Id - The Anilist anime ID (Required).
   * @param {Charactersort} [sort=Charactersort.RELEVANCE] - Sorting order for characters (Optional, defaults to Relevance).
   * @param {Charactersort} [voiceActorsSort2=Charactersort.RELEVANCE] - Sorting order for voice actors (Optional, defaults to Relevance).
   * @returns {Promise<Array>} - An array of anime characters.
   */
  async fetchCharacters(
    Id: number,
    sort: Charactersort = Charactersort.RELEVANCE,
    voiceActorsSort2: Charactersort = Charactersort.RELEVANCE,
  ) {
    return fetchAnimeCharacters(Id, sort, voiceActorsSort2);
  }
  /**
   * Fetches animeInfo with Provider episodes using AnilistId
   * @param {number} Id - The Anilist anime ID (Required).
   * @param {AnimeProvider} [provider] - AnimeProvider (Optional, defaults to HiAnime)
   * @returns {Promise<Object>} -An object of animeInfo with episodes
   */
  async fetchEpisodes(id: number, provider: AnimeProvider = AnimeProvider.HiAnime) {
    return getEpisodeswithInfo(id, provider);
  }
}

export { Anilist };
