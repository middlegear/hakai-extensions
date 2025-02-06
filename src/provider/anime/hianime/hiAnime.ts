import * as cheerio from 'cheerio';
import { Servers, Dubbing } from './types.js';

import {
  extractSearchResults,
  extractAnimeInfo,
  extractEpisodesList,
  extractServerData,
  extractAnimeServerId,
} from './methods.js';
import { zoroClient, zoroSearch, zoroBaseUrl, MegaCloud } from '../../index.js';

export async function searchAnime(query: string, page: number = 1) {
  if (!query)
    return {
      success: false,
      error: 'Please enter a valid id',
    };

  query = query.trim() ? decodeURIComponent(query.trim()) : '';

  if (page === undefined) {
    page = 1;
  }
  try {
    const response = await zoroClient.get(
      `${zoroSearch}?keyword=${query}&page=${page as number}`
    );
    const $data = cheerio.load(response.data);
    const searchSelector: cheerio.SelectorType =
      '.block_area-content .film_list-wrap .flw-item';
    const data = extractSearchResults($data, searchSelector);

    return {
      success: data.success,
      hasNextPage: data.hasNextPage,
      currentPage: data.currentPage,
      totalPages: data.totalPages,
      anime: data.anime,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'unknown',
    };
  }
}

export async function fetchAnimeInfo(animeId: string) {
  if (!animeId)
    return {
      success: false,
      error: 'Provide an animeId!',
    };

  try {
    const response = await zoroClient.get(`${zoroBaseUrl}/${animeId}`);
    const $data: cheerio.CheerioAPI = cheerio.load(response.data);

    const resAnimeInfo = extractAnimeInfo($data);

    const episodesList = await zoroClient.get(
      `${zoroBaseUrl}/ajax/v2/episode/list/${animeId.split('-').pop()}`,
      {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          Referer: `${zoroBaseUrl}/watch/${animeId}`,
        },
      }
    );
    const $episodes: cheerio.CheerioAPI = cheerio.load(episodesList.data.html);
    const episodesSelector: cheerio.SelectorType =
      '.detail-infor-content .ss-list a';
    const resEpisodes = extractEpisodesList($episodes, episodesSelector);

    // const relatedAnimeSeasons = await client.get(`${zoroBaseUrl}/watch/${animeId}`);
    // console.log(resAnimeInfo, resEpisodes);

    return { success: true, animeInfo: resAnimeInfo, episodes: resEpisodes };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : ' Internal server error',
    };
  }
}

export async function fetchServers(episodeId: string) {
  if (!episodeId)
    return {
      success: false,
      error: 'Provide an episodeId!',
    };

  try {
    const newId = episodeId.split('-').pop();

    const response = await zoroClient.get(
      `${zoroBaseUrl}/ajax/v2/episode/servers?episodeId=${newId}`,
      {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          Referer: `${zoroBaseUrl}/watch/?ep=${newId}`,
        },
      }
    );

    const res$: cheerio.CheerioAPI = cheerio.load(response.data.html);

    const data = extractServerData(res$);

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Internal Server Error',
    };
  }
}
////extractors need fixing

export async function fetchEpisodeSources(
  episodeid: string,
  server: Servers,
  language: Dubbing
) {
  try {
    const newId = episodeid.split('-').pop();

    const response = await zoroClient.get(
      `${zoroBaseUrl}/ajax/v2/episode/servers?episodeId=${newId}`,
      {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          Referer: `${zoroBaseUrl}/watch/?ep=${newId}`,
        },
      }
    );
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
      const {
        data: { link },
      } = await zoroClient.get(
        `${zoroBaseUrl}//ajax/v2/episode/sources?id=${mediadataId}`,
        {
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            Referer: `${zoroBaseUrl}/watch/?ep=${newId}`,
          },
        }
      );
      // console.log(link, mediadataId); looks like a crude implementation
      // const id = link.split('/').at(-1);
      // console.log(link);
      // const sources = puppeteer(id);
      const sources = await new MegaCloud().extract(link);
      return {
        sucess: true,
        data: sources,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Could not retrive the data id for the selected anime',
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'No data found',
    };
  }
}
