/// Gratitude goes to consumet

import * as cheerio from 'cheerio';

import { animekaiBaseUrl } from '../../../utils/constants';
import { extractAnimeInfo, extractsearchresults } from './scraper';
import axios from 'axios';
import { MegaUp } from '../../../source-extractors/megaup/megaup';
import { ASource, SubOrDub } from '../../../types/types';
import { ErrorResponse, Info, searchRes, AnimeKaiServers, SuccessResponse } from './types';
import { providerClient } from '../../../config/clients';

export const headers = {
  Accept:
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
  'Accept-Encoding': 'gzip, deflate, br',
  'Accept-Language': 'en-GB,en;q=0.9',
  'Cache-Control': 'max-age=0',
  Cookie: '_ga=GA1.1.552928217.1741113813; _ga_9Q0DLZGNGV=GS1.1.1741113812.1.0.1741113812.0.0.0',
  'Sec-Ch-Ua': '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
  'Sec-Ch-Ua-Mobile': '?0',
  'Sec-Ch-Ua-Platform': '"Windows"',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'none',
  'Sec-Fetch-User': '?1',
  'Upgrade-Insecure-Requests': '1',
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
};

export interface SuccessSearchResponse extends SuccessResponse {
  data: searchRes[];
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
export async function searchanime(query: string, page: number): Promise<SearchResponse> {
  if (!query.trim()) {
    return {
      success: false,
      status: 400,
      hasNextPage: false,
      currentPage: 0,
      totalPages: 0,
      data: [],
      error: 'Missing required parameter: query',
    };
  }

  try {
    const sanitizedQuery = query.replace(/[\W_]+/g, '+');
    const response = await axios.get(`${animekaiBaseUrl}/browser?keyword=${sanitizedQuery}&page=${page}`, { headers });

    const data$ = cheerio.load(response.data);
    const { res, searchresults } = extractsearchresults(data$);

    if (!Array.isArray(searchresults) || searchresults.length === 0) {
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
      hasNextPage: res.hasNextPage,
      currentPage: res.currentPage || 0,
      totalPages: res.totalPages || 0,
      data: searchresults,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        hasNextPage: false,
        currentPage: 0,
        totalPages: 0,
        status: error.response?.status || 500,
        data: [],
        error: `Axios error: ${error.response?.statusText || error.message}`,
      };
    }

    return {
      success: false,
      hasNextPage: false,
      currentPage: 0,
      totalPages: 0,
      status: 500,
      data: [],
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

type episodes = {
  episodeId: string | null;
  number: number;
  title: string | null;
};
export interface AnimeInfoSuccess extends SuccessResponse {
  data: Info;
  providerEpisodes: episodes[];
}
export interface AnimeInfoError extends ErrorResponse {
  data: null;
  providerEpisodes: [];
}
export type AnimeInfoKai = AnimeInfoSuccess | AnimeInfoError;
export async function getAnimeInfo(animeId: string): Promise<AnimeInfoKai> {
  if (!animeId.trim()) {
    return {
      success: false,
      error: 'Missing required Params : animeId',
      status: 400,
      data: null,
      providerEpisodes: [],
    };
  }
  try {
    const response = await axios.get(`${animekaiBaseUrl}/watch/${animeId}`, {
      headers: headers,
    });
    const data$ = cheerio.load(response.data);
    const { animeInfo } = extractAnimeInfo(data$);
    if (!response.data) {
      return {
        status: response.status,
        success: response.status === 200,
        error: response.statusText || 'Scraper Error: No animeInfo found',
        data: null,
        providerEpisodes: [],
      };
    }

    const ani_id = data$('.rate-box#anime-rating').attr('data-id');
    const episodesAjax = await axios.get(
      `${animekaiBaseUrl}/ajax/episodes/list?ani_id=${ani_id}&_=${new MegaUp().GenerateToken(ani_id!)}`,
      {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          Referer: `${animekaiBaseUrl}/watch/${animeId}`,
          ...headers,
        },
      },
    );
    if (!episodesAjax.data.result) {
      return {
        status: episodesAjax.status,
        success: episodesAjax.status === 200,
        error: episodesAjax.statusText || 'Scraper Error: No Episodes found',
        data: null,
        providerEpisodes: [],
      };
    }
    const episodes$: cheerio.CheerioAPI = cheerio.load(episodesAjax.data.result);
    const episodes: {
      episodeId: string | null;
      number: number;
      title: string | null;
    }[] = [];

    episodes$('div.eplist > ul > li > a').each((i, el) => {
      const episodeIdwithToken = `${animeId}$ep=${episodes$(el).attr('num')}$token=${episodes$(el).attr('token')}` || null;
      const number = Number(episodes$(el).attr('num')!);
      const title = episodes$(el).children('span').text().trim() || null;

      episodes?.push({
        episodeId: episodeIdwithToken,
        number: number,
        title: title,
      });
    });
    if (!Array.isArray(episodes) || episodes.length === 0) {
      return {
        status: 204,
        success: false,
        error: 'Scraper Error: No results found',
        data: null,
        providerEpisodes: [],
      };
    }

    return {
      success: response.status === 200 && episodesAjax.status === 200,
      status: response.status && episodesAjax.status,
      data: animeInfo,
      providerEpisodes: episodes,
    };
  } catch (error) {
    if (axios.isAxiosError(error))
      return {
        status: error.response?.status || 500,
        data: null,
        providerEpisodes: [],
        error: `Request failed: ${error.message}` || 'Unknown axios error',
        success: false,
      };
    return {
      success: false,
      status: 500,
      data: null,
      providerEpisodes: [],
      error: error instanceof Error ? error.message : 'Contact dev if you see this',
    };
  }
}
type Intro = {
  start: number;
  end: number;
};
type Outro = {
  start: number;
  end: number;
};
export type serverInfo = {
  name: string;
  url: string;
  // intro: Intro;
  // outro: Outro;
};
export interface SuccessServerInfo extends SuccessResponse {
  data: serverInfo[];
}
export interface ErrorServerInfo extends ErrorResponse {
  data: [];
}
// broken from here
/// i guess puppeteer can do wonders just pass the episodeID with out the token stuff eg like below and wait for ajax links to generate stuff html document called server notice
//
// https://animekai.to/watch/dragon-ball-daima-ypr6#ep=4
export type ServerInfoResponse = SuccessServerInfo | ErrorServerInfo;
export async function getEpisodeServers(episodeId: string, category: SubOrDub): Promise<ServerInfoResponse> {
  if (!episodeId.trim()) {
    return {
      success: false,
      status: 400,
      data: [],
      error: 'Missing required params episodeId',
    };
  }
  // undefined can really give 404
  //my id   'solo-leveling-season-2-arise-from-the-shadow-x7rq$ep=5$token=O9jut_zlt0e70m9Qj5SD
  const tokenstuff = episodeId.split('$token=')[1];
  if (tokenstuff)
    episodeId = `${animekaiBaseUrl}/ajax/links/list?token=${tokenstuff}&_=${new MegaUp().GenerateToken(tokenstuff)}`;
  try {
    const { data } = await axios.get(episodeId, {
      headers: {
        Referer: animekaiBaseUrl,
        ...headers,
      },
    });
    if (!data.result) {
      return {
        status: data.status,
        success: data.status === 200,
        error: data.statusText || 'Scraper Error: No ServerUrl  found',
        data: [],
      };
    }
    const $ = cheerio.load(data.result);
    const servers: serverInfo[] = [];
    const serverItems = $(`.server-items.lang-group[data-id="${category}"] .server`);
    await Promise.all(
      serverItems.map(async (i, server) => {
        const id = $(server).attr('data-lid');
        const { data } = await providerClient.get(
          `${animekaiBaseUrl}/ajax/links/view?id=${id}&_=${new MegaUp().GenerateToken(id!)}`,
          {
            headers: headers,
          },
        );
        const decodedData = JSON.parse(new MegaUp().DecodeIframeData(data.result));
        servers.push({
          name: `MegaUp ${$(server).text().trim()}`!,
          url: decodedData.url,
          // intro: {
          //   start: decodedData?.skip.intro[0],
          //   end: decodedData?.skip.intro[1],
          // },
          // outro: {
          //   start: decodedData?.skip.outro[0],
          //   end: decodedData?.skip.outro[1],
          // },
        });
      }),
    );
    return {
      success: true,
      status: 200,
      data: servers,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        status: error.response?.status || 500,
        data: [],
        error: `Request failed: ${error.message}` || 'Unknown axios error',
        success: false,
      };
    }
    return {
      success: false,
      status: 500,
      data: [],
      error: error instanceof Error ? ` Request failed: ${error.message}` : 'Contact dev if you see this',
    };
  }
}
export interface SuccessSourceRes extends SuccessResponse {
  headers: {
    Referer: string;
  };
  data: ASource;
}
export interface ErrorSourceRes extends ErrorResponse {
  data: null;
  headers: {
    Referer: null;
  };
}
export type SourceResponse = SuccessSourceRes | ErrorSourceRes;
export async function getEpisodeSources(
  episodeId: string,
  category: SubOrDub,
  server: AnimeKaiServers = AnimeKaiServers.MegaUp,
): Promise<SourceResponse> {
  if (!episodeId.trim) {
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
      case AnimeKaiServers.MegaUp:
        return {
          headers: { Referer: serverUrl.href },
          // success: true,
          // status: 200,
          data: (await new MegaUp().extract(serverUrl)) as ASource,
        };

      default:
        return {
          headers: { Referer: serverUrl.href },
          // success: true,
          // status: 200,
          data: (await new MegaUp().extract(serverUrl)) as ASource,
        };
    }
  }

  try {
    const servers = await getEpisodeServers(episodeId, category);
    const urlIndex = servers.data.findIndex(s => s.name.toLowerCase().includes(server));
    if (urlIndex === -1) {
      return {
        success: false,
        status: 400,
        headers: {
          Referer: null,
        },
        data: null,
        error: `Server ${server} not found check the class `,
      };
    }
    //@ts-ignore
    const serverUrl: URL = new URL(servers.data[urlIndex].url);
    return await getEpisodeSources(serverUrl.href, category, server);
  } catch (error) {
    if (axios.isAxiosError(error))
      return {
        status: error.response?.status || 500,
        headers: {
          Referer: null,
        },
        data: null,
        error: `Request failed: ${error.message}` || 'Unknown axios error',
        success: false,
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
