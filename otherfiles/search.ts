import * as cheerio from 'cheerio';

type result = {
    id: string,
    title: string,
    titleJp: string,
    url: string,
    type: string,
    status: string,
    image: string,
    subAvailable: boolean,
    dubAvailable: boolean
}

const search = async (q: string) => {
    const url = `https://anivibe.net/search.html?keyword=${q}`;
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    const results: result[] = [];
    $('#content > div > div.postbody > div > div.listupd > article').each((index, element) => {
        const id = $(element).find('a').attr('href')!.split('/').pop()!;
        const title = $(element).find('a > div.ttt > div > span').text();
        const titleJp = $(element).find('a > div.ttt > div > span').attr('data-jp')!;
        const url = $(element).find('a').attr('href')!;
        const type = $(element).find('a > div.limit > div.typez.TV').text();
        const status = $(element).find('a > div.limit > div.bt > span.epx').text();
        const image = $(element).find('a > div.limit > img').attr('src')!;
        const dubAvailable = $(element).find('a > div.limit > div.bt > span.sb.dub').length > 0;
        const subAvailable = $(element).find('a > div.limit > div.bt > span.sb.sub').length > 0;
        results.push({
            id,
            title,
            titleJp,
            url,
            type,
            status,
            image,
            subAvailable,
            dubAvailable
        });
    });
    return results;
};

export default search;