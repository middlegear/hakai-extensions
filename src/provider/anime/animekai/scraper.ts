import * as cheerio from 'cheerio';
import { Info } from './types';

export function extractsearchresults($: cheerio.CheerioAPI) {
  const searchresults: {
    id: string | null;
    title: string | null;
    image: string | null;
    japaneseTitle: string | null;
    type: string | null;
    sub: number;
    dub: number;
    episodes: number;
  }[] = [];

  $('.aitem').each((i, element) => {
    searchresults.push({
      id: $(element).find('div.inner > a').attr('href')?.replace('/watch/', '') || null,
      title: $(element).find('div.inner > a').text().trim() || null,
      image: $(element).find('img')?.attr('data-src') || $(element).find('img')?.attr('src') || null,
      japaneseTitle: $(element).find('a.title')?.attr('data-jp')?.trim() || null,
      type: $(element).find('.info').children().last()?.text().trim() || null,
      sub: Number($(element).find('.info span.sub')?.text()) || 0,
      dub: Number($(element).find('.info span.dub')?.text()) || 0,
      episodes:
        Number($(element).find('.info').children().eq(-2).text().trim() ?? $(element).find('.info span.sub')?.text()) || 0,
    });
  });

  const res = {
    currentPage: 0,
    hasNextPage: false,
    totalPages: 0,
  };

  const pagination = $('ul.pagination');
  res.currentPage = Number(pagination.find('.page-item.active span.page-link').text().trim()) || 1;
  const nextPage = pagination.find('.page-item.active').next().find('a.page-link').attr('href')?.split('page=')[1];
  if (nextPage != undefined && nextPage != '') {
    res.hasNextPage = true;
  }
  const totalPages = pagination.find('.page-item:last-child a.page-link').attr('href')?.split('page=')[1];
  if (totalPages === undefined || totalPages === '') {
    res.totalPages = res.currentPage;
  } else {
    res.totalPages = Number(totalPages) || 0;
  }
  if (searchresults.length === 0) {
    res.currentPage = 0;
    res.hasNextPage = false;
    res.totalPages = 0;
  }

  return { res, searchresults };
}
export function extractAnimeInfo($: cheerio.CheerioAPI) {
  const animeInfo: Info = {
    animeId: null,
    title: null,
    romaji: null,
    posterImage: null,

    type: null,
    synopsis: null,
    episodes: {
      sub: null,
      dub: null,
    },
    totalEpisodes: null,
  };
  animeInfo.animeId = $('div.sharethis-inline-share-buttons').attr('data-url')?.split('/').at(-1) || null;
  animeInfo.title = $('.entity-scroll > .title').text() || null;
  animeInfo.romaji = $('.entity-scroll > .title').attr('data-jp')?.trim() || null;
  animeInfo.posterImage = $('div.poster > div >img').attr('src') || null;
  animeInfo.synopsis = $('.entity-scroll > .desc').text().trim() || null;
  animeInfo.type = $('.entity-scroll > .info').children().last().text().toUpperCase() || null;
  animeInfo.episodes.sub = Number($('.entity-scroll > .info').find('.info span.sub')?.text() || null);
  animeInfo.episodes.dub = Number($('.entity-scroll > .info').find('.info span.dub')?.text() || null);
  animeInfo.totalEpisodes = Number($('.entity-scroll > .info').find('.info span.sub')?.text() || null);
  return { animeInfo };
}
