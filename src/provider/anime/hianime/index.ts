import { SubOrDub } from '../../index.js';
import {
  fetchAnimeInfo,
  fetchEpisodeSources,
  fetchServers,
  getEpisodes,
  searchAnime,
  type ZoroAnimeInfo,
  type SearchResponse,
  type EpisodeInfoRes,
  type ServerInfoResponse,
  HianimeSourceResponse,
} from './hianime.js';
import { HiAnimeServers } from './types.js';

class HiAnime {
  /**
   * Searches for anime based on the provided query.
   * @param {string} query - The search query string (required).
   * @param {number} [page=1] - The page number for pagination (optional, defaults to 1).
   * @returns {Promise<SearchResponse>} - An array of anime related to the search query.
   */
  async search(query: string, page: number = 1): Promise<SearchResponse> {
    return searchAnime(query, page);
  }

  /**
   * Fetches detailed information about a specific anime.
   * @param {string} animeId - The unique identifier for the anime (required).
   * @returns {Promise<ZoroAnimeInfo>} - An object containing anime details.
   */
  async fetchInfo(animeId: string): Promise<ZoroAnimeInfo> {
    return fetchAnimeInfo(animeId);
  }

  /**
   * Fetches detailed information about a specific anime's episode data.
   * @param {string} animeId - The unique identifier for the anime (required).
   * @returns {Promise<EpisodeInfoRes>} - An object containing episode information.
   */
  async fetchEpisodes(animeId: string): Promise<EpisodeInfoRes> {
    return getEpisodes(animeId);
  }

  /**
   * Fetches available server information for a specific episode.
   * @param {string} episodeId - The unique identifier for the episode (required).
   * @returns {Promise<ServerInfoResponse>} - An object containing server information.
   */
  async fetchEpisodeServers(episodeId: string): Promise<ServerInfoResponse> {
    return fetchServers(episodeId);
  }

  /**
   * Fetches streaming sources for a given anime episode.
   * @param {string} episodeId - The unique identifier for the episode (required).
   * @param {HiAnimeServers} [server=HiAnimeServers.HD2] - The server to use (optional, defaults to HiAnimeServers.HD2).HD1 is Cors protected (Error 403). Use a proxy or switch to HD-2
   * @param {SubOrDub} [category=SubOrDub.SUB] - The category (SubOrDub) (optional, defaults to SubOrDub.SUB).
   * @returns {Promise<SourceResponse>} - An object containing streaming sources.
   */
  async fetchSources(
    episodeId: string,
    server: HiAnimeServers = HiAnimeServers.HD2,
    category: SubOrDub = SubOrDub.SUB,
  ): Promise<HianimeSourceResponse> {
    return fetchEpisodeSources(episodeId, server, category);
  }
}

export { HiAnime };
