import * as cheerio from 'cheerio';

import {
  anitaku_extractAnimeInfo,
  anitakuExtractDownloadSrc,
  anitakuExtractEpisodes,
  anitakuExtractServers,
  extractAnitakuSearchResults,
} from './methods.js';

import { type anitakuAnimeServers, anitakuServers } from './types.js';

import axios from 'axios';
import {
  anitakuClient,
  anitakuSearchUrl,
  anitakuInfoUrl,
  anitakuAjaxLoadEpisodes,
  anitaku_USER_AGENT_HEADER,
  ACCEPT_ENCODING,
  anitakuBaseUrl,
  GogoServer,
  StreamWish,
  MP4Upload,
  VidHide,
} from '../../index.js';

export async function searchAnime(query: string, page: number) {
  if (!query)
    return {
      success: false,
      error: 'Missing required params : query',
    };
  try {
    const response = await anitakuClient.get(
      `${anitakuSearchUrl}?keyword=${encodeURIComponent(query)}&page=${page}`,
    );
    const data$: cheerio.CheerioAPI = cheerio.load(response.data);
    const resSelector: cheerio.SelectorType = 'div.last_episodes > ul.items > li';

    const data = extractAnitakuSearchResults(resSelector, data$);
    return {
      success: true,
      hasNextPage: data.hasNextPage,
      currentPage: data.currentPage,
      totalPages: data.totalPages,
      anime: data.resSearch,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unable to find search anime check the domain',
    };
  }
}

export async function fetchAnimeInfo(animeId: string) {
  if (!animeId)
    return {
      success: false,
      error: 'Missing required params: AnimeId!',
    };
  try {
    const response = await anitakuClient.get(`${anitakuInfoUrl}/${animeId}`);

    const data$: cheerio.CheerioAPI = cheerio.load(response.data);

    const infoSelector: cheerio.SelectorType = 'div.main_body > div.anime_info_body ';

    const resAnimeInfo = anitaku_extractAnimeInfo(data$, infoSelector);
    const MovieId: cheerio.SelectorType =
      'div.anime_info_body > div.anime_info_episodes > div.anime_info_episodes_next';

    const movieId = Number(data$(MovieId).find('input#movie_id.movie_id').attr('value')) || null;

    const numberOfepisodesSelector: cheerio.SelectorType =
      'div.main_body > div.anime_video_body > ul#episode_page';
    const totalEps = data$(numberOfepisodesSelector).find('li > a.active').attr('ep_end') || null;

    const resEpisodes = await axios.get(
      `${anitakuAjaxLoadEpisodes}?ep_start=0&ep_end=${totalEps}&id=${movieId}&default_ep=0&alias=${animeId}`,
      {
        headers: {
          accept: 'text/html, */*; q=0.01',
          'User-Agent': anitaku_USER_AGENT_HEADER,
          'Content-Encoding': ACCEPT_ENCODING,
        },
      },
    );

    const resHtmlEpisodes$: cheerio.CheerioAPI = cheerio.load(resEpisodes.data);

    const episodesData = anitakuExtractEpisodes(resHtmlEpisodes$);

    return {
      success: true,
      data: resAnimeInfo.animeInfo,
      episodes: episodesData,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown Error',
    };
  }
}

export async function fetchServers(episodeId: string) {
  if (!episodeId)
    return {
      success: false,
      error: 'Missing required params: episodeId',
    };
  try {
    const response = await anitakuClient.get(`${anitakuBaseUrl}/${episodeId}`, {
      headers: { Referer: `${anitakuBaseUrl}/` },
    });

    const data$: cheerio.CheerioAPI = cheerio.load(response.data);
    const selector: cheerio.SelectorType = 'div.anime_video_body > div.anime_muti_link > ul > li ';

    const data = anitakuExtractServers(data$, selector);
    const dowloads = anitakuExtractDownloadSrc(data$);
    return {
      success: true,
      server: data,
      download: dowloads.sources.downloadUrl,
      iframe: dowloads.sources.iframe,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'No data found',
    };
  }
}

/// extractors remaining this will need lots of work

export async function fetchEpisodeSources(episodeId: string, server: anitakuAnimeServers) {
  if (!episodeId) {
    return {
      success: false,
      error: 'Missing required params: episodeId',
    };
  }

  try {
    const response = await anitakuClient.get(`${anitakuBaseUrl}/${episodeId}`, {
      headers: { Referer: `${anitakuBaseUrl}/` },
    });
    const data$: cheerio.CheerioAPI = cheerio.load(response.data);

    let serverUrl: URL | null;

    try {
      switch (server) {
        case anitakuServers.GogoServer: {
          serverUrl = new URL(
            `${data$('div.anime_video_body > div.anime_muti_link > ul > li.vidcdn')
              ?.find('a')
              ?.attr('data-video')}`,
          );
          break;
        }
        case anitakuServers.Doodstream: {
          serverUrl = new URL(
            `${data$('div.anime_video_body > div.anime_muti_link > ul > li.doodstream')
              ?.find('a')
              ?.attr('data-video')}`,
          );
          break;
        }
        case anitakuServers.MP4Upload: {
          serverUrl = new URL(
            `${data$('div.anime_video_body > div.anime_muti_link > ul > li.mp4upload')
              ?.find('a')
              ?.attr('data-video')}`,
          );
          break;
        }
        case anitakuServers.StreamWish: {
          serverUrl = new URL(
            `${data$('div.anime_video_body > div.anime_muti_link > ul > li.streamwish')
              ?.find('a')
              ?.attr('data-video')}`,
          );
          break;
        }
        case anitakuServers.VidHide: {
          serverUrl = new URL(
            `${data$('div.anime_video_body > div.anime_muti_link > ul > li.vidhide')
              ?.find('a')
              ?.attr('data-video')}`,
          );

          break;
        }
        // /////this seems like the one default
        case anitakuServers.Vidstreaming: {
          serverUrl = new URL(
            `${data$('div.anime_video_body > div.anime_muti_link > ul > li.anime')
              ?.find('a')
              ?.attr('data-video')}`,
          );
          break;
        }

        default: {
          serverUrl = new URL(
            `${data$('div.anime_video_body_watch_items.load > div.play-video')?.find('iframe')?.attr('src')}`,
          );
          break;
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unable to find serverURL ',
      };
    }

    if (serverUrl.href != undefined && serverUrl.href != null) {
      const serverID = new URL(serverUrl);

      switch (server) {
        case anitakuServers.GogoServer: {
          const data = GogoServer(serverID);
          return data;
        }
        case anitakuServers.StreamWish: {
          const data = StreamWish(serverID);
          return data;
        }
        case anitakuServers.MP4Upload: {
          const data = MP4Upload(serverID);
          return data;
        }
        case anitakuServers.Doodstream: {
          return {
            success: false,
            error: console.error('Avoid this source use Href '),
            reason: 'Method not implemented embed the href buddy ',
            href: serverID.href,
          };
        }
        case anitakuServers.VidHide: {
          const data = VidHide(serverID);
          return data;
        }
        default: {
          anitakuServers.Vidstreaming;
          const data = GogoServer(serverID);
          return data;
        }
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : ' no data check the episodeId and serverId ',
    };
  }
}
