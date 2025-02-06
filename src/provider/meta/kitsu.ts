import axios from 'axios';
import { kistuQuery } from './anilist/queries.js';
import { exitCode } from 'process';
const baseUrl = 'https://kitsu.io/api/graphql';
type View = {
  name: string;
  url: string;
};
export async function searchKitsu(
  title: string,
  first: number = 1,
  episodesFirst2: number = 2000
) {
  if (!title)
    return {
      success: false,
      error: 'Missing required params : title',
    };

  try {
    const variables = { title, first, episodesFirst2 };
    const { data } = await axios.post(baseUrl, {
      query: kistuQuery,
      variables,
    });
    const res = data?.data.searchAnimeByTitle.nodes.map((item: any) => ({
      kitsuId: item.id,
      slug: item.slug,
      title: {
        romaji: item.titles.romanized ?? item.titles.preferred,
        english: item.titles.localized.en,
        native: item.titles.preferred,
      },
      imageHash: item.posterImage.blurhash,
      image:
        item.posterImage?.original.url ??
        item.posterImage?.views?.find((view: View) => view.name === 'large')
          .url ??
        item.posterImage?.views?.find((view: View) => view.name === 'medium')
          .url ??
        item.posterImage?.views?.find((view: View) => view.name === 'small')
          .url ??
        item.posterImage?.views?.find((view: View) => view.name === 'tiny')
          .url ??
        null,

      bannerImage:
        item.bannerImage?.original.url ??
        item.bannerImage?.views?.find((view: View) => view.name === 'large')
          .url ??
        item.bannerImage?.views?.find((view: View) => view.name === 'medium')
          .url ??
        item.bannerImage?.views?.find((view: View) => view.name === 'small')
          .url ??
        item.bannerImage?.views?.find((view: View) => view.name === 'tiny')
          .url ??
        null,
      episodes: item.episodes?.nodes.map((item2: any) => ({
        number: item2.number,
        title: item2.titles.localized.en,
        thumbnail:
          item2.thumbnail?.original.url ??
          item2.views?.find((view: View) => view.name === 'large').url ??
          item2.views?.find((view: View) => view.name === 'medium').url ??
          item2.views?.find((view: View) => view.name === 'small').url ??
          item2.views?.find((view: View) => view.name === 'tiny').url ??
          null,
        imageHash: item2.thumbnail?.blurhash,
        description: item2.description?.en,
      })),
    }));
    return {
      success: true,
      data: res,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'unkown err',
    };
  }
}

// episodes : [
//     thumbnail : url1 ?? url2 ....
//     description : jdjdjdj
//     title: ofofofoof
// ]
//
