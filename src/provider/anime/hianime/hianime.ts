import * as cheerio from 'cheerio';
import { HiAnimeServers, Anime, EpisodeInfo, AnimeInfo, ServerInfo } from './types.js';
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

export interface SuccessSearchResponse {
  data: Anime[];
  hasNextPage: boolean;
  currentPage: number;
  lastPage: number;
}
export interface SearchErrorResponse {
  data: [];
  hasNextPage: boolean;
  error: string;
  lastPage: number;
  currentPage: number;
}
export type SearchResponse = SuccessSearchResponse | SearchErrorResponse;
export async function searchAnime(query: string, page: number): Promise<SearchResponse> {
  if (!query)
    return {
      hasNextPage: false,
      currentPage: 0,
      lastPage: 0,
      data: [],
      error: 'Missing required Params : query',
    };

  query = query.trim();

  try {
    const response = await providerClient.get(`${zoroSearch}?keyword=${query}&page=${page as number}`);

    if (!response.data) {
      return {
        hasNextPage: false,
        currentPage: 0,
        lastPage: 0,
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
        lastPage: 0,
        error: 'Scraper Error: No results found',
        data: [],
      };
    }
    return {
      hasNextPage: hasNextPage,
      currentPage: Number(currentPage) || 0,
      lastPage: Number(totalPages) || 0,
      data: anime,
    };
  } catch (error) {
    return {
      hasNextPage: false,
      currentPage: 0,
      lastPage: 0,
      error: error instanceof Error ? error.message : 'Unknown Error',
      data: [],
    };
  }
}

export interface AnimeInfoSuccess {
  data: AnimeInfo;
}
export interface AnimeInfoError {
  data: null;
  error: string;
}
export type ZoroAnimeInfo = AnimeInfoSuccess | AnimeInfoError;
export async function fetchAnimeInfo(animeId: string): Promise<ZoroAnimeInfo> {
  if (!animeId.trim())
    return {
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
        error: response.statusText || 'Server returned an empty response',
        data: null,
      };

    const $animeData = cheerio.load(response.data);
    const { res } = extractAnimeInfo($animeData);
    if (!res) {
      return {
        error: 'Scraper error',
        data: null,
      };
    }
    return { data: res };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Contact dev if you see this',
    };
  }
}

export interface EpisodeSuccessInfoResponse {
  data: EpisodeInfo[];
}
export interface EpisodeErrorInfoResponse {
  data: [];
  error: string;
}
export type EpisodeInfoRes = EpisodeSuccessInfoResponse | EpisodeErrorInfoResponse;
export async function getEpisodes(animeId: string): Promise<EpisodeInfoRes> {
  if (!animeId)
    return {
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
        error: response.statusText || 'Server returned an empty response',
        data: [],
      };

    const $episodes = cheerio.load(response.data.html);
    const episodesSelector: cheerio.SelectorType = '.detail-infor-content .ss-list a';
    const { resEpisodeList } = extractEpisodesList($episodes, episodesSelector);
    if (!Array.isArray(resEpisodeList) || resEpisodeList.length === 0) {
      return {
        error: 'Scraper Error: No results found',
        data: [],
      };
    }

    return { data: resEpisodeList };
  } catch (error) {
    return {
      data: [],
      error: error instanceof Error ? error.message : 'Contact dev if you see this',
    };
  }
}
export interface SuccessServerInfo {
  data: ServerInfo;
}
export interface ErrorServerInfo {
  data: null;
  error: string;
}
export type ServerInfoResponse = SuccessServerInfo | ErrorServerInfo;
export async function fetchServers(episodeId: string): Promise<ServerInfoResponse> {
  if (!episodeId)
    return {
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
        error: response.statusText || 'Server returned an empty response',
        data: null,
      };

    const res$: cheerio.CheerioAPI = cheerio.load(response.data.html);

    const { servers } = extractServerData(res$);
    if (!servers) {
      return {
        error: 'Scraper Error: No results found',
        data: null,
      };
    }
    return {
      data: servers,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Internal Server Error',
      data: null,
    };
  }
}

async function _getSource(episodeId: string, server: HiAnimeServers, category: SubOrDub) {
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
        error: response.statusText,
      };
    const datares$: cheerio.CheerioAPI = cheerio.load(response.data.html);
    let mediadataId: string | null = null;

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
      case HiAnimeServers.HD3: {
        mediadataId = extractAnimeServerId(datares$, 6, category);
        if (!mediadataId) throw new Error('HD3 not found');
        break;
      }
    }
    if (!mediadataId)
      return {
        error: 'Server returned no mediadataId',
      };
    const dataLink = await providerClient.get(`${zoroBaseUrl}//ajax/v2/episode/sources?id=${mediadataId}`, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        Referer: `${zoroBaseUrl}/watch/?ep=${newId}`,
      },
    });
    if (!dataLink.data)
      return {
        error: dataLink.statusText || 'Server returned an empty response',
      };
    // dataLink.data  is an object that contains something similar to this
    //       {
    //   type: 'iframe',
    //   link: 'https://megacloud.blog/embed-2/v2/e-1/5kyDcuM3rrUq?k=1',
    //   server: 1,
    //   sources: [],
    //   tracks: [],
    //   htmlGuide: ''
    // }
    return dataLink.data.link;
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unknown Error',
    };
  }
}
export interface SuccessSourceRes {
  data: ASource;
  headers: {
    Referer: string;
  };
}
export interface ErrorSourceRes {
  data: null;
  headers: {
    Referer: null;
  };

  error: string;
}
export type HianimeSourceResponse = SuccessSourceRes | ErrorSourceRes;
export async function fetchEpisodeSources(
  episodeId: string,
  server: HiAnimeServers,
  category: SubOrDub,
): Promise<HianimeSourceResponse> {
  if (!episodeId) {
    return {
      data: null,
      headers: {
        Referer: null,
      },
      error: 'Missing required params episodeId',
    };
  }

  if (episodeId.startsWith('http')) {
    const serverUrl = new URL(episodeId);
    switch (server) {
      case HiAnimeServers.HD1:
      case HiAnimeServers.HD2:
      case HiAnimeServers.HD3:
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
    // console.log(link, mediadataId);
    // const id = link.split('/').at(-1);
    // console.log(id);
    // const sources = puppeteer(id);
    //
    const embedUrl = await _getSource(episodeId, server, category);
    // console.log(embedUrl);
    return await fetchEpisodeSources(embedUrl, server, category);
  } catch (error) {
    return {
      data: null,
      headers: {
        Referer: null,
      },
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
