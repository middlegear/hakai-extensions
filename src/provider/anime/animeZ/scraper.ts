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
  };

  animeInfo.title = $(selector1).find('h2').text().trim() || null;
  animeInfo.posterImage =
    `${animeZBaseUrl}/${$(selector1)
      .find('img.attachment-img-mov-md.size-img-mov-md.wp-post-image')
      .attr('src')}` || null;
  const href = $(selector1).find('a.text-info').attr('href');

  animeInfo.id = href?.split('/').at(-2) || null;
  const episodes: {
    hasDub: boolean;
    hasSub: boolean;
  }[] = [];

  const episodesSelector: cheerio.SelectorType =
    'ul#list_chapter_id_detail > li.wp-manga-chapter';

  $(episodesSelector).each((_, element) => {
    const text = $(element).find('a').text();

    episodes.push({
      hasDub: text.includes('Dub'),
      hasSub: !text.includes('Dub'),
    });
  });

  const hasDub = episodes.some((item) => item.hasDub);
  const hasSub = episodes.some((item) => item.hasSub);

  return {
    animeInfo,
    hasDub,
    hasSub,
  };
}

export function getEpisodes($: cheerio.CheerioAPI) {
  const episodes: {
    episodeId: string | null;
    number: number | null;
    category: string | null;
  }[] = [];

  const episodesSelector: cheerio.SelectorType =
    'ul#list_chapter_id_detail > li.wp-manga-chapter  ';
  $(episodesSelector).each((_, element) => {
    episodes.push({
      episodeId: $(element).find('a').attr('href')?.slice(1) || null,
      number:
        Number($(element).find('a').text().trim().split('-').at(0)) || null,
      category: $(element).find('a').text().split('-').includes('Dub')
        ? Dubbing.Dub
        : Dubbing.Sub || null,
    });
  });
  episodes.reverse();
  return {
    episodes,
  };
}
