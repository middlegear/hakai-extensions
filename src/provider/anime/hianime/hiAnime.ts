import * as cheerio from 'cheerio';
import { Servers, Dubbing } from './types.js';

import {
  extractSearchResults,
  extractAnimeInfo,
  extractEpisodesList,
  extractServerData,
  extractAnimeServerId,
} from './scraper.js';
import { zoroClient, zoroSearch, zoroBaseUrl, MegaCloud } from '../../index.js';
import axios from 'axios';

export async function searchAnime(query: string, page: number) {
  if (!query)
    return {
      success: false,
      status: 400,
      data: [],
      error: 'Missing required Params : query',
    };

  query = query.trim();

  try {
    const response = await zoroClient.get(`${zoroSearch}?keyword=${query}&page=${page as number}`);

    if (!response.data) {
      return {
        success: false,
        status: 204,
        error: `Received empty response from server`,
        data: [],
      };
    }
    const $data = cheerio.load(response.data);

    const searchSelector: cheerio.SelectorType = '.block_area-content .film_list-wrap .flw-item';

    const data = extractSearchResults($data, searchSelector);
    if (!data.anime) {
      return {
        success: false,
        error: 'Scraper Error',
        data: [],
      };
    }
    return {
      success: true,
      status: 200,
      hasNextPage: data.hasNextPage,
      currentPage: data.currentPage,
      totalPages: data.totalPages,
      data: data.anime,
    };
  } catch (error) {
    if (axios.isAxiosError(error))
      return {
        status: error.response?.status || 500,
        error: `Request failed: ${error.message}` || 'Unknown axios error',
        success: false,
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

export async function fetchAnimeInfo(animeId: string) {
  if (!animeId)
    return {
      success: false,
      status: 400,
      data: null,
      error: 'Missing required params :animeId',
    };

  try {
    const [animeResponse, episodesResponse] = await Promise.all([
      zoroClient.get(`${zoroBaseUrl}/${animeId}`),
      zoroClient.get(`${zoroBaseUrl}/ajax/v2/episode/list/${animeId.split('-').pop()}`, {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          Referer: `${zoroBaseUrl}/watch/${animeId}`,
        },
      }),
    ]);

    if (!animeResponse.data || !episodesResponse.data)
      return {
        success: false,
        error: 'Server returned an empty response',
        data: null,
        status: 204,
      };

    const $animeData = cheerio.load(animeResponse.data);
    const resAnimeInfo = extractAnimeInfo($animeData);
    if (!resAnimeInfo) {
      return {
        success: false,
        error: 'Scraper error',
        data: null,
      };
    }

    const $episodes = cheerio.load(episodesResponse.data.html);
    const episodesSelector: cheerio.SelectorType = '.detail-infor-content .ss-list a';
    const resEpisodes = extractEpisodesList($episodes, episodesSelector);

    if (!resEpisodes) {
      return {
        success: false,
        error: 'Scraper error',
        data: null,
      };
    }

    return {
      success: true,
      data: {
        animeInfo: resAnimeInfo,
        episodes: resEpisodes,
      },
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
      staus: 500,
      data: null,
      error: error instanceof Error ? error.message : 'Contact dev if you see this',
    };
  }
}

export async function fetchServers(episodeId: string) {
  if (!episodeId)
    return {
      success: false,
      status: 400,
      data: null,
      error: 'Missing required params :episodeId!',
    };

  try {
    const newId = episodeId.split('-').pop();

    const response = await zoroClient.get(`${zoroBaseUrl}/ajax/v2/episode/servers?episodeId=${newId}`, {
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

    const data = extractServerData(res$);
    if (!data.dub || !data.sub || !data.episodeNumber)
      return { success: false, error: 'Scraper Error ', data: null };
    return {
      success: true,
      status: 200,
      data: data,
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

export async function fetchEpisodeSources(episodeid: string, server: Servers, language: Dubbing) {
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

    const response = await zoroClient.get(`${zoroBaseUrl}/ajax/v2/episode/servers?episodeId=${newId}`, {
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
          mediadataId = extractAnimeServerId(datares$, 4, language);
          if (!mediadataId) throw new Error('HD1 not found');
          break;
        }
        case Servers.HD2: {
          mediadataId = extractAnimeServerId(datares$, 1, language);
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
      if (!mediadataId) return { success: false, error: 'Scraping error', data: null };
      const {
        data: { link },
      } = await zoroClient.get(`${zoroBaseUrl}//ajax/v2/episode/sources?id=${mediadataId}`, {
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
      // console.log(link, mediadataId); looks like a crude implementation
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
