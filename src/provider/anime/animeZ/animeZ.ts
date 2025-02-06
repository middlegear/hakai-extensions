import * as cheerio from 'cheerio';
import {
  animeZSearchResults,
  animeZSearchSuggestions,
  extractAnimeZInfo,
  getEpisodes,
} from './scraper.js';
import { animeZBaseUrl, animeZClient } from '../../index.js';
import { Dubbing } from '../hianime/types.js';

async function searchAnime(query: string, page: number) {
  if (!query)
    return {
      success: false,
      error: 'Missing required params : query',
    };

  try {
    const modifiedString = query
      .replace(/season\s*\d+/gi, '')
      .replace(/[;:]/g, '')
      .replace(/\d+/g, '')
      .trim();
    const response = await animeZClient.get(
      `${animeZBaseUrl}/?act=search&f[status]=all&f[sortby]=lastest-chap&f[keyword]=${modifiedString}&&pageNum=${page}#pages`,
      {
        headers: {
          Referer: `${animeZBaseUrl}/?act=search&f[status]=all&f[sortby]=lastest-chap&f[keyword]=${query}&&pageNum=${page}`,
        },
      }
    );

    const data$: cheerio.CheerioAPI = cheerio.load(response.data);
    const selector: cheerio.SelectorType =
      'main > section > ul.MovieList.Rows.AX.A06.B04.C03.E20 > li.TPostMv';

    const data = animeZSearchResults(data$, selector);

    return {
      hasNextPage: data.hasNextPage,
      totalPages: data.totalPages,
      currentPage: data.currentPage,
      anime: data.anime,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'check the URL youre scraping from ',
    };
  }
}
async function searchSuggestions(query: string) {
  if (!query)
    return {
      success: false,
      error: 'Missing required params : query',
    };
  try {
    const modifiedString = query
      .replace(/season\s*\d+/gi, '')
      .replace(/[;:]/g, '')
      .replace(/\d+/g, '')
      .trim();

    const res = await animeZClient.get(
      `
      ${animeZBaseUrl}/?act=ajax&code=search_manga&keyword=${modifiedString}`,
      {
        headers: {
          Referer: `${animeZBaseUrl}/?act=search&f[status]=all&f[sortby]=lastest-chap&f[keyword]=${modifiedString}`,
        },
      }
    );

    const data$: cheerio.CheerioAPI = cheerio.load(res.data);
    const data = animeZSearchSuggestions(data$);

    return {
      success: true,
      data: data.anime,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'check the URL youre scraping from ',
    };
  }
}
export async function matchingSearcResponse(query: string, page: number) {
  try {
    const response = await Promise.all([
      searchAnime(query, page),
      searchSuggestions(query),
    ]);

    const [search, suggestion] = response;

    const matchingresults = search.anime?.map((animeItem) => {
      const matchingSuggestion = suggestion.data?.find(
        (animesuggestion) => animesuggestion.id === animeItem.id
      );

      return {
        ...animeItem,
        altName: matchingSuggestion?.altName || null,
      };
    });

    return {
      success: true,
      hasNextPage: search.hasNextPage,
      currentPage: search.currentPage,
      totalPages: search.totalPages,
      data: matchingresults,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown err',
    };
  }
}

export async function fetchAnimeInfo(animeId: string) {
  if (!animeId)
    return { success: false, error: ' Missing required params: Id' };
  try {
    const response = await animeZClient.get(`${animeZBaseUrl}/${animeId}`);
    const data$: cheerio.CheerioAPI = cheerio.load(response.data);

    const data = extractAnimeZInfo(data$);

    return data;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error ',
    };
  }
}
export async function fetchEpisodes(animeId: string, dub: Dubbing) {
  if (!animeId)
    return { success: false, error: ' Missing required params: Id' };

  try {
    const response = await animeZClient.get(`${animeZBaseUrl}/${animeId}`);
    const data$: cheerio.CheerioAPI = cheerio.load(response.data);

    const data = getEpisodes(data$);

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown err',
    };
  }
}

export async function fetchSources(episodeId: string) {
  if (!episodeId) {
    return {
      success: false,
      error: 'Missing required params : episodeId!',
    };
  }
  try {
    const response = await animeZClient.get(
      `${animeZBaseUrl}/${decodeURIComponent(episodeId)}`
    );

    const iframe$: cheerio.CheerioAPI = cheerio.load(response.data);
    const iframe: cheerio.SelectorType = 'div#watch-block > div#anime_player ';

    const embedSource: string | null =
      iframe$(iframe).find('iframe').attr('src') || null;

    const host = iframe$('main#box_right_watch')
      .find('input#currentlink')
      .attr('value')
      ?.split('/')
      .at(-1);
    const serverUrl = iframe$('main#box_right_watch')
      .find('input#currentlink')
      .attr('value');

    if (embedSource?.startsWith('https')) {
      try {
        const stream = await animeZClient.get(`${embedSource}`, {
          headers: {
            Referer: `${animeZBaseUrl}/`,
            Authorization: `${host}`,
          },
        });

        const data$: cheerio.CheerioAPI = cheerio.load(stream.data);
        const selector: cheerio.SelectorType = 'div#video-container > video';
        const streamSource =
          `${serverUrl}${data$(selector).find('source').attr('src')}` || null;
        const type = data$(selector).find('source').attr('type') || null;
        return {
          success: true,
          source: streamSource,
          type: type,
          referer: embedSource,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'check embedSource',
        };
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown err',
    };
  }
}
