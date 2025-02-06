import * as cheerio from 'cheerio';

import type { animeInfo } from './types.js';

import { Dubbing } from '../hianime/types.js';
import { animeZBaseUrl } from '../../index.js';

export function animeZSearchResults(
  $: cheerio.CheerioAPI,
  selector: cheerio.SelectorType
) {
  const anime: {
    id: string | null;
    title: string | null;
    posterImage: string | null;
  }[] = [];
  $(selector).each((_, element) => {
    anime.push({
      id: $(element).find('a').attr('href')?.split('/').at(1)?.trim() || null,
      title: $(element)?.find('a')?.attr('title') || null,
      posterImage:
        `${animeZBaseUrl}/${$(element)
          .find('div.Image > figure > img')
          .attr('src')}` || null,
      // episodes:
      //   Number(
      //     $(element)
      //       .find('div.Image > span.mli-eps')
      //       .text()
      //       .trim()
      //       .split('-')
      //       .at(0)
      //   ) || null,
      // dub: $(element)
      //   .find('div.Image > span.mli-eps')
      //   .text()
      //   .trim()
      //   .split('-')
      //   .at(1)
      //   ? Dubbing.Dub
      //   : Dubbing.Sub,
    });
  });
  let hasNextPage, totalPages, currentPage;

  const pageSelector: cheerio.SelectorType =
    ' div.Bot.text-center > nav > ul.pagination';
  currentPage =
    Number($(pageSelector).find('li.page-item.active > a.page-link').text()) ||
    1;
  totalPages =
    Number(
      $(pageSelector)
        .find('li.page-item >a.page-link')
        .last()
        .attr('href')
        ?.split('=')
        .at(-1)
        ?.split('#')
        .at(0)
    ) || 1;
  hasNextPage = totalPages > 1 ? true : false;
  // const pagination = {
  //   hasNextPage,
  //   currentPage,
  //   totalPages,
  // };
  return {
    hasNextPage,
    currentPage,
    totalPages,
    anime,
  };
}
export function animeZSearchSuggestions($: cheerio.CheerioAPI) {
  const suggestion: {
    id: string | null;
    title: string | null;
    posterImage: string | null;
    altName: string | null;
  }[] = [];

  $('li').each((_, element) => {
    suggestion.push({
      id: $(element).find('a').attr('href')?.split('/').at(1)?.trim() || null,
      title: $(element)?.find('img')?.attr('alt') || null,
      posterImage:
        `${animeZBaseUrl}/${$(element).find('img').attr('src')}` || null,
      altName:
        $(element)?.find('h4 i').first().text().replace(/;|,/g, ',') || null,
    });
  });

  return {
    anime: suggestion,
  };
}
export function extractAnimeZInfo($: cheerio.CheerioAPI) {
  const selector1: cheerio.SelectorType = ' div.Content > div.TpRwCont';
  const animeInfo: animeInfo = {
    id: null,
    title: null,
    posterImage: null,
    // href: null,
  };

  animeInfo.title = $(selector1).find('h2').text().trim() || null;
  animeInfo.posterImage =
    `${animeZBaseUrl}/${$(selector1)
      .find('img.attachment-img-mov-md.size-img-mov-md.wp-post-image')
      .attr('src')}` || null;
  const href = $(selector1).find('a.text-info').attr('href');
  // animeInfo.href = href || null;
  animeInfo.id = href?.split('/').at(-2) || null;

  return {
    animeInfo,
  };
}

export function getEpisodes($: cheerio.CheerioAPI) {
  const episodes: {
    id: string | null;
    number: string | null;
    // category: string | null;
  }[] = [];

  const episodesSelector: cheerio.SelectorType =
    'ul#list_chapter_id_detail > li.wp-manga-chapter  ';
  $(episodesSelector).each((_, element) => {
    episodes.push({
      id: $(element).find('a').attr('href')?.slice(1) || null,

      number: $(element).find('a').text().trim() || null,
      //   category: $(element).find('a').text().split('-').includes('Dub')
      //     ? //!includes(dub) for sub boolean
      //       Dubbing.Dub
      //     : Dubbing.Sub || null,
    });
  });
  episodes.reverse();
  return {
    episodes,
  };
}
