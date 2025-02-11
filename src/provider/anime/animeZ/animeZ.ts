import * as cheerio from 'cheerio';
import { animeZSearchResults, animeZSearchSuggestions, extractAnimeZInfo, getEpisodes } from './scraper.js';
import { animeZBaseUrl, animeZClient } from '../../index.js';
import { category, servers } from './types.js';
import { ASource } from '../../../types/types.js';
import axios from 'axios';

async function searchAnime(query: string, page: number) {
  if (!query) {
    return {
      success: false,
      status: 400,
      error: 'Missing required parameter: query',
      data: [],
    };
  }

  try {
    const modifiedString = query
      .replace(/season\s*\d+/gi, '')
      .replace(/[;:]/g, '')
      .replace(/\d+/g, '')
      .trim();

    const url = `${animeZBaseUrl}/?act=search&f[status]=all&f[sortby]=lastest-chap&f[keyword]=${modifiedString}&&pageNum=${page}#pages`;
    const referer = `${animeZBaseUrl}/?act=search&f[status]=all&f[sortby]=lastest-chap&f[keyword]=${query}&&pageNum=${page}`;

    const response = await animeZClient.get(url, {
      headers: { Referer: referer },
    });

    if (!response.data) {
      return {
        success: false,
        status: 204,
        error: 'Received empty response from the server.',
        data: [],
      };
    }

    const $ = cheerio.load(response.data);
    const selector = 'main > section > ul.MovieList.Rows.AX.A06.B04.C03.E20 > li.TPostMv';

    const data = animeZSearchResults($, selector);

    if (!data || !data.anime || data.anime.length === 0) {
      return {
        hasNextPage: false,
        totalPages: 0,
        currentPage: page,
        anime: [],
        message: 'Scraping error.',
      };
    }

    return {
      success: true,
      status: 200,
      hasNextPage: data.hasNextPage,
      totalPages: data.totalPages,
      currentPage: data.currentPage,
      data: data.anime,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        status: error.response?.status || 500,
        error: `Request failed: ${error.message}`,
        data: [],
      };
    }

    return {
      success: false,
      status: 500,
      error: error instanceof Error ? error.message : 'Contac dev is you see this.',
      data: [],
    };
  }
}

async function searchSuggestions(query: string) {
  if (!query)
    return {
      success: false,
      status: 400,
      data: [],
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
      },
    );
    if (!res.data) {
      return {
        success: false,
        status: 204,
        error: 'Received empty response from server',
        data: [],
      };
    }

    const data$: cheerio.CheerioAPI = cheerio.load(res.data);
    const data = animeZSearchSuggestions(data$);
    if (!data) {
      return {
        success: false,
        error: 'Scraping Error',
        data: [],
      };
    }
    return {
      success: true,
      status: 200,
      data: data.anime,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        status: error.response?.status || 500,
        data: [],
        error: `Request failed ${error.message}`,
      };
    }
    return {
      success: false,
      status: 500,
      error: error instanceof Error ? error.message : 'Contact dev if you see this',
    };
  }
}
export async function matchingSearcResponse(query: string, page: number) {
  if (!query.trim()) {
    return {
      success: false,
      status: 400,
      error: 'Missing required parameter: query',
      data: [],
    };
  }

  try {
    const [searchResult, suggestionResult] = await Promise.allSettled([
      searchAnime(query, page),
      searchSuggestions(query),
    ]);

    const search = searchResult.status === 'fulfilled' ? searchResult.value : null;
    const suggestion = suggestionResult.status === 'fulfilled' ? suggestionResult.value : null;

    const searchData = search?.data || [];
    const suggestionData = suggestion?.data || [];

    const matchingResults = searchData.map(animeItem => {
      const matchingSuggestion = suggestionData.find(animesuggestion => animesuggestion.id === animeItem.id);

      return {
        ...animeItem,
        altName: matchingSuggestion?.altName || null,
      };
    });

    return {
      success: true,
      hasNextPage: search?.hasNextPage || false,
      currentPage: search?.currentPage || page,
      totalPages: search?.totalPages || 0,
      data: matchingResults,
    };
  } catch (error: any) {
    return {
      success: false,
      data: [],
      status: error.response?.status || 500,
      error: error.message || 'An unexpected error occurred.',
    };
  }
}

