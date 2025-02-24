import * as cheerio from 'cheerio';
import { Servers, Dubbing, SuccessResponse, Anime, ErrorResponse, EpisodeInfo, AnimeInfo, ServerInfo } from './types.js';
import {
  extractSearchResults,
  extractAnimeInfo,
  extractEpisodesList,
  extractServerData,
  extractAnimeServerId,
} from './scraper.js';
import { providerClient, zoroSearch, zoroBaseUrl, MegaCloud } from '../../index.js';
import axios from 'axios';
import { ASource } from '../../../types/types.js';

export interface SuccessSearchResponse extends SuccessResponse {
  data: Anime[];
  hasNextPage: boolean;
  currentPage: number;
  totalPages: number;
}
export interface SearchErrorResponse extends ErrorResponse {
  data: [];
  hasNextPage: boolean;
  totalPages: number;
  currentPage: number;
}
export type SearchResponse = SuccessSearchResponse | SearchErrorResponse;
export async function searchAnime(query: string, page: number): Promise<SearchResponse> {
  if (!query)
    return {
      success: false,
      status: 400,
      hasNextPage: false,
      currentPage: 0,
      totalPages: 0,
      data: [],
      error: 'Missing required Params : query',
    };

  query = query.trim();

  try {
    const response = await providerClient.get(`${zoroSearch}?keyword=${query}&page=${page as number}`);

    if (!response.data) {
      return {
        success: false,
        hasNextPage: false,
        currentPage: 0,
        totalPages: 0,
        status: 204,
        error: `Received empty response from server`,
        data: [],
      };
    }
    const $data = cheerio.load(response.data);

    const searchSelector: cheerio.SelectorType = '.block_area-content .film_list-wrap .flw-item';

    const { anime, hasNextPage, totalPages, currentPage } = extractSearchResults($data, searchSelector);
    if (!anime) {
      return {
        hasNextPage: false,
        currentPage: 0,
        totalPages: 0,
        status: 204,
        success: false,
        error: 'Scraper Error',
        data: [],
      };
    }
    return {
      success: true,
      status: 200,
      hasNextPage: hasNextPage,
      currentPage: Number(currentPage) || 0,
      totalPages: Number(totalPages) || 0,
      data: anime,
    };
  } catch (error) {
    if (axios.isAxiosError(error))
      return {
        hasNextPage: false,
        currentPage: 0,
        totalPages: 0,
        status: error.response?.status || 500,
        error: `Request failed: ${error.message}` || 'Unknown axios error',
        success: false,
        data: [],
      };
    return {
      success: false,
      hasNextPage: false,
      currentPage: 0,
      totalPages: 0,
      status: 500,
      data: [],
      error: error instanceof Error ? error.message : 'Contact dev if you see this',
    };
  }
}

export interface AnimeInfoSuccess extends SuccessResponse {
  data: AnimeInfo;
}
export interface AnimeInfoError extends ErrorResponse {
  data: null;
}
export type ZoroAnimeInfo = AnimeInfoSuccess | AnimeInfoError;
export async function fetchAnimeInfo(animeId: string): Promise<ZoroAnimeInfo> {
  if (!animeId)
    return {
      success: false,
      status: 400,
      data: null,
      error: 'Missing required params :animeId',
    };

  try {
    const response = await providerClient.get(`${zoroBaseUrl}/${animeId}`, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        Referer: `${zoroBaseUrl}/watch/${animeId}`,
      },
    });

    if (!response.data)
      return {
        success: false,
        error: 'Server returned an empty response',
        data: null,
        status: 204,
      };

    const $animeData = cheerio.load(response.data);
    const { res } = extractAnimeInfo($animeData);
    if (!res) {
      return {
        success: false,
        status: 204,
        error: 'Scraper error',
        data: null,
      };
    }
    return {
      success: true,
      data: res,
      status: 200,
    };
  } catch (error) {
    if (axios.isAxiosError(error))
      return {
        success: false,
        error: `Request failed ${error.message}` || ' Unknown axios error',
        status: error.response?.status || 500,
        data: null,
      };
    return {
      success: false,
      status: 500,
      data: null,
      error: error instanceof Error ? error.message : 'Contact dev if you see this',
    };
  }
}

