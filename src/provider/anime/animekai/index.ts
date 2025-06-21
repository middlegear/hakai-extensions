import { searchanime, getAnimeInfo, getEpisodeServers, getEpisodeSources } from './animekai';
import type { SearchResponse, AnimeInfoKai, ServerInfoResponse, SourceResponse } from './animekai';
import { SubOrDub } from '../../../types/types';

/**
 * A class for interacting with the AnimeKai Provider.
 *
 * **⚠️ WARNING: This class is currently broken and non-functional. It may be removed in future updates.**
 *
 * It aims to search for anime, fetch detailed information, retrieve available streaming servers,
 * and obtain direct episode sources.
 */
class AnimeKai {
  /**
   * Searches for anime titles based on the provided query string.
   * @param {string} query - The search query string (required).
   * @param {number} [page=1] - The page number for pagination (optional, defaults to 1).
   * @returns {Promise<SearchResponse>} A promise that resolves to an object containing an array of anime results related to the search query.
   */
  async search(query: string, page: number = 1): Promise<SearchResponse> {
    return searchanime(query, page);
  }

  /**
   * Fetches detailed information about a specific anime, including its episode data.
   * @param {string} animeId - The unique identifier for the anime (required).
   * @returns {Promise<AnimeInfoKai>} A promise that resolves to an object containing comprehensive anime details and episode information.
   */
  async fetchAnimeInfo(animeId: string): Promise<AnimeInfoKai> {
    return getAnimeInfo(animeId);
  }

  /**
   * Fetches available server information for a specific episode.
   * @param {string} episodeId - The unique identifier for the episode (required).
   * @param {SubOrDub} [category=SubOrDub.SUB] - The audio category (Subtitled or Dubbed) (optional, defaults to SubOrDub.SUB).
   * @returns {Promise<ServerInfoResponse>} A promise that resolves to an object containing available streaming server details for the episode.
   */
  async fetchServers(episodeId: string, category: SubOrDub = SubOrDub.SUB): Promise<ServerInfoResponse> {
    return getEpisodeServers(episodeId, category);
  }

  /**
   * Fetches available streaming source (video URLs) information for a specific episode.
   * @param {string} episodeId - The unique identifier for the episode (required).
   * @param {SubOrDub} [category=SubOrDub.SUB] - The audio category (Subtitled or Dubbed) (optional, defaults to SubOrDub.SUB).
   * @returns {Promise<SourceResponse>} A promise that resolves to an object containing streaming source (video URL) information for the episode.
   */
  async fetchSources(episodeId: string, category: SubOrDub = SubOrDub.SUB): Promise<SourceResponse> {
    return getEpisodeSources(episodeId, category);
  }
}

export { AnimeKai };
