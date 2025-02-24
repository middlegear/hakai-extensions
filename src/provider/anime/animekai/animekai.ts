import * as cheerio from 'cheerio';
import { providerClient } from '../../../config/clients';
import { animekaiBaseUrl } from '../../../utils/constants';
import { extractAnimeInfo, extractsearchresults } from './scraper';
import axios from 'axios';
import { ErrorResponse, Info, searchRes, Servers, SubOrDub, SuccessResponse } from './types';
import { MegaUp } from '../../../source-extractors/megaup/megaup';
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
  try {
    const response = await providerClient.get(
      `${animekaiBaseUrl}/browser?keyword=${query.replace(/[\W_]+/g, '+')}&page=${page}`,
    );
    const data$ = cheerio.load(response.data);
    const { res, searchresults } = extractsearchresults(data$);
    if (!searchresults) {
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
      hasNextPage: res.hasNextPage,
      currentPage: res.currentPage || 0,
      totalPages: res.totalPages || 0,
      data: searchresults,
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

type episodes = {
  episodeId: string | null;
  number: number;
  title: string | null;
};
export interface AnimeInfoSuccess extends SuccessResponse {
  data: Info;
  episodes: episodes[];
}
export interface AnimeInfoError extends ErrorResponse {
  data: null;
  episodes: [];
}
export type AnimeInfoKai = AnimeInfoSuccess | AnimeInfoError;
export async function getAnimeInfo(animeId: string): Promise<AnimeInfoKai> {
  if (!animeId) {
    return {
      success: false,
      error: 'Missing required Params : animeId',
      status: 400,
      data: null,
      episodes: [],
    };
  }
  try {
    const response = await providerClient.get(`${animekaiBaseUrl}/watch/${animeId}`);
    const data$ = cheerio.load(response.data);
    const { animeInfo } = extractAnimeInfo(data$);

    const ani_id = data$('.rate-box#anime-rating').attr('data-id');
    const episodesAjax = await providerClient.get(
      `${animekaiBaseUrl}/ajax/episodes/list?ani_id=${ani_id}&_=${new MegaUp().GenerateToken(ani_id!)}`,
      {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          Referer: `${animekaiBaseUrl}/watch/${animeId}`,
        },
      },
    );
    const episodes$: cheerio.CheerioAPI = cheerio.load(episodesAjax.data.result);
    const episodes: {
      episodeId: string | null;
      number: number;
      title: string | null;
    }[] = [];

    episodes$('div.eplist > ul > li > a').each((i, el) => {
      const episodeId = `${animeId}$ep=${episodes$(el).attr('num')}$token=${episodes$(el).attr('token')}` || null;
      const number = Number(episodes$(el).attr('num')!);
      const title = episodes$(el).children('span').text().trim() || null;

      episodes?.push({
        episodeId: episodeId,
        number: number,
        title: title,
      });
    });

    return { success: true, status: 200, data: animeInfo, episodes: episodes };
  } catch (error) {
    if (axios.isAxiosError(error))
      return {
        status: error.response?.status || 500,
        data: null,
        episodes: [],
        error: `Request failed: ${error.message}` || 'Unknown axios error',
        success: false,
      };
    return {
      success: false,
      status: 500,
      data: null,
      episodes: [],
      error: error instanceof Error ? error.message : 'Contact dev if you see this',
    };
  }
}
type serverInfo = {
  name: string;
  url: any;
};
export interface SuccessServerInfo extends SuccessResponse {
  data: serverInfo[];
}
export interface ErrorServerInfo extends ErrorResponse {
  data: [];
}
export type ServerInfoResponse = SuccessServerInfo | ErrorServerInfo;
export async function getEpisodeServers(episodeId: string, category: SubOrDub): Promise<ServerInfoResponse> {
  if (!episodeId) {
    return {
      success: false,
      status: 400,
      data: [],
      error: 'Missing required params episodeId',
    };
  }
  if (!episodeId.startsWith(animekaiBaseUrl + '/ajax'))
    episodeId = `${animekaiBaseUrl}/ajax/links/list?token=${episodeId.split('$token=')[1]}&_=${new MegaUp().GenerateToken(
      episodeId.split('$token=')[1] ?? '',
    )}`;
  try {
    const { data } = await providerClient.get(episodeId);
    const $: cheerio.CheerioAPI = cheerio.load(data.result);
    const servers: {
      name: string;
      url: any;
    }[] = [];
    const serverItems = $(`.server-items.lang-group[data-id="${category}"] .server`);
    await Promise.all(
      serverItems.map(async (i, server) => {
        const id = $(server).attr('data-lid');
        const { data } = await providerClient.get(
          `${animekaiBaseUrl}/ajax/links/view?id=${id}&_=${new MegaUp().GenerateToken(id!)}`,
        );
        servers.push({
          name: `MegaUp ${$(server).text().trim()}`!,
          url: JSON.parse(new MegaUp().DecodeIframeData(data.result)).url,
        });
      }),
    );
    return {
      success: true,
      status: 200,
      data: servers,
    };
  } catch (error) {
    if (axios.isAxiosError(error))
      return {
        status: error.response?.status || 500,
        data: [],
        error: `Request failed: ${error.message}` || 'Unknown axios error',
        success: false,
      };
    return {
      success: false,
      status: 500,
      data: [],
      error: error instanceof Error ? error.message : 'Contact dev if you see this',
    };
  }
}

export async function getEpisodeSources(episodeId: string, server: Servers, category: SubOrDub) {
  if (!episodeId) {
    return {
      success: false,
      status: 400,
      data: null,
      error: 'Missing required params episodeId',
    };
  }
  try {
  } catch (error) {}
}