export interface EpisodeSuccessInfoResponse extends SuccessResponse {
  data: EpisodeInfo[];
}
export interface EpisodeErrorInfoResponse extends ErrorResponse {
  data: [];
}
export type EpisodeInfoRes = EpisodeSuccessInfoResponse | EpisodeErrorInfoResponse;
export async function getEpisodes(animeId: string): Promise<EpisodeInfoRes> {
  if (!animeId)
    return {
      success: false,
      status: 400,
      data: [],
      error: 'Missing required params :animeId',
    };
  try {
    const response = await providerClient.get(`${zoroBaseUrl}/ajax/v2/episode/list/${animeId.split('-').pop()}`, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        Referer: `${zoroBaseUrl}/watch/${animeId}`,
      },
    });

    if (!response)
      return {
        success: false,
        error: 'Server returned an empty response',
        data: [],
        status: 204,
      };

    const $episodes = cheerio.load(response.data.html);
    const episodesSelector: cheerio.SelectorType = '.detail-infor-content .ss-list a';
    const { resEpisodeList } = extractEpisodesList($episodes, episodesSelector);
    if (!resEpisodeList) {
      return {
        success: false,
        status: 204,
        error: 'Scraper error',
        data: [],
      };
    }

    return {
      success: true,
      data: resEpisodeList,
      status: 200,
    };
  } catch (error) {
    if (axios.isAxiosError(error))
      return {
        success: false,
        error: `Request failed ${error.message}` || ' Unknown axios error',
        status: error.response?.status || 500,
        data: [],
      };
    return {
      success: false,
      status: 500,
      data: [],
      error: error instanceof Error ? error.message : 'Contact dev if you see this',
    };
  }
}
export interface SuccessServerInfo extends SuccessResponse {
  data: ServerInfo;
}
export interface ErrorServerInfo extends ErrorResponse {
  data: null;
}
export type ServerInfoResponse = SuccessServerInfo | ErrorServerInfo;
export async function fetchServers(episodeId: string): Promise<ServerInfoResponse> {
  if (!episodeId)
    return {
      success: false,
      status: 400,
      data: null,
      error: 'Missing required params :episodeId!',
    };

  try {
    const newId = episodeId.split('-').pop();

    const response = await providerClient.get(`${zoroBaseUrl}/ajax/v2/episode/servers?episodeId=${newId}`, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        Referer: `${zoroBaseUrl}/watch/?ep=${newId}`,
      },
    });
    if (!response.data)
      return {
        success: false,
        status: 204,
        error: 'Server returned an empty response',
        data: null,
      };

    const res$: cheerio.CheerioAPI = cheerio.load(response.data.html);

    const { servers } = extractServerData(res$);
    if (!servers) return { success: false, error: 'Scraper Error ', data: null, status: 204 };
    return {
      success: true,
      status: 200,
      data: servers,
    };
  } catch (error) {
    if (axios.isAxiosError(error))
      return {
        success: false,
        status: error.response?.status || 500,
        data: null,
        error: `Request failed ${error.message}` || 'Unknown axios error',
      };
    return {
      success: false,
      data: null,
      status: 500,
      error: error instanceof Error ? error.message : 'Contact dev if you see this',
    };
  }
}
export interface SuccessSourceRes extends SuccessResponse {
  data: ASource;
}
export interface ErrorSourceRes extends ErrorResponse {
  data: null;
}
export type SourceResponse = SuccessSourceRes | ErrorSourceRes;
export async function fetchEpisodeSources(episodeid: string, server: Servers, category: Dubbing): Promise<SourceResponse> {
  if (!episodeid) {
    return {
      success: false,
      status: 400,
      data: null,
      error: 'Missing required params episodeId',
    };
  }
  try {
    const newId = episodeid.split('-').pop();

    const response = await providerClient.get(`${zoroBaseUrl}/ajax/v2/episode/servers?episodeId=${newId}`, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        Referer: `${zoroBaseUrl}/watch/?ep=${newId}`,
      },
    });
    if (!response.data)
      return {
        success: false,
        error: 'Server returned an empty response ',
        status: 204,
        data: null,
      };
    const datares$: cheerio.CheerioAPI = cheerio.load(response.data.html);
    let mediadataId: string | null = null;

    try {
      switch (server) {
        case Servers.HD1: {
          mediadataId = extractAnimeServerId(datares$, 4, category);
          if (!mediadataId) throw new Error('HD1 not found');
          break;
        }
        case Servers.HD2: {
          mediadataId = extractAnimeServerId(datares$, 1, category);
          if (!mediadataId) throw new Error('HD2 not found');
          break;
        }
        // case Servers.StreamSB: {
        //   mediadataId = extractAnimeServerId(datares$, 5, language);
        //   if (!mediadataId) throw new Error("streamsb not found");
        //   break;
        // }
        // case Servers.StreamTape: {
        //   mediadataId = extractAnimeServerId(datares$, 3, language);
        //   if (!mediadataId) throw new Error("streamtape not found");
        //   break;
        // }
      }
      if (!mediadataId) return { success: false, error: 'Scraping error', data: null, status: 204 };
      const {
        data: { link },
      } = await providerClient.get(`${zoroBaseUrl}//ajax/v2/episode/sources?id=${mediadataId}`, {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          Referer: `${zoroBaseUrl}/watch/?ep=${newId}`,
        },
      });
      if (!link)
        return {
          success: false,
          error: 'Server returned an empty response',
          status: 204,
          data: null,
        };
      // console.log(link, mediadataId);
      // const id = link.split('/').at(-1);
      // console.log(id);
      // const sources = puppeteer(id);
      const sources = await new MegaCloud().extract(link);
      return {
        success: true,
        status: 200,
        data: sources,
      };
    } catch (error) {
      if (axios.isAxiosError(error))
        return {
          success: false,
          status: error.response?.status || 500,
          data: null,
          error: `Request failed ${error.message}` || 'Unknown axios error',
        };
      return {
        success: false,
        status: 500,
        data: null,
        error: error instanceof Error ? error.message : 'Contact dev if you see this',
      };
    }
  } catch (error) {
    if (axios.isAxiosError(error))
      return {
        success: false,
        status: error.response?.status || 500,
        data: null,
        error: `Request failed ${error.message}` || 'Unknown axios error',
      };
    return {
      success: false,
      status: 500,
      data: null,
      error: error instanceof Error ? error.message : 'Contact dev if you see this',
    };
  }
}
