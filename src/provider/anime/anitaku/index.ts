import {
  fetchAnimeInfo,
  fetchEpisodeSources,
  fetchServers,
  searchAnime,
} from './anitaku.js';

import { anitakuServers } from './types.js';
/**
 *  @deprecated This provider has been deprecated will be removed later
 */
class Anitaku {
  /**
   * searches for anime based on query
   * @param query  search query string
   * @param page number (optional defaults to  1)
   * @returns an array of anime
   */
  async search(query: string, page: number = 1) {
    return searchAnime(query, page);
  }

  /**
   *
   * @param animeId string
   * @returns animeinfo with episodes
   */
  async fetchInfo(animeId: string) {
    return fetchAnimeInfo(animeId);
  }
  /**
   *
   * @param episodeId string
   * @returns  available servers
   */
  async fetchSevers(episodeId: string) {
    return fetchServers(episodeId);
  }
  /**
   *
   * @param episodeId string
   * @param server default is Gogo server (optional)
   *
   * @returns streaming sources with a downloadURL
   */
  async fetchSources(
    episodeId: string,
    server: anitakuServers = anitakuServers.MP4Upload
  ) {
    return fetchEpisodeSources(episodeId, server);
  }
}

export { Anitaku };
