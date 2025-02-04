import * as cheerio from 'cheerio';
import { extractAnimeZResults, extractAnimeZInfo } from './methods.js';
import { animeZBaseUrl, animeZClient } from '../../index.js';

export async function searchAnime(query: string, page: number = 1) {
  if (!query)
    return {
      success: false,
      error: 'query cannot be empty',
    };

  try {
    const modifiedString = query
      .replace(/season\s*\d+/gi, '') // Remove "season" and numbers after it
      .replace(/[;:]/g, '') // Remove semicolons and colons
      .replace(/\d+/g, '') // Remove all numbers
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

    const data = extractAnimeZResults(data$, selector);

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
export async function searchSuggestions(query: string) {
  if (!query)
    return {
      success: false,
      error: 'query cannot be empty',
    };
  try {
    const modifiedString = query
      .replace(/season\s*\d+/gi, '') // Remove "season" and numbers after it
      .replace(/[;:]/g, '') // Remove semicolons and colons
      .replace(/\d+/g, '') // Remove all numbers
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

    const $: cheerio.CheerioAPI = cheerio.load(res.data);

    const suggestion: {
      id: string | null;
      title: string | null;
      posterImage: string | null;
      alternatives: string | null;
    }[] = [];

    $('li').each((_, element) => {
      suggestion.push({
        id: $(element).find('a').attr('href')?.split('/').at(1)?.trim() || null,
        title: $(element)?.find('img')?.attr('alt') || null,
        posterImage:
          `${animeZBaseUrl}/${$(element).find('img').attr('src')}` || null,
        alternatives:
          $(element)?.find('h4 i').first().text().replace(/;|,/g, ',') || null,
      });
    });

    return {
      anime: suggestion,
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

export async function fetchAnimeInfo(animeId: string) {
  if (!animeId) return { success: false, error: 'Provide an Id' };
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

export async function fetchSources(episodeId: string) {
  if (!episodeId) {
    return {
      success: false,
      error: 'Provide an episodeId!',
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
