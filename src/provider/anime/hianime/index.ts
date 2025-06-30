import { fetchAnimeInfo, fetchEpisodeSources, fetchServers, getEpisodes, searchAnime } from './hianime.js';
import type { ZoroAnimeInfo, SearchResponse, EpisodeInfoRes, ServerInfoResponse, HianimeSourceResponse } from './hianime.js';
import { HiAnimeServers } from './types.js';
import { SubOrDub } from '../../index.js';

/**
 * A class for interacting with the HiAnime provider to search for anime, fetch detailed information,
 * retrieve episode lists, get available streaming servers, and obtain direct streaming sources.
 */
export class HiAnime {
  /**
   * Searches for anime based on the provided query string.
   * @param {string} query - The search query string (required).
   * @param {number} [page=1] - The page number for pagination (optional, defaults to 1).
   * @returns {Promise<SearchResponse>} A promise that resolves to an object containing an array of anime titles related to the search query.
   */
  async search(query: string, page: number = 1): Promise<SearchResponse> {
    return searchAnime(query, page);
  }

  /**
   * Fetches detailed information about a specific anime.
   * @param {string} animeId - The unique identifier for the anime on HiAnime (required).
   * @returns {Promise<ZoroAnimeInfo>} A promise that resolves to an object containing comprehensive anime details.
   */
  async fetchInfo(animeId: string): Promise<ZoroAnimeInfo> {
    return fetchAnimeInfo(animeId);
  }

  /**
   * Fetches detailed episode data for a specific anime.
   * @param {string} animeId - The unique identifier for the anime on HiAnime (required).
   * @returns {Promise<EpisodeInfoRes>} A promise that resolves to an object containing information about the anime's episodes.
   */
  async fetchEpisodes(animeId: string): Promise<EpisodeInfoRes> {
    return getEpisodes(animeId);
  }

  /**
   * Fetches available server information for a specific anime episode.
   * @param {string} episodeId - The unique identifier for the episode on HiAnime (required).
   * @returns {Promise<ServerInfoResponse>} A promise that resolves to an object containing available streaming server details for the episode.
   */
  async fetchEpisodeServers(episodeId: string): Promise<ServerInfoResponse> {
    return fetchServers(episodeId);
  }

  /**
   * Fetches streaming sources  for a given anime episode from a specified server and category (sub/dub).
   * @param {string} episodeId - The unique identifier for the episode on HiAnime (required).
   * @param {HiAnimeServers} [server=HiAnimeServers.HD2] - The streaming server to use (optional, defaults to HiAnimeServers.HD2). Note: HD1 is CORS protected (Error 403). Use a proxy or switch to HD-2 or HD-3(🤷).
   * @param {SubOrDub} [category=SubOrDub.SUB] - The audio category (Subtitled or Dubbed) (optional, defaults to SubOrDub.SUB).
   * @returns {Promise<HianimeSourceResponse>} A promise that resolves to an object containing streaming sources (video URLs) for the episode.
   */
  async fetchSources(
    episodeId: string,
    server: HiAnimeServers = HiAnimeServers.HD2,
    category: SubOrDub = SubOrDub.SUB,
  ): Promise<HianimeSourceResponse> {
    return fetchEpisodeSources(episodeId, server, category);
  }
}
