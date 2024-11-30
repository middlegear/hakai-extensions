import * as cheerio from 'cheerio';
import moment from 'moment';

type result = {
    title: string;
    titleJp: string;
    image: string;
    description: string;
    synonyms: string[];
    info: {
        status: string;
        studio: string;
        released: string;
        duration: string;
        type: string;
        totalEpisodes: number;
    };
    genres: string[];
    episodes: {
        title: string;
        url: string;
        date: string;
        dateFormat: string;
        relative: string;
        number: number;
    }[];
}

const info = async (id: string) => {
    const url = `https://anivibe.net/series/${id}`;
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    const results: result[] = [];
    const title = $('#post-7361 > div.bixbox.animefull > div > div.infox > h1').text()!;
    const titleJp = $('#post-7361 > div.bixbox.animefull > div > div.infox > h1').attr('data-jp')!;
    const image = $('#post-7361 > div.bixbox.animefull > div > div.thumbook > div > img').attr('src')!;
    const description = $('#post-7361 > div.bixbox.synp > div.entry-content').text()!;
    const synonyms = $('#post-7361 > div.bixbox.animefull > div > div.infox > div > span').text()!.split(', ');
    const info = {
        status: $('#post-7361 > div.bixbox.animefull > div > div.infox > div > div.info-content > div.spe > span:nth-child(1)').text().split(': ')[1]!,
        studio: $('#post-7361 > div.bixbox.animefull > div > div.infox > div > div.info-content > div.spe > span:nth-child(2) > a').text().split(': ')[1]!,
        released: $('#post-7361 > div.bixbox.animefull > div > div.infox > div > div.info-content > div.spe > span.split').text().split(': ')[1]!,
        duration: $('#post-7361 > div.bixbox.animefull > div > div.infox > div > div.info-content > div.spe > span:nth-child(4)').text().split(': ')[1]!,
        type: $('#post-7361 > div.bixbox.animefull > div > div.infox > div > div.info-content > div.spe > span:nth-child(5)').text().split(': ')[1]!,
        totalEpisodes: parseInt($('#post-7361 > div.bixbox.animefull > div > div.infox > div > div.info-content > div.spe > span:nth-child(6)').text().split(': ')[1].split('/')[1]!),
    };
    const genres = $('#post-7361 > div.bixbox.animefull > div > div.infox > div > div.info-content > div.genxed > a').map((index, element) => $(element).text()).get();
    const episodes = $('#post-7361 > div.bixbox.bxcl.epcheck > div.eplister > ul > li').map((index, element) => ({
        title: $(element).find('a > div.epl-title').text().trim(),
        url: $(element).find('a').attr('href')!,
        date: moment($(element).find('a > div.epl-date').attr('data-date')!).format(),
        dateFormat: $(element).find('a > div.epl-date').text(),
        relative: moment($(element).find('a > div.epl-date').attr('data-date')!).fromNow(),
        number: parseInt($(element).find('a > div.epl-num').text()),
    })).get();
    results.push({
        title,
        titleJp,
        image,
        description,
        synonyms,
        info, 
        genres,
        episodes,
    })
    return results;
};

export default info;