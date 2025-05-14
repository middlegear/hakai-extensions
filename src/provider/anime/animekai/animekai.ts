/// Gratitude goes to consumet

import * as cheerio from 'cheerio';
import { gotScraping } from 'got-scraping';
import { animekaiBaseUrl } from '../../../utils/constants';
import { extractAnimeInfo, extractsearchresults } from './scraper';
import axios from 'axios';
import { MegaUp } from '../../../source-extractors/megaup/megaup';
import { ASource, SubOrDub } from '../../../types/types';
import { Info, searchRes, AnimeKaiServers } from './types';
import { providerClient } from '../..';

export const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0',
  Accept: 'text/html, */*; q=0.01',
  'Accept-Language': 'en-US,en;q=0.5',
  'Sec-GPC': '1',
  'Sec-Fetch-Dest': 'empty',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Site': 'same-origin',
  Priority: 'u=0',
  Pragma: 'no-cache',
  'Cache-Control': 'no-cache',
  Referer: `https://animekai.to/`,
  Cookie:
    'usertype=guest; session=hxYne0BNXguMc8zK1FHqQKXPmmoANzBBOuNPM64a; cf_clearance=WfGWV1bKGAaNySbh.yzCyuobBOtjg0ncfPwMhtsvsrs-1737611098-1.2.1.1-zWHcaytuokjFTKbCAxnSPDc_BWAeubpf9TAAVfuJ2vZuyYXByqZBXAZDl_VILwkO5NOLck8N0C4uQr4yGLbXRcZ_7jfWUvfPGayTADQLuh.SH.7bvhC7DmxrMGZ8SW.hGKEQzRJf8N7h6ZZ27GMyqOfz1zfrOiu9W30DhEtW2N7FAXUPrdolyKjCsP1AK3DqsDtYOiiPNLnu47l.zxK80XogfBRQkiGecCBaeDOJHenjn._Zgykkr.F_2bj2C3AS3A5mCpZSlWK5lqhV6jQSQLF9wKWitHye39V.6NoE3RE',
};

export interface SuccessSearchResponse {
  data: searchRes[];
  hasNextPage: boolean;
  currentPage: number;
  lastPage: number;
}
export interface SearchErrorResponse {
  data: [];
  hasNextPage: boolean;
  lastPage: number;
  currentPage: number;
  error: string;
}

export type SearchResponse = SuccessSearchResponse | SearchErrorResponse;
export async function searchanime(query: string, page: number = 1): Promise<SearchResponse> {
  if (0 >= page) {
    page = 1;
  }
  if (!query.trim()) {
    return {
      hasNextPage: false,
      currentPage: 0,
      lastPage: 0,
      data: [],
      error: 'Missing required parameter: query',
    };
  }

  try {
    const response = await gotScraping({
      url: `${animekaiBaseUrl}/browser?keyword=${encodeURIComponent(query.trim())}&page=${page}`,
      responseType: 'text',
    });

    if (!response.body) {
      return {
        hasNextPage: false,
        currentPage: 0,
        lastPage: 0,
        data: [],
        error: 'Error: No response ',
      };
    }

    const data$ = cheerio.load(response.body);
    const { res, searchresults } = extractsearchresults(data$);

    return {
      hasNextPage: res.hasNextPage ?? false,
      currentPage: res.currentPage ?? 0,
      lastPage: res.totalPages ?? 0,
      data: searchresults,
    };
  } catch (error: any) {
    return {
      hasNextPage: false,
      currentPage: 0,
      lastPage: 0,
      data: [],
      error: error.message || 'Unknown error occurred',
    };
  }
}

