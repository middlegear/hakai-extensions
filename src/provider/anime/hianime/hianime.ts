import * as cheerio from 'cheerio';
import { HiAnimeServers, SuccessResponse, Anime, ErrorResponse, EpisodeInfo, AnimeInfo, ServerInfo } from './types.js';
import {
  extractSearchResults,
  extractAnimeInfo,
  extractEpisodesList,
  extractServerData,
  extractAnimeServerId,
} from './scraper.js';
import { providerClient, zoroSearch, zoroBaseUrl, MegaCloud } from '../../index.js';
import axios from 'axios';
import { ASource, SubOrDub } from '../../../types/types.js';

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
        success: response.status === 200,
        hasNextPage: false,
        currentPage: 0,
        totalPages: 0,
        status: response.status,
        error: response.statusText || `Received empty response from server`,
        data: [],
      };
    }
    const $data = cheerio.load(response.data);

    const searchSelector: cheerio.SelectorType = '.block_area-content .film_list-wrap .flw-item';

    const { anime, hasNextPage, totalPages, currentPage } = extractSearchResults($data, searchSelector);
    if (!Array.isArray(anime) || anime.length === 0) {
      return {
        hasNextPage: false,
        currentPage: 0,
        totalPages: 0,
        status: 204,
        success: false,
        error: 'Scraper Error: No results found',
        data: [],
      };
    }
    return {
      success: response.status === 200,
      status: response.status,
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
      error: error instanceof Error ? error.message : 'Internal Server error',
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
  if (!animeId.trim())
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
        success: response.status === 200,
        error: response.statusText || 'Server returned an empty response',
        data: null,
        status: response.status,
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
    return { status: response.status, success: response.status === 200, data: res };
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

    if (!response.data)
      return {
        success: response.status === 200,
        error: response.statusText || 'Server returned an empty response',
        data: [],
        status: response.status,
      };

    const $episodes = cheerio.load(response.data.html);
    const episodesSelector: cheerio.SelectorType = '.detail-infor-content .ss-list a';
    const { resEpisodeList } = extractEpisodesList($episodes, episodesSelector);
    if (!Array.isArray(resEpisodeList) || resEpisodeList.length === 0) {
      return {
        status: 204,
        success: false,
        error: 'Scraper Error: No results found',
        data: [],
      };
    }

    return { status: response.status, success: response.status === 200, data: resEpisodeList };
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
  data: [];
}
export type ServerInfoResponse = SuccessServerInfo | ErrorServerInfo;
export async function fetchServers(episodeId: string): Promise<ServerInfoResponse> {
  if (!episodeId)
    return {
      success: false,
      status: 400,
      data: [],
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
        success: response.status === 200,
        status: response.status,
        error: response.statusText || 'Server returned an empty response',
        data: [],
      };

    const res$: cheerio.CheerioAPI = cheerio.load(response.data.html);

    const { servers } = extractServerData(res$);
    if (!Array.isArray(servers) || servers.length === 0) {
      return {
        status: 204,
        success: false,
        error: 'Scraper Error: No results found',
        data: [],
      };
    }
    return {
      success: response.status === 200,
      status: response.status,
      data: servers,
    };
  } catch (error) {
    if (axios.isAxiosError(error))
      return {
        success: false,
        status: error.response?.status || 500,
        data: [],
        error: `Request failed ${error.message}` || 'Unknown axios error',
      };
    return {
      success: false,
      status: 500,
      error: error instanceof Error ? error.message : 'Internal Server Error',
      data: [],
    };
  }
}
export interface SuccessSourceRes extends SuccessResponse {
  data: ASource;
  headers: {
    Referer: string;
  };
}
export interface ErrorSourceRes extends ErrorResponse {
  data: null;
  headers: {
    Referer: null;
  };
}
export type HianimeSourceResponse = SuccessSourceRes | ErrorSourceRes;
export async function fetchEpisodeSources(
  episodeId: string,
  server: HiAnimeServers,
  category: SubOrDub,
): Promise<HianimeSourceResponse> {
  if (!episodeId) {
    return {
      success: false,
      status: 400,
      headers: {
        Referer: null,
      },
      data: null,
      error: 'Missing required params episodeId',
    };
  }

  if (episodeId.startsWith('http')) {
    const serverUrl = new URL(episodeId);
    switch (server) {
      case HiAnimeServers.HD1:
      case HiAnimeServers.HD2:
        return {
          headers: { Referer: `${serverUrl.origin}/` },
          data: (await new MegaCloud().extract(serverUrl)) as ASource,
        };

      default:
        return {
          headers: { Referer: `${serverUrl.origin}/` },
          data: (await new MegaCloud().extract(serverUrl)) as ASource,
        };
    }
  }
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
        success: response.status === 200,
        error: response.statusText || 'Server returned an empty response ',
        status: response.status,
        headers: {
          Referer: null,
        },
        data: null,
      };
    const datares$: cheerio.CheerioAPI = cheerio.load(response.data.html);
    let mediadataId: string | null = null;

    try {
      switch (server) {
        case HiAnimeServers.HD1: {
          mediadataId = extractAnimeServerId(datares$, 4, category);
          if (!mediadataId) throw new Error('HD1 not found');
          break;
        }
        case HiAnimeServers.HD2: {
          mediadataId = extractAnimeServerId(datares$, 1, category);
          if (!mediadataId) throw new Error('HD2 not found');
          break;
        }
      }
      if (!mediadataId)
        return {
          success: false,
          error: 'Scraping error',
          status: 204,
          headers: {
            Referer: null,
          },
          data: null,
        };
      const dataLink = await providerClient.get(`${zoroBaseUrl}//ajax/v2/episode/sources?id=${mediadataId}`, {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          Referer: `${zoroBaseUrl}/watch/?ep=${newId}`,
        },
      });
      if (!dataLink.data)
        return {
          success: dataLink.status === 200,
          error: dataLink.statusText || 'Server returned an empty response',
          status: dataLink.status,
          headers: {
            Referer: null,
          },
          data: null,
        };
    } catch (error) {
      if (axios.isAxiosError(error))
        return {
          success: false,
          status: error.response?.status || 500,
          headers: {
            Referer: null,
          },
          data: null,

          error: `Request failed ${error.message}` || 'Unknown axios error',
        };
      return {
        success: false,
        status: 500,
        data: null,
        headers: {
          Referer: null,
        },
        error: error instanceof Error ? error.message : 'Unknown Error',
      };
    }
    if (!mediadataId)
      return {
        success: false,
        error: 'Scraping error',
        status: 204,
        headers: {
          Referer: null,
        },
        data: null,
      };
    const dataLink = await providerClient.get(`${zoroBaseUrl}//ajax/v2/episode/sources?id=${mediadataId}`, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        Referer: `${zoroBaseUrl}/watch/?ep=${newId}`,
      },
    });
    if (!dataLink.data)
      return {
        success: dataLink.status === 200,
        error: dataLink.statusText || 'Server returned an empty response',
        status: dataLink.status,
        headers: {
          Referer: null,
        },
        data: null,
      };
    // console.log(link, mediadataId);
    // const id = link.split('/').at(-1);
    // console.log(id);
    // const sources = puppeteer(id);
    //
    const link = dataLink.data.link;

    return await fetchEpisodeSources(link, server, category);
  } catch (error) {
    if (axios.isAxiosError(error))
      return {
        success: false,
        status: error.response?.status || 500,
        headers: {
          Referer: null,
        },
        data: null,
        error: `Request failed ${error.message}` || 'Unknown axios error',
      };
    return {
      success: false,
      status: 500,
      headers: {
        Referer: null,
      },
      data: null,
      error: error instanceof Error ? error.message : 'Contact dev if you see this',
    };
  }
}
