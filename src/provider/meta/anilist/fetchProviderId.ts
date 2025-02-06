import { AnimeZ, Anitaku, HiAnime } from '../../index.js';
import { fetchAnimeById } from './anilist.js';
import {
  bestAnitakuTitle,
  bestHianimeTitle,
  bestanimeZTitle,
} from './stringSimilarity.js';

export async function fetchProviderId(id: number) {
  try {
    const data = await fetchAnimeById(id);
    const titles = data.data?.title;
    const englishTitle = titles?.english as string;
    const userPref = titles?.romaji.split(' ').slice(0, 3).join(' ');
    const modifiedString = englishTitle?.split(':')?.at(0)?.trim();

    if (!titles) throw new Error(' title not found.');

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
    const fetchProviderResults = async (
      modifiedString: string,
      userPref: string
    ) => {
      const providerResults = await Promise.all([
        searchAnitaku(userPref),
        searchAnimeZ(modifiedString),

        searchHiAnime(userPref),
      ]);

      const [anitakuResults, animeZResults, hiAnimeResults] = providerResults;

      const separatedResults = {
        anitaku: anitakuResults,
        animeZ: animeZResults,
        hiAnime: hiAnimeResults,
      };

      const anitakures = separatedResults.anitaku;
      const hianimeres = separatedResults.hiAnime;

      const { gogoAnime } = bestAnitakuTitle(titles, anitakures);
      const { hiAnime } = bestHianimeTitle(titles, hianimeres);
      const { animeZ } = bestanimeZTitle(titles, animeZResults);

      return {
        data,
        gogoAnime,
        hiAnime,
        animeZ,
      };
    };

    return await fetchProviderResults(modifiedString as string, userPref);
  } catch (error) {
    console.error('Error in getAnimeTitle:', error);
    throw error;
  }
}
