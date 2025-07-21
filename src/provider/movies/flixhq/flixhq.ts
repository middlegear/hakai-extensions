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
  episodes: [];
  error: string;
}
export type FLixInfoRes = SuccessFlixInfo | ErrorFlixInfo;
export async function _getInfo(mediaId: string): Promise<FLixInfoRes> {
  if (!mediaId) {
    return { data: null, episodes: [], error: 'Missing required parameter mediaId!' };
  }
  const newId = mediaId.replace('-', '/');
  const finalMediaId = `${flixhqBaseUrl}/${newId}`;
  console.log(finalMediaId);

  try {
    const response = await providerClient.get(finalMediaId);
    const data$ = cheerio.load(response.data);
    const res = scrapeMediaInfo(data$);

    const uid = data$('.watch_block').attr('data-id')!;
    console.log(uid);

    const ajaxReqUrl = (id: string, type: string, isSeasons: boolean = false) =>
      `${flixhqBaseUrl}/ajax/${type === 'movie' ? type : `v2/${type}`}/${isSeasons ? 'seasons' : 'episodes'}/${id}`;
    let episodes:
      | { episodeId: string; title: string; number: number; season: number }[]
      | { episodeId: string; title: string | null }[] = [];
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
              episodeId: `episode-${$$$(el).find('a').attr('id')!.split('-')[1]}`,
              title: $$$(el).find('a').attr('title')!,
              number: parseInt($$$(el).find('a').attr('title')!.split(':')[0].slice(3).trim()),
              season: season,
            };
            episodes?.push(episode);
          })
          .get();
        season++;
      }
      //  url: `${flixhqBaseUrl}/ajax/v2/episode/servers/${$$$(el).find('a').attr('id')!.split('-')[1]}`, for episodes
      //  url: `${flixhqBaseUrl}/ajax/movie/episodes/${uid} for movies
    } else {
      episodes = [
        {
          episodeId: `movie-${uid}`,
          title: res.title,
        },
      ];
    }
    return { data: res, episodes: episodes as FLixepisodes };
  } catch (error) {
    return { data: null, episodes: [], error: error instanceof Error ? error.message : 'Unknown err' };
  }
}
interface SuccessFlixServerRes {
  data: ServerRes[];
}
interface ErrorFlixSeverRes {
  data: [];
  error: string;
}
export type FlixServerRes = SuccessFlixServerRes | ErrorFlixSeverRes;
export async function _getServers(episodeId: string): Promise<FlixServerRes> {
  if (!episodeId) {
    return { data: [], error: 'Missing required params episodeId!' };
  }

  if (episodeId.includes('movie')) episodeId = `${flixhqBaseUrl}/ajax/movie/episodes/${episodeId.split('-').at(1)}`;
  else episodeId = `${flixhqBaseUrl}/ajax/v2/episode/servers/${episodeId.split('-').at(1)}`;

  try {
    const { data } = await providerClient.get(episodeId);
    const data$ = cheerio.load(data);

    const servers = data$('.nav > li')
      .map((i, el) => {
        const server = {
          name: episodeId.includes('movie')
            ? data$(el).find('a').attr('title')!.toLowerCase().trim()
            : data$(el).find('a').attr('title')!.slice(6).toLowerCase().trim(),

          id: Number(data$(el).find('a').attr('data-id') || data$(el).find('a').attr('data-linkid')),
        };

        return server;
      })
      .get();
    return { data: servers as ServerRes[] };
  } catch (error) {
    return { data: [], error: error instanceof Error ? error.message : 'Unknown Error' };
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
  headers: { Referer: null };
  error: string;
}

export type FLixSourcesRes = SuccessFlixSourceRes | ErrorFlixSourcesRes;
export async function _getsources(episodeId: string, server: StreamingServers): Promise<FLixSourcesRes> {
  if (episodeId.includes('embed')) {
    const serverUrl = new URL(episodeId);

    switch (server) {
      case StreamingServers.VidCloud:
        return {
          headers: { Referer: `${serverUrl.origin}/` },
          data: (await new VidCloud().extract(serverUrl)) as ExtractedData,
        };
      case StreamingServers.Upcloud:
        return {
          headers: { Referer: `${serverUrl.origin}/` },
          data: (await new VidCloud().extract(serverUrl)) as ExtractedData,
        };
      case StreamingServers.Akcloud:
        return {
          headers: { Referer: `${serverUrl.origin}/` },
          data: (await new VidCloud().extract(serverUrl)) as ExtractedData,
        };
      default:
        StreamingServers.VidCloud;
        return {
          headers: { Referer: `${serverUrl.origin}/` },
          data: (await new VidCloud().extract(serverUrl)) as ExtractedData,
        };
    }
  }
  try {
    const servers = await _getServers(episodeId);

    if ('error' in servers) {
      throw new Error(servers.error).message;
    }

    if (Array.isArray(servers.data) && servers.data.length > 0) {
      const index = servers.data.findIndex(s => s.name === server);
      if (index === -1) {
        throw new Error(`Server ${server} not found`);
      }
      const serverId = servers.data[index].id;
      const { data } = await providerClient.get(`${flixhqBaseUrl}/ajax/episode/sources/${serverId}`);

      const serverUrl: URL = new URL(data.link);
      return await _getsources(serverUrl.href, server);
    } else {
      throw new Error(`Server ${server} not found or data invalid`).message;
    }
  } catch (error) {
    return { data: null, headers: { Referer: null }, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
