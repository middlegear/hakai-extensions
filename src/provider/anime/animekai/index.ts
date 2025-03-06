import { SubOrDub } from '../../../types/types';
import {
  type SearchResponse,
  searchanime,
  type AnimeInfoKai,
  getAnimeInfo,
  type ServerInfoResponse,
  getEpisodeServers,
  type SourceResponse,
  getEpisodeSources,
} from './animekai';

class AnimeKai {
  /**
   * Searches for anime based on the provided query.
   * @param {string} query - The search query string (required).
   * @param {number} [page=1] - The page number for pagination (optional, defaults to 1).
   * @returns {Promise<SearchResponse>} - An array of anime related to the search query.
   */
  async search(query: string, page: number = 1): Promise<SearchResponse> {
    return searchanime(query, page);
  }

  /**
   * Fetches detailed information about a specific anime, including episode data.
   * @param {string} animeId - The unique identifier for the anime (required).
   * @returns {Promise<AnimeInfoKai>} - An object containing anime details and episode information.
   */
  async fetchAnimeInfo(animeId: string): Promise<AnimeInfoKai> {
    return getAnimeInfo(animeId);
  }

  /**
   * Fetches available server information for a specific episode.
   * @param {string} episodeId - The unique identifier for the episode (required).
   * @param {SubOrDub} [category=SubOrDub.SUB] - The category (SubOrDub ) (optional, defaults to SubOrDub.SUB).
   * @returns {Promise<ServerInfoResponse>} - An array containing server information.
   */
  async fetchServers(episodeId: string, category: SubOrDub = SubOrDub.SUB): Promise<ServerInfoResponse> {
    return getEpisodeServers(episodeId, category);
  }

  /**
   * Fetches available episode source information for a specific episode.
   * @param {string} episodeId - The unique identifier for the episode (required).
   * @param {SubOrDub} [category=SubOrDub.SUB] - The category (SubOrDub ) (optional, defaults to SubOrDub.SUB).
   * @returns {Promise<SourceResponse>} - An object containing source information.
   */
  async fetchSources(episodeId: string, category: SubOrDub = SubOrDub.SUB): Promise<SourceResponse> {
    return getEpisodeSources(episodeId, category);
  }
}

export { AnimeKai };
