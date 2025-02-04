import {
  fetchAnimeInfo,
  fetchEpisodeSources,
  fetchServers,
  searchAnime,
} from './hiAnime.js';
import { Dubbing, Servers } from './types.js';

class HiAnime {
  /**
   *
   *
   * @param query search query string
   * @param page  defaults to 1 number (optional)
   * Searches for anime based on the query
   *
   */
  async search(query: string, page: number = 1) {
    return searchAnime(query, page);
  }
  /**
   *
   *
   * @param  animeId string
   * @returns animeInfo with episodes
   */
  async fetchInfo(animeId: string) {
    return fetchAnimeInfo(animeId);
  }
  /**
   *
   * @param episodeId unique id string
   * @returns available servers
   */
  async fetchEpisodeServers(episodeId: string) {
    return fetchServers(episodeId);
  }
  /**
   *
   * @requires episodeId   unique id string
   * @param server (optional) default is HD-1
   * @param dub (optional) default is sub
   *@returns streaming sources
   */
  async fetchSources(
    episodeId: string,
    server: Servers = Servers.HD1,
    dub: Dubbing = Dubbing.Sub
  ) {
    return fetchEpisodeSources(episodeId, server, dub);
  }
}
export { HiAnime };