type episodes = {
  episodeId: string | null;
  episodeNumber: number;
  title: string | null;
};
export interface AnimeInfoSuccess {
  data: Info;
  providerEpisodes: episodes[];
}
export interface AnimeInfoError {
  data: null;
  providerEpisodes: [];
  error: string;
}
export type AnimeInfoKai = AnimeInfoSuccess | AnimeInfoError;
export async function getAnimeInfo(animeId: string): Promise<AnimeInfoKai> {
  if (!animeId.trim()) {
    return {
      error: 'Missing required Params: animeId',
      data: null,
      providerEpisodes: [],
    };
  }

  try {
    // Fetch anime info
    const response = await gotScraping(`${animekaiBaseUrl}/watch/${encodeURIComponent(animeId.trim())}`, {
      headers,
      responseType: 'text',
    });

    if (!response.body) {
      return {
        error: 'Scraper Error: No animeInfo found',
        data: null,
        providerEpisodes: [],
      };
    }

    const data$ = cheerio.load(response.body);
    const { animeInfo } = extractAnimeInfo(data$);

    // Fetch episodes list
    const ani_id = data$('.rate-box#anime-rating').attr('data-id');
    if (!ani_id) {
      return {
        error: 'Scraper Error: anime ID not found',
        data: null,
        providerEpisodes: [],
      };
    }

    const token = new MegaUp().GenerateToken(ani_id);
    const episodesResponse = await gotScraping(`${animekaiBaseUrl}/ajax/episodes/list?ani_id=${ani_id}&_=${token}`, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        ...headers,
      },
      responseType: 'text',
    });

    if (!episodesResponse.body) {
      return {
        error: 'Scraper Error: No Episodes found',
        data: null,
        providerEpisodes: [],
      };
    }

    const episodes$: cheerio.CheerioAPI = cheerio.load(JSON.parse(episodesResponse.body).result);
    const episodes: {
      episodeId: string | null;
      episodeNumber: number;
      title: string | null;
    }[] = [];
    episodes$('div.eplist > ul > li > a').each((i, el) => {
      const episodeIdwithToken = `${animeId}$ep=${episodes$(el).attr('num')}$token=${episodes$(el).attr('token')}` || null;
      const episodeNumber = Number(episodes$(el).attr('num')!);
      const title = episodes$(el).children('span').text().trim() || null;

      episodes.push({
        episodeId: episodeIdwithToken,
        episodeNumber,
        title,
      });
    });

    if (episodes.length === 0) {
      return {
        error: 'Scraper Error: No results found',
        data: null,
        providerEpisodes: [],
      };
    }

    return {
      data: animeInfo,
      providerEpisodes: episodes,
    };
  } catch (error: any) {
    return {
      data: null,
      providerEpisodes: [],
      error: error.message || 'Unknown error occurred',
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
  intro: Intro;
  outro: Outro;
  download: string;
};
export interface SuccessServerInfo {
  data: serverInfo[];
}
export interface ErrorServerInfo {
  data: [];
  error: string;
}
// broken from here
/// i guess puppeteer can do wonders just pass the episodeID with out the token stuff eg like below and wait for ajax links to generate stuff html document called server notice
//
// https://animekai.to/watch/dragon-ball-daima-ypr6#ep=4
export type ServerInfoResponse = SuccessServerInfo | ErrorServerInfo;
export async function getEpisodeServers(episodeId: string, category: SubOrDub): Promise<ServerInfoResponse> {
  if (!episodeId.trim()) {
    return {
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
        ...headers,
      },
    });
    if (!data) {
      return {
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
          intro: {
            start: decodedData?.skip.intro[0],
            end: decodedData?.skip.intro[1],
          },
          outro: {
            start: decodedData?.skip.outro[0],
            end: decodedData?.skip.outro[1],
          },
          download: decodedData.url.replace(/\/e\//, '/download/'),
        });
      }),
    );
    return {
      data: data.result.data,
    };
  } catch (error) {
    return {
      data: [],
      error: error instanceof Error ? ` Request failed: ${error.message}` : 'Contact dev if you see this',
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
export type SourceResponse = SuccessSourceRes | ErrorSourceRes;
export async function getEpisodeSources(
  episodeId: string,
  category: SubOrDub,
  server: AnimeKaiServers = AnimeKaiServers.MegaUp,
): Promise<SourceResponse> {
  if (!episodeId.trim) {
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
      case AnimeKaiServers.MegaUp:
        return {
          headers: { Referer: `${serverUrl.href}` },
          data: (await new MegaUp().extract(serverUrl)) as ASource,
        };

      default:
        return {
          headers: { Referer: `${serverUrl.href}` },
          data: (await new MegaUp().extract(serverUrl)) as ASource,
        };
    }
  }

  try {
    const servers = await getEpisodeServers(episodeId, category);
    const urlIndex = servers.data.findIndex(s => s.name.toLowerCase().includes(server));
    if (urlIndex === -1) {
      return {
        data: null,
        headers: {
          Referer: null,
        },
        error: `Server ${server} not found check the class `,
      };
    }

    const serverUrl: URL = new URL(servers.data[urlIndex].url);

    const sources = await getEpisodeSources(serverUrl.href, category, server);
    if (sources.data) {
      sources.data.intro = servers.data[urlIndex]?.intro as Intro;
      sources.data.outro = servers.data[urlIndex]?.outro as Outro;
    }

    return sources;
  } catch (error) {
    return {
      data: null,
      headers: {
        Referer: null,
      },
      error: error instanceof Error ? error.message : 'Broken ',
    };
  }
}
