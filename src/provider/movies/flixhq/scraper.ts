import * as cheerio from 'cheerio';
import { flixhqBaseUrl } from '../../../utils/constants';
import { MediaInfo, searchTypes } from './types';

export function scrapeSearch($: cheerio.CheerioAPI) {
  const searchRes: searchTypes[] = [];
  const selector: cheerio.SelectorType = '.film_list-wrap > div.flw-item';
  const nav = 'div.pre-pagination:nth-child(3) > nav:nth-child(1) > ul:nth-child(1)';

  const hasNextPage = $(nav).length > 0 ? !$(nav).children().last().hasClass('active') : false;
  $(selector).each((i, el) => {
    const releaseDate = $(el).find('div.film-detail > div.fd-infor > span:nth-child(1)').text();
    searchRes.push({
      id: $(el).find('div.film-poster > a').attr('href')?.slice(1) || null,
      title: $(el).find('div.film-detail > h2 > a').attr('title') || null,
      quality: $(el).find('div.film-poster > div.film-poster-quality').text() || null,
      url: `${flixhqBaseUrl}${$(el).find('div.film-poster > a').attr('href')}`,
      image: $(el).find('div.film-poster > img').attr('data-src') || null,
      type: $(el).find('div.film-detail > div.fd-infor > span.float-right').text() === 'Movie' ? 'Movie' : 'TV',
    });
  });

  return { results: searchRes, hasNextPage: hasNextPage };
}

export function scrapeMediaInfo($: cheerio.CheerioAPI) {
  const mediaInfo: MediaInfo = {
    id: null,
    cover: null,
    title: null,
    image: null,
    description: null,
    type: null,
    releaseDate: null,
    genres: [],
    casts: [],
    tags: [],

    production: null,
    country: null,
    duration: null,
    rating: null,
  };
  mediaInfo.id = $('h2.heading-name > a').attr('href')?.slice(1) || null;
  mediaInfo.cover = $('div.w_b-cover').attr('style')?.slice(22).replace(')', '').replace(';', '') || null;
  mediaInfo.title = $('.heading-name > a:nth-child(1)').text() || null;
  mediaInfo.image = $('.m_i-d-poster > div:nth-child(1) > img:nth-child(1)').attr('src') || null;
  mediaInfo.description = $('.description').text();
  mediaInfo.type = mediaInfo.id ? (mediaInfo.id.split('/')[0] === 'tv' ? 'TV' : 'Movie') : null;
  mediaInfo.releaseDate = $('div.row-line:nth-child(3)').text().replace('Released: ', '').trim();
  mediaInfo.genres = $('div.row-line:nth-child(2) > a')
    .map((i, el) => $(el).text().split('&'))
    .get()
    .map(v => v.trim());
  mediaInfo.casts = $('div.row-line:nth-child(5) > a')
    .map((i, el) => $(el).text())
    .get();
  mediaInfo.tags = $('div.row-line:nth-child(6) > h2')
    .map((i, el) => $(el).text())
    .get();
  mediaInfo.production = $('div.row-line:nth-child(4) > a:nth-child(2)').text();
  mediaInfo.country = $('div.row-line:nth-child(1) > a:nth-child(2)').text();
  mediaInfo.duration = $('span.item:nth-child(3)').text();
  mediaInfo.rating = parseFloat($('span.item:nth-child(2)').text());

  return mediaInfo;
}
