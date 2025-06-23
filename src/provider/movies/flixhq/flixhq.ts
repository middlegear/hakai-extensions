import * as cheerio from 'cheerio';
import { flixhqBaseUrl } from '../../../utils/constants.js';
import { scrapeMediaInfo, scrapeSearch } from './scraper.js';
import { providerClient } from '../../../config/clients.js';
import { type FLixepisodes, type MediaInfo, type searchTypes, type ServerRes, StreamingServers } from './types.js';
import VidCloud, { type sources, type subtitles, type ExtractedData } from '../../../source-extractors/vidcloud.js';
interface FlixSucessSearchRes {
  data: searchTypes[];
  hasNextPage: boolean;
  currentPage: number;
}
interface FlixErrorSearchRes {
  data: [];
  error: string;
  hasNextPage: boolean;
  currentPage: number;
}
export type FlixSearchRes = FlixSucessSearchRes | FlixErrorSearchRes;
export async function _search(query: string, page: number): Promise<FlixSearchRes> {
  if (!query) {
    return { data: [], error: 'Missing required params: query!', currentPage: 0, hasNextPage: false };
  }
  try {
    const reponse = await providerClient.get(`${flixhqBaseUrl}/search/${query.replace(/[\W_]+/g, '-')}?page=${page}`);
    const data$ = cheerio.load(reponse.data);
    const res = scrapeSearch(data$);

    return { currentPage: page, hasNextPage: res.hasNextPage, data: res.results };
  } catch (error) {
    return { data: [], currentPage: 0, hasNextPage: false, error: error instanceof Error ? error.message : 'Unknown err' };
  }
}

interface SuccessFlixInfo {
  data: MediaInfo;
  episodes: FLixepisodes;
}
interface ErrorFlixInfo {
  data: null;
  episodes: null;
  error: string;
}
export type FLixInfoRes = SuccessFlixInfo | ErrorFlixInfo;
export async function _getInfo(mediaId: string): Promise<FLixInfoRes> {
  if (!mediaId) {
    return { data: null, episodes: null, error: 'Missing required parameter mediaId!' };
  }
  if (!mediaId.startsWith(flixhqBaseUrl)) {
    mediaId = `${flixhqBaseUrl}/${mediaId}`;
  }

  try {
    const response = await providerClient.get(mediaId);
    const data$ = cheerio.load(response.data);
    const res = scrapeMediaInfo(data$);

    const uid = data$('.watch_block').attr('data-id')!;
    const ajaxReqUrl = (id: string, type: string, isSeasons: boolean = false) =>
      `${flixhqBaseUrl}/ajax/${type === 'movie' ? type : `v2/${type}`}/${isSeasons ? 'seasons' : 'episodes'}/${id}`;
    let episodes:
      | { id: string; title: string; number: number; season: number; url: string }[]
      | { id: string; title: string | null; url: string }[] = [];
    if (res.type === 'TV') {
      const { data } = await providerClient.get(ajaxReqUrl(uid, 'tv', true));
      const $$ = cheerio.load(data);
      const seasonsIds = $$('.dropdown-menu > a')
        .map((i, el) => data$(el).attr('data-id'))
        .get();

      let season = 1;
      for (const id of seasonsIds) {
        const { data } = await providerClient.get(ajaxReqUrl(id, 'season'));
        const $$$ = cheerio.load(data);

        $$$('.nav > li')
          .map((i, el) => {
            const episode = {
              id: $$$(el).find('a').attr('id')!.split('-')[1],
              title: $$$(el).find('a').attr('title')!,
              number: parseInt($$$(el).find('a').attr('title')!.split(':')[0].slice(3).trim()),
              season: season,
              url: `${flixhqBaseUrl}/ajax/v2/episode/servers/${$$$(el).find('a').attr('id')!.split('-')[1]}`,
            };
            episodes?.push(episode);
          })
          .get();
        season++;
      }
    } else {
      episodes = [
        {
          id: uid,
          title: res.title,
          url: `${flixhqBaseUrl}/ajax/movie/episodes/${uid}`,
        },
      ];
    }
    return { data: res, episodes: episodes as FLixepisodes };
  } catch (error) {
    return { data: null, episodes: null, error: error instanceof Error ? error.message : 'Unknown err' };
  }
}
interface SuccessFlixServerRes {
  data: ServerRes;
}
interface ErrorFlixSeverRes {
  data: null;
  error: string;
}
export type FlixServerRes = SuccessFlixServerRes | ErrorFlixSeverRes;
export async function _getServers(episodeId: string): Promise<FlixServerRes> {
  if (!episodeId) {
    return { data: null, error: 'Missing required params episodeId!' };
  }

  if (!episodeId.startsWith(flixhqBaseUrl + '/ajax')) episodeId = `${flixhqBaseUrl}/ajax/v2/episode/servers/${episodeId}`;
  else episodeId = `${flixhqBaseUrl}/ajax/movie/episodes/${episodeId}`;

  try {
    const { data } = await providerClient.get(episodeId);
    const data$ = cheerio.load(data);

    const servers = data$('.nav > li')
      .map((i, el) => {
        const server = {
          name:
            data$(el).find('a').attr('title')!.toLowerCase().split('server').at(1)?.trim() ||
            data$(el).find('a').attr('title')!.slice(6).trim().toLowerCase().split('server').at(1)?.trim(),

          id: Number(data$(el).find('a').attr('data-id') || data$(el).find('a').attr('data-linkid')),
        };

        return server;
      })
      .get();
    return { data: servers as unknown as ServerRes };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : 'Unknown Error' };
  }
}

interface SuccessFlixSourceRes {
  data: {
    subtitles: subtitles[];
    sources: sources[];
  };
  headers: { Referer: string };
}
interface ErrorFlixSourcesRes {
  data: null;
  error: string;
}

export type FLixSourcesRes = SuccessFlixSourceRes | ErrorFlixSourcesRes;
export async function _getsources(episodeId: string, server: StreamingServers): Promise<FLixSourcesRes> {
  if (episodeId.startsWith('http')) {
    const serverUrl = new URL(episodeId);

    switch (server) {
      case StreamingServers.VidCloud:
        return {
          headers: { Referer: `${serverUrl.href}` },
          data: (await new VidCloud().extract(serverUrl)) as ExtractedData,
        };
      case StreamingServers.Upcloud:
        return {
          headers: { Referer: `${serverUrl.href}/` },
          data: (await new VidCloud().extract(serverUrl)) as ExtractedData,
        };
      case StreamingServers.Akcloud:
        return {
          headers: { Referer: `${serverUrl.href}/` },
          data: (await new VidCloud().extract(serverUrl)) as ExtractedData,
        };
      default:
        return {
          headers: { Referer: `${serverUrl.href}/` },
          data: (await new VidCloud().extract(serverUrl)) as ExtractedData,
        };
    }
  }
  try {
    const servers = await _getServers(episodeId);
    let i;
    if (servers.data) i = servers.data.findIndex((s: { name: string }) => s.name === server);
    if (i === -1) {
      throw new Error(`Server ${server} not found`);
    }
    let serverId;
    if (servers.data) {
      serverId = servers.data[i].id;
    }
    const { data } = await providerClient.get(`${flixhqBaseUrl}/ajax/episode/sources/${serverId}`);
    const serverUrl: URL = new URL(data.link);

    return await _getsources(serverUrl.href, server);
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
