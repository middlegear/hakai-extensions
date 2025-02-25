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
  fetchAnimeProviderIdWithInfo,
  getEpisodeswithInfo,
  getTopUpcoming,
  type JIkanSearch,
  type JikanInfo,
  type JikanMatchedEpisodes,
  type JikanCharacters,
  type JikanTopAnime,
  type JikanSeason,
  type JikanEpisodes,
  type JikanEpisodeInfo,
  type JikanProviderId2,
} from './jikan.js';

class Jikan {
  /**
   * Searches for anime by query.
   * @param {string} query - The search query (Required).
   * @param {number} [page=1] - The page number.
   * @param {number} [limit=25] - Number of results per page.
 
   * @returns {Promise<JIkanSearch>} - The search results.
   */
  async search(query: string, page: number = 1, limit: number = 1): Promise<JIkanSearch> {
    return searchAnime(query, page, limit);
  }

  /**
   * Fetches anime details by MAL ID.
   * @param {number} id - The MAL ID (Required).
   * @returns {Promise<JikanInfo>} - The anime information.
   */
  async fetchInfo(id: number): Promise<JikanInfo> {
    return getInfoById(id);
  }

  /**
   * Fetches anime provider mappings for an anime.
   * @param {number} id - The MAL ID (Required).
   * @param {AnimeProvider} -Anime Provider(optinal). Default is Rakuzan anime
   * @returns { Promise<JikanProviderId2>} - The mapped providerId with anime details.
   */
  async fetchProviderAnimeId(id: number, provider: AnimeProvider = AnimeProvider.RakuzanAnime): Promise<JikanProviderId2> {
    return fetchAnimeProviderIdWithInfo(id, provider);
  }
  /**
   * Fetches anime provider episodes for an anime.
   * @param {number} id - The MAL ID (Required).
   * @returns { Promise<JikanMatchedEpisodes>} - The animeInfo with Episodes
   */
  async fetchRakuzanEpisodes(id: number): Promise<JikanMatchedEpisodes> {
    return getEpisodeswithInfo(id);
  }
  /**
   * Fetches characters for a given anime.
   * @param {number} id - The MAL ID (Required).
   * @returns {Promise<JikanCharacters>} - The anime characters.
   */
  async fetchAnimeCharacters(id: number): Promise<JikanCharacters> {
    return getAnimeCharacters(id);
  }

  /**
   * Fetches top anime based on filters.
   * @param {number} [page=1] - The page number. defaults to 1 Optional
   * @param {number} [limit=25] - Number of results per page.. defaults to 25 optional
   * @returns { Promise<JikanTopAnime>} - The top anime list.
   */
  async fetchTopUpcoming(page: number = 1, limit: number = 25, status: Status = Status.Upcoming): Promise<JikanTopAnime> {
    return getTopUpcoming(page, limit, status);
  }

  /**
   * Fetches top airing anime.
   * @param {number} [page=1] - The page number. defaults to 1 Optional
   * @param {number} [limit=25] - Number of results per page.. defaults to 25 optional
   * @returns { Promise<JikanTopAnime> } - The top airing list.
   */
  async fetchTopAiring(
    page: number = 1,
    limit: number = 25,
    filter: Status = Status.Airing,
    type: Format = Format.TV,
  ): Promise<JikanTopAnime> {
    return getTopAnime(page, limit, filter, type);
  }

  /**
   * Fetches top movies type category.
   * @param {number} [page=1] - The page number. defaults to 1 Optional
   * @param {number} [limit=25] - Number of results per page.. defaults to 25 optional.
   * @returns { Promise<JikanTopAnime> } - The top Movie category
   */
  async fetchTopMovies(
    page: number = 1,
    limit: number = 25,
    filter: Status = Status.Favourite,
    type: Format = Format.MOVIE,
  ): Promise<JikanTopAnime> {
    return getTopAnime(page, limit, filter, type);
  }
  /**
   * Fetches most popular anime category.
   * @param {number} [page=1] - The page number. defaults to 1 Optional
   * @param {number} [limit=25] - Number of results per page.. defaults to 25 optional
   * @returns {Promise<JikanTopAnime>} - The most popular anime resource
   */
  async fetchMostPopular(
    page: number = 1,
    limit: number = 25,
    filter: Status = Status.Popularity,
    type: Format = Format.TV,
  ): Promise<JikanTopAnime> {
    return getTopAnime(page, limit, filter, type);
  }
  /**
   * Fetches seasonal anime for a given year and season.
   * 
   * @param {number} year - The target year (Required).
   * @param {Season} season - The target season (winter, fall, etc.).
   * @param {number} [page=1] - The page number.
   * @param {number} [limit=25] - Number of results per page.
   * @param {Format} [Format = Format.TV] - The format type defaults to tv
  
   * @returns {Promise<JikanSeason> } - The seasonal anime list.
   */
  async fetchSeason(
    year: number,
    season: Seasons,
    page: number = 1,
    limit: number = 25,
    format: Format = Format.TV,
  ): Promise<JikanSeason> {
    return getSeason(year, season, format, page, limit);
  }

  /**
   * Fetches currently airing seasonal anime.
   *
   * @param {number} [page=1] - The page number.
   * @param {number} [limit=25] - Number of results per page.
   * @param {Format} [Format = Format.TV] - The format type defaults to tv
   * @returns {Promise<JikanSeason> } - The current seasonal anime.
   */
  async fetchCurrentSeason(page: number = 1, limit: number = 25, format: Format = Format.TV): Promise<JikanSeason> {
    return getCurrentSeason(page, limit, format);
  }

  /**
   * Fetches anime for the upcoming season.
   * @param {Format} [Format = Format.TV] - The format type defaults to tv
   * @param {number} [page=1] - The page number.
   * @param {number} [limit=25] - Number of results per page.
   * @returns {Promise<JikanSeason>} - The upcoming season's anime.
   */
  async fetchNextSeason(page: number = 1, limit: number = 25, format: Format = Format.TV): Promise<JikanSeason> {
    return getNextSeason(page, limit, format);
  }

  /**
   * Fetches episode list for a given anime.
   * @param {number} id - The MAL ID (Required).
   * @param {number} [page=1] - The page number.
   * @returns { Promise<JikanEpisodes>} - The anime episodes.
   */
  async fetchMalEpisodes(id: number, page: number = 1): Promise<JikanEpisodes> {
    return getEpisodes(id, page);
  }

  /**
   * Fetches detailed information about a specific episode.
   * @param {number} id - The MAL ID (Required).
   * @param {number} episodeNumber - The episode number (Required).
   * @returns {Promise<JikanEpisodeInfo>} - The episode details.
   */
  async fetchMalEpisodeInfo(id: number, episodeNumber: number): Promise<JikanEpisodeInfo> {
    return getEpisodeInfo(id, episodeNumber);
  }
}

export { Jikan };
