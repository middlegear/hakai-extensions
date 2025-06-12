import * as cheerio from 'cheerio';
import axios from 'axios';
import { flixhqBaseUrl } from '../../../utils/constants';
import { scrapeMediaInfo, scrapeSearch } from './scraper';
import { providerClient } from '../../../config/clients';
import { StreamingServers } from './types';
import VidCloud from '../../../source-extractors/vidcloud';
import MixDrop from '../../../source-extractors/mixdrop';

export async function _search(query: string, page: number = 1) {
  if (!query) {
    return { data: [], error: 'Missing required params: query!' };
  }
  try {
    const reponse = await providerClient.get(`${flixhqBaseUrl}/search/${query.replace(/[\W_]+/g, '-')}?page=${page}`);
    const data$ = cheerio.load(reponse.data);
    const res = scrapeSearch(data$);
    return res;
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unknown err' };
  }
}

export async function _getInfo(mediaId: string) {
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
    return { res, episodes };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unknown err' };
  }
}

export async function _getServers(episodeId: string, mediaId: string) {
  if (!episodeId.startsWith(flixhqBaseUrl + '/ajax') && !mediaId.includes('movie'))
    episodeId = `${flixhqBaseUrl}/ajax/v2/episode/servers/${episodeId}`;
  else episodeId = `${flixhqBaseUrl}/ajax/movie/episodes/${episodeId}`;

  try {
    const { data } = await providerClient.get(episodeId);
    const data$ = cheerio.load(data);

    const servers = data$('.nav > li')
      .map((i, el) => {
        const server = {
          name: mediaId.includes('movie')
            ? data$(el).find('a').attr('title')!.toLowerCase()
            : data$(el).find('a').attr('title')!.slice(6).trim().toLowerCase(),
          url: `${flixhqBaseUrl}/${mediaId}.${
            !mediaId.includes('movie') ? data$(el).find('a').attr('data-id') : data$(el).find('a').attr('data-linkid')
          }`.replace(
            !mediaId.includes('movie') ? /\/tv\// : /\/movie\//,
            !mediaId.includes('movie') ? '/watch-tv/' : '/watch-movie/',
          ),
        };

        return server;
      })
      .get();
    return servers;
  } catch (err) {
    throw new Error((err as Error).message);
  }
}
export async function _getsources(episodeId: string, mediaId: string, server: StreamingServers = StreamingServers.Upcloud) {
  if (episodeId.startsWith('http')) {
    const serverUrl = new URL(episodeId);
    switch (server) {
      case StreamingServers.Mixdrop:
        return {
          headers: { Referer: serverUrl.href },
          sources: await new MixDrop().extract(serverUrl),
        };
      case StreamingServers.VidCloud:
        return {
          headers: { Referer: serverUrl.href },
          ...(await new VidCloud().extract(serverUrl, true, flixhqBaseUrl)),
        };
      case StreamingServers.Upcloud:
        return {
          headers: { Referer: serverUrl.href },
          ...(await new VidCloud().extract(serverUrl, undefined, flixhqBaseUrl)),
        };
      default:
        return {
          headers: { Referer: serverUrl.href },
          sources: await new MixDrop().extract(serverUrl),
        };
    }
  }
  try {
    const servers = await _getServers(episodeId, mediaId);

    const i = servers.findIndex(s => s.name === server);

    if (i === -1) {
      throw new Error(`Server ${server} not found`);
    }

    const { data } = await providerClient.get(
      `${flixhqBaseUrl}/ajax/episode/sources/${servers[i].url.split('.').slice(-1).shift()}`,
    );

    const serverUrl: URL = new URL(data.link);

    return await _getsources(serverUrl.href, mediaId, server);
  } catch (error) {
    throw new Error((error as Error).message);
  }
}
