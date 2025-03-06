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
  type SourceResponse,
} from './hianime.js';
import { HiAnimeServers } from './types.js';

class HiAnime {
  /**
   * Searches for anime based on the provided query.
   * @param {string} query - The search query string. Required.
   * @param {number} [page=1] - The page number for pagination (optional, defaults to 1).
   * @returns {Promise<SearchResponse>}- An array of anime related to the search query.
   */
  async search(query: string, page: number = 1): Promise<SearchResponse> {
    return searchAnime(query, page);
  }
  /**
   * Fetches detailed information about a specific anime
   * @param {string} animeId - The unique identifier for the anime.
   * @returns {Promise<ZoroAnimeInfo>} - An object containing anime details
   */
  async fetchInfo(animeId: string): Promise<ZoroAnimeInfo> {
    return fetchAnimeInfo(animeId);
  }
  /**
   * Fetches detailed information about a specific anime episode data.
   * @param {string} animeId - The unique identifier for the anime.
   * @returns {Promise<EpisodeInfoRes>} - An object containing  episode information.
   */
  async fetchEpisodes(animeId: string): Promise<EpisodeInfoRes> {
    return getEpisodes(animeId);
  }
  /**
   * Fetches available server infomation about the episode
   * @param {string} episodeId - The unique identifier for the episode
   * @returns {Promise<ServerInfoResponse>}- An object containing server information
   */
  async fetchEpisodeServers(episodeId: string): Promise<ServerInfoResponse> {
    return fetchServers(episodeId);
  }
  /**
   * Fetches streaming sources for a given anime episode.
   * @param {string} episodeId - The unique identifier for the episode. Required.
   * @param {servers} [server=HiAnimeServers.HD1] - The server(HiAnimeServers enum) to use (optional, defaults to HD1).
   * @param {category} [category = SubOrDub.SUB,] - The category(SubOrDub enum) (optional, defaults to subbed).
   * @returns {Promise<SourceResponse>} - An object containing streaming sources.
   */
  async fetchSources(
    episodeId: string,
    server: HiAnimeServers = HiAnimeServers.HD1,
    category: SubOrDub = SubOrDub.SUB,
  ): Promise<SourceResponse> {
    return fetchEpisodeSources(episodeId, server, category);
  }
}
export { HiAnime };
