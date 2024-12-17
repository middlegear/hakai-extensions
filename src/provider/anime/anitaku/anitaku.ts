import { searchAnime } from "./animeSearch";
import { fetchAnimeInfo } from "./fetchAnimeInfo";
import { fetchEpisodeSources } from "./fetchEpisodeSources";
import { fetchServers } from "./fetchServers";
import { anitakuServers } from "./types";

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
   * @param server default is vidsteaming (optional)
   *
   * @returns streaming sources with a downloadURL
   */
  async fetchSources(
    episodeId: string,
    server: anitakuServers = anitakuServers.MP4Upload
    // downloadLink?: string
  ) {
    return fetchEpisodeSources(episodeId, server);
  }
}

export { Anitaku };
