import {
  getAnimeCharacters,
  getCurrentSeason,
  getInfoById,
  getNextSeason,
  getSeason,
  getTopAnime,
  searchAnime,
} from "./jikan";
import { type AnimeStatusFilter, Filters, Season, AnimeType } from "./types";
import { getProviderId } from "./providers";
class Jikan {
  /**
   *
   * @param query search query string. Required
   * @param page number default = 1 (optional)
   * @param limit sets the limit per page default is 25 (optional)
   * @param type  Enum: "tv" "movie" "ova" "special" "ona" "music" "cm" "pv" "tv_special". Available Anime types
   * @returns search results for anime
   */
  async search(
    query: string,
    page: number,
    limit: number = 25,
    type: AnimeType = AnimeType.TV
  ) {
    return searchAnime(query, page, limit, type);
  }

  /**
   *
   * @param id number. Required
   * @returns anime resource
   */
  async fetchInfo(id: number) {
    return getInfoById(id);
  }
  /**
   *
   * @param id number MAL animeId.  Required
   * @returns anime resource mapped to providers
   */
  async fetchMapping(id: number) {
    return getProviderId(id);
  }

  /**
   *
   * @param id number.  Required
   * @returns anime characters resource
   */

  async fetchAnimeCharacters(id: number) {
    return getAnimeCharacters(id);
  }

  /**
   *
   * @param filter Enum: "airing" "upcoming" "bypopularity" "favorite". Top items filter types
   * @param type Enum: "tv" "movie" "ova" "special" "ona" "music" "cm" "pv" "tv_special" default = 'tv'. Available Anime types. Default ='tv' (optional)
   * @param page number default = 1 (optional)
   * @param limit number default = 25 (optional)
   * @returns Top anime
   */
  async fetchTopAnime(
    filter: AnimeStatusFilter,
    type: AnimeType = AnimeType.TV,
    page: number = 1,
    limit: number = 25
  ) {
    return getTopAnime(filter, type, page, limit);
  }

  /**
   *
   * @param year number. Required
   * @param season Enum: "winter", "fall","spring","summer" available season types. Required!
   * @param filter Enum: "airing" "upcoming" "bypopularity" "favorite". Top items filter types. Default ='tv' (optional)
   * @returns seasonal anime
   */
  async fetchSeason(
    year: number,
    season: Season,
    filter: Filters = Filters.TV
  ) {
    return getSeason(year, season, filter);
  }
  /**
   *
   * @param filter Enum: "airing" "upcoming" "bypopularity" "favorite". Top items filter types. Default ='tv' (optional)
   * @param page number default = 1 (optional)
   * @param limit number default = 25 (optional)
   * @returns current seasonal anime
   */
  async fetchCurrentSeason(
    filter: Filters.TV,
    page: number = 1,
    limit: number = 25
  ) {
    return getCurrentSeason(filter, page, limit);
  }

  /**
   *
   * @param filter Enum: "airing" "upcoming" "bypopularity" "favorite". Top items filter types. Default ='tv' (optional)
   * @param page number default = 1 (optional)
   * @param limit number default = 25 (optional)
   * @returns next season's anime
   */
  async fetchNextSeason(
    filter: Filters.TV,
    page: number = 1,
    limit: number = 25
  ) {
    return getNextSeason(filter, page, limit);
  }
}

export { Jikan };
