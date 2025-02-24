import * as cheerio from 'cheerio';

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

  let currentPage, hasNextPage, totalPages;

  const pagination = $('ul.pagination');
  currentPage = Number(pagination.find('.page-item.active span.page-link').text().trim()) || 1;
  totalPages = pagination.find('.page-item:last-child a.page-link').attr('href')?.split('page=')[1];
  if (totalPages || totalPages === '') {
    totalPages = currentPage;
  } else {
    totalPages = Number(totalPages) || 0;
  }
  if (totalPages > 1) {
    hasNextPage = true || false;
  }
  return { hasNextPage, currentPage, totalPages, searchresults };
}
