import { AnimeZ, Anitaku, HiAnime } from '../../index.js';
import { getInfoById } from './jikan.js';

import {
  animeZtitle,
  anitakuTitle,
  hianimeTitle,
  type JikanTitle,
} from './stringsimilarity.js';

export async function getProviderId(id: number) {
  try {
    // Fetch anime info from Jikan API
    const data = await getInfoById(id);
    const englishTitle = data.animeInfo?.title?.english as string;
    const modifiedString = englishTitle?.split(':')?.at(0)?.trim();
    const romanjiTitle = data.animeInfo?.title.romaji as string;
    const titles = data?.animeInfo?.title;
    if (!titles) throw new Error('English title not found.');

    // Providers' search functions
    const searchAnitaku = async (title: string) => {
      const anitaku = new Anitaku();
      try {
        const result = await anitaku.search(title);
        return (
          result.anime?.map((item: any) => ({
            animeId: item.id,
            name: item.title,
          })) || []
        );
      } catch (error) {
        console.error('Error fetching from Anitaku:', error);
        return [];
      }
    };

    const searchAnimeZ = async (title: string) => {
      const animeZ = new AnimeZ();
      try {
        const result = await animeZ.search(title);
        return (
          result.data?.map((item: any) => ({
            animeId: item.id,
            name: item.title,
          })) || []
        );
      } catch (error) {
        console.error('Error fetching from AnimeZ:', error);
        return [];
      }
    };

    const searchHiAnime = async (title: string) => {
      const hiAnime = new HiAnime();
      try {
        const result = await hiAnime.search(title);
        return (
          result.anime?.map((item: any) => ({
            animeId: item.id,
            name: item.name,
            romaji: item.romanji,
          })) || []
        );
      } catch (error) {
        console.error('Error fetching from HiAnime:', error);
        return [];
      }
    };

    // Fetch results from all providers
    const fetchProviderResults = async (
      modifiedString: string,
      romanjiTitle: string
    ) => {
      const providerResults = await Promise.all([
        searchAnitaku(romanjiTitle),
        searchAnimeZ(modifiedString),
        searchHiAnime(romanjiTitle),
      ]);

      const [anitakuResults, animeZResults, hiAnimeResults] = providerResults;

      const separatedResults = {
        anitaku: anitakuResults,
        animeZ: animeZResults,
        hiAnime: hiAnimeResults,
      };

      const anitakures = separatedResults.anitaku;
      const hianimeres = separatedResults.hiAnime;

      const { gogoanime } = anitakuTitle(titles, anitakures);
      const { hiAnime } = hianimeTitle(titles, hianimeres);
      const { animeZ } = animeZtitle(titles, animeZResults);

      return {
        data,
        gogoanime,
        hiAnime,
        animeZ,
      };
    };

    return await fetchProviderResults(modifiedString as string, romanjiTitle);
  } catch (error) {
    console.error('Error in getAnimeTitle:', error);
    throw error;
  }
}
