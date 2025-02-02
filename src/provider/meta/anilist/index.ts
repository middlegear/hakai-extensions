import { getProviderId } from '../jikan/providers';
import {
  fetchAnimeById,
  fetchAnimeCharacters,
  fetchPopular,
  fetchSeason,
  fetchTopAiring,
  fetchTopRated,
  searchAnime,
} from './anilist';

import {
  Charactersort,
  Format,
  MediaType,
  Seasons,
  Sort,
  Status,
} from './types';

class Anilist {
  /**
     * 
     * @param search search query string. Required
     * @param page  number default = 1 (optional)
     * @param perPage sets the limit per page default = 20 (optional)
     
     * @returns search results for anime
     */
  async search(
    search: string,
    page: number = 1,
    perPage: number = 20,
    type: MediaType = MediaType.Anime,
    isAdult: boolean = false
  ) {
    return searchAnime(search, page, perPage, type, isAdult);
  }
  /**
   *
   * @param id number  AnilistId . Required
   * @returns anime resource
   */
  async fetchInfo(id: number) {
    return fetchAnimeById(id);
  }
  /**
   *
   * @param id number AnilistId . Required
   * @returns anime resource mapped to providers
   */
  async fetchMapping(id: number) {
    return getProviderId(id);
  }
  /**
 * 
 * @param page  number default = 1 (optional)
 * @param perPage sets the limit per page default = 20 (optional)

 * @param format Enum: TV, TV_SHORT, MOVIE , SPECIAL, OVA , ONA, MUSIC, MANGA, NOVEL, ONE_SHOT. Available Anime formats. Default = TV (Optional)

 * @returns Airing anime resource
 */
  async fetchAiring(
    page: number = 1,
    perPage: number = 20,
    type: MediaType = MediaType.Anime,
    format: Format = Format.TV,
    isAdult: boolean = false,
    status: Status = Status.RELEASING,
    sort: Sort = Sort.SCORE_DESC
  ) {
    return fetchTopAiring(page, perPage, type, format, status, isAdult, sort);
  }
  /**
   *
   * @param page number default = 1 (optional)
   * @param perPage sets the limit per page default = 20 (optional)
   * @param format Enum: TV, TV_SHORT, MOVIE , SPECIAL, OVA , ONA, MUSIC, MANGA, NOVEL, ONE_SHOT. Available Anime formats.Default = TV (Optional)
   *
   * @returns Most Popular anime resource
   */
  async fetchMostPopular(
    page: number = 1,
    perPage: number = 20,
    type: MediaType = MediaType.Anime,
    format: Format = Format.TV,
    isAdult: boolean = false,
    sort: Sort = Sort.POPULARITY_DESC
  ) {
    return fetchPopular(page, perPage, type, format, isAdult, sort);
  }
  /**
   * 
   * @param page number default = 1 (optional)
   * @param perPage sets the limit per page default = 20 (optional)
   * @param  @param format Enum: TV, TV_SHORT, MOVIE , SPECIAL, OVA , ONA, MUSIC, MANGA, NOVEL, ONE_SHOT. Available Anime formats. Default = TV (Optional)
  
 
   * @returns top rated anime resource
   */
  async fetchTop(
    page: number = 1,
    perPage: number = 25,
    type: MediaType = MediaType.Anime,
    format: Format = Format.TV,
    isAdult: boolean = false,
    sort: Sort = Sort.SCORE_DESC
  ) {
    return fetchTopRated(page, perPage, isAdult, type, sort, format);
  }

  /**
   * 
   * @param page number default = 1 (optional)
   * @param perPage sets the limit per page default = 20 (optional)

   * @param format Enum: TV, TV_SHORT, MOVIE , SPECIAL, OVA , ONA, MUSIC, MANGA, NOVEL, ONE_SHOT. Available Anime formats. Default = TV (Optional)

   * @param season Enum WINTER, SPRING, SUMMER, FALL. Required. Availabe anime seasons
   * @param seasonYear number .Required
   * 
   * @returns Seasonal anime resource
   */
  async fetchSeasonalAnime(
    page: number = 1,
    perPage: number = 20,
    type: MediaType = MediaType.Anime,
    format: Format = Format.TV,
    isAdult: boolean = false,
    season: Seasons,
    seasonYear: number,
    sort: Sort = Sort.POPULARITY_DESC
  ) {
    return fetchSeason(
      page,
      perPage,
      type,
      format,
      isAdult,
      season,
      seasonYear,
      sort
    );
  }
  /**
   *
   * @param mediaId number. Anilist animeId. Required
   *
   * @returns Anime character resoource
   */
  async fetchCharacters(
    mediaId: number,
    sort: Charactersort = Charactersort.RELEVANCE,
    voiceActorsSort2: Charactersort = Charactersort.RELEVANCE
  ) {
    return fetchAnimeCharacters(mediaId, sort, voiceActorsSort2);
  }
}
export { Anilist };
