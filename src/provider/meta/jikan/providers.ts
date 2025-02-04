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
    const titles = data.animeInfo?.title;
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
          result.anime?.map((item: any) => ({
            animeId: item.id,
            name: item.title,
          })) || []
        );
      } catch (error) {
        console.error('Error fetching from AnimeZ:', error);
        return [];
      }
    };

    const searchAnimeZSuggestions = async (title: string) => {
      const animeZ = new AnimeZ();
      try {
        const result = await animeZ.searchSuggestions(title);
        return (
          result.anime?.map((item: any) => ({
            animeId: item.id,
            name: item.title,
            alt: item.alternatives || 'stubborn provider',
          })) || []
        );
      } catch (error) {
        console.error('Error fetching from AnimeZ Suggestions:', error);
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
        searchAnimeZSuggestions(modifiedString),
        searchHiAnime(romanjiTitle),
      ]);

      const [
        anitakuResults,
        animeZResults,
        animeZSuggestionsResults,
        hiAnimeResults,
      ] = providerResults;

      // Organizing results by provider key
      const separatedResults = {
        anitaku: anitakuResults,
        animeZ: animeZResults,
        animeZSuggestions: animeZSuggestionsResults,
        hiAnime: hiAnimeResults,
      };

      const anitakures = separatedResults.anitaku;
      const hianimeres = separatedResults.hiAnime;

      ////combine both data
      const matchingAnimeZ = animeZResults.map(
        (animeItem: { animeId: any }) => {
          const matchingSuggestion = animeZSuggestionsResults.find(
            (animesuggest: { animeId: any }) =>
              animesuggest.animeId === animeItem.animeId
          );
          if (matchingSuggestion) {
            return {
              ...animeItem,
              alt: matchingSuggestion.alt || null,
            };
          }
          return animeItem;
        }
      );
      const { gogoanime } = anitakuTitle(titles, anitakures);
      const { hiAnime } = hianimeTitle(titles, hianimeres);
      const { animeZ } = animeZtitle(titles, matchingAnimeZ);

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
