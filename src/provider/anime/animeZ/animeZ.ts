import * as cheerio from 'cheerio';
import {
  animeZSearchResults,
  animeZSearchSuggestions,
  extractAnimeZInfo,
  getEpisodes,
} from './scraper.js';
import { animeZBaseUrl, animeZClient } from '../../index.js';
import { category, servers } from './types.js';
import { ASource } from '../../../types/types.js';

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

    return {
      succes: true,
      data: data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error ',
    };
  }
}
//// the pagination of episodes are coming in as latest so pick the last visible page the decrement this is for high episode anime
export async function getAnimeEpisodes(
  animeId: string,
  dub: category = category.SUB
) {
  if (!animeId)
    return { success: false, error: ' Missing required params: Id' };

  try {
    const response = await animeZClient.get(`${animeZBaseUrl}/${animeId}`);
    const data$: cheerio.CheerioAPI = cheerio.load(response.data);

    const data = getEpisodes(data$);
    let episodes;
    switch (dub) {
      case category.DUB:
        episodes = data.episodes?.filter(
          (item) => item.category === category.DUB
        );
        break;
      case category.SUB:
        episodes = data.episodes?.filter(
          (item) => item.category === category.SUB
        );
        break;
      default:
        episodes = data.episodes;
    }
    return {
      success: true,
      episodes,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown err',
    };
  }
}

export async function fetchSources(
  episodeId: string,
  server: servers,
  dub: category
) {
  if (!episodeId) {
    return {
      success: false,
      error: 'Missing required params : episodeId!',
    };
  }

  let episodeId2;
  switch (dub) {
    case category.SUB:
      if (episodeId.includes('dub')) {
        episodeId2 = episodeId.replace('dub', '');
      } else {
        episodeId2 = episodeId;
      }
      break;

    case category.DUB:
      if (episodeId.includes('dub')) {
        episodeId2 = episodeId;
      } else {
        const splitter = episodeId.split('/');
        let parts = splitter.at(1)?.split('-');

        if (parts && parts.length > 1) {
          parts[1] = parts[1] + 'dub';
          splitter[1] = parts.join('-');
        }
        episodeId2 = splitter.join('/');
      }

      break;

    default:
      episodeId2 = episodeId;
  }
  console.log(episodeId2);
  try {
    const response = await animeZClient.get(
      `${animeZBaseUrl}/${decodeURIComponent(episodeId2)}`
    );

    const iframe$: cheerio.CheerioAPI = cheerio.load(response.data);
    const iframe: cheerio.SelectorType = 'div#watch-block > div#anime_player ';

    const embedSource: string | null =
      iframe$(iframe).find('iframe').attr('src') || null;

    // const host = iframe$('main#box_right_watch')
    //   .find('input#currentlink')
    //   .attr('value')
    //   ?.split('/')
    //   .at(-1);
    // const serverUrl = iframe$('main#box_right_watch')
    //   .find('input#currentlink')
    //   .attr('value');
    ///the site server buttons look messed up idk why
    const link = iframe$('div#watch-block > div#list_sv')
      .find('a.loadchapter')
      .map(function () {
        return iframe$(this).attr('data-link');
      })
      .get();

    let frame;
    let newEmbedSource;

    if (embedSource) {
      frame = new URL(embedSource);
    }
    if (link && frame) {
      switch (server) {
        case servers.F35:
          newEmbedSource = link[0] + frame?.pathname;
          break;

        case servers.SU57:
          newEmbedSource = link[1] + frame?.pathname;
          break;

        case servers.Typhoon:
          newEmbedSource = frame.href;
          break;
      }

      const serverUrl = new URL(newEmbedSource);

      // console.log(serverUrl.host);
      if (serverUrl.href?.startsWith('https')) {
        try {
          const stream = await animeZClient.get(`${serverUrl.href}`, {
            headers: {
              Referer: `${animeZBaseUrl}/`,
              Authorization: `${serverUrl.host}`,
            },
          });

          const data$: cheerio.CheerioAPI = cheerio.load(stream.data);
          const selector: cheerio.SelectorType = 'div#video-container > video';
          const streamSource =
            `${serverUrl.protocol}${serverUrl.hostname}${data$(selector).find('source').attr('src')}` ||
            null;
          const type = data$(selector).find('source').attr('type') || null;
          const data: ASource = {
            intro: {
              start: null,
              end: null,
            },
            outro: {
              start: null,
              end: null,
            },
            subtitles: [
              {
                url: null,
                lang: null,
              },
            ],
            sources: [
              {
                url: streamSource,
                isM3U8: streamSource?.endsWith('.m3u8') ?? null,
                type: type,
              },
            ],
          };
          return {
            success: true,
            data: data,
            scrapeNote: 'Use proxy ',
            referer: serverUrl.href,
          };
        } catch (error) {
          return {
            success: false,
            error: error instanceof Error ? error.message : 'check embedSource',
          };
        }
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown err',
    };
  }
}