export async function fetchAnimeInfo(animeId: string) {
  if (!animeId)
    return {
      success: false,
      status: 400,
      error: ' Missing required params: Id',
      data: null,
    };
  try {
    const response = await animeZClient.get(`${animeZBaseUrl}/${animeId}`);
    const data$: cheerio.CheerioAPI = cheerio.load(response.data);

    const data = extractAnimeZInfo(data$);
    if (!data.animeInfo || !data.hasDub || data.hasSub) {
      return {
        success: false,
        error: 'Scraping Error',
        data: null,
      };
    }
    if (!response.data) {
      return {
        success: false,
        status: 204,
        error: 'Received empty response from server',
        data: [],
      };
    }
    return {
      success: true,
      status: 200,
      data: data,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        status: error.response?.status || 500,
        error: `Request failed ${error.message}`,
        data: null,
      };
    }
    return {
      success: false,
      status: 500,
      data: null,
      error: error instanceof Error ? error.message : 'Contact dev if you see this ',
    };
  }
}
//// the pagination of episodes are coming in as latest fix later
export async function getAnimeEpisodes(animeId: string, dub: category = category.SUB) {
  if (!animeId)
    return {
      success: false,
      data: [],
      status: 400,
      error: ' Missing required params: Id',
    };

  try {
    const response = await animeZClient.get(`${animeZBaseUrl}/${animeId}`);
    const data$: cheerio.CheerioAPI = cheerio.load(response.data);

    const data = getEpisodes(data$);
    if (!data.episodes) {
      return {
        success: true,
        data: [],
        error: 'Scraping errors',
      };
    }

    if (!response.data) {
      return {
        success: false,
        status: 204,
        error: 'Received empty response from server',
        data: [],
      };
    }
    let episodes;
    switch (dub) {
      case category.DUB:
        episodes = data.episodes?.filter(item => item.category === category.DUB);
        break;
      case category.SUB:
        episodes = data.episodes?.filter(item => item.category === category.SUB);
        break;
      default:
        episodes = data.episodes;
    }

    return {
      success: true,
      status: 200,
      data: episodes,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Contact dev if you see this',
    };
  }
}

export async function fetchSources(episodeId: string, server: servers, dub: category) {
  if (!episodeId) {
    return {
      success: false,
      status: 400,
      data: null,
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
    const response = await animeZClient.get(`${animeZBaseUrl}/${decodeURIComponent(episodeId2)}`);

    const iframe$: cheerio.CheerioAPI = cheerio.load(response.data);
    const iframe: cheerio.SelectorType = 'div#watch-block > div#anime_player ';

    if (!response.data) {
      return {
        success: false,
        status: 204,
        error: 'Received empty response from server',
        data: null,
      };
    }

    const embedSource: string | null = iframe$(iframe).find('iframe').attr('src') || null;

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

      if (serverUrl.href?.startsWith('https')) {
        try {
          const stream = await animeZClient.get(`${serverUrl.href}`, {
            headers: {
              Referer: `${animeZBaseUrl}/`,
              Authorization: `${serverUrl.host}`,
            },
          });
          if (!stream.data) {
            return {
              success: false,
              status: 204,
              error: 'Received empty response from server',
              data: null,
            };
          }
          const data$: cheerio.CheerioAPI = cheerio.load(stream.data);
          const selector: cheerio.SelectorType = 'div#video-container > video';
          const streamSource =
            `${serverUrl.protocol}${serverUrl.hostname}${data$(selector).find('source').attr('src')}` || null;
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
                url: streamSource ?? null,
                isM3U8: streamSource?.endsWith('.m3u8') ?? null,
                type: type ?? null,
              },
            ],
          };
          return {
            success: true,
            status: 200,
            data: data,
            Note: 'Use proxy ',
            referer: serverUrl.href,
          };
        } catch (error) {
          if (axios.isAxiosError(error)) {
            return {
              success: false,
              status: error.response?.status || 500,
              error: `Request failed ${error.message}`,
              data: null,
            };
          }
          return {
            success: false,
            status: 500,
            data: null,
            error: error instanceof Error ? error.message : 'contact dev ',
          };
        }
      }
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        status: error.response?.status || 500,
        error: `Request failed ${error.message}` || 'Unknown error',
        data: null,
      };
    }
    return {
      success: false,
      status: 500,
      data: null,
      error: error instanceof Error ? error.message : 'Contact dev if you see this',
    };
  }
}
