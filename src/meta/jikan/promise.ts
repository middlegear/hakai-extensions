import { getInfoById } from "./jikan";
import { Anitaku } from "../../provider/anime/anitaku/anitaku";
import { AnimeZ } from "../../provider/anime/animeZ/animeZ";
import { HiAnime } from "../../provider/anime/hianime/hiAnime";

import {
  animeZtitle,
  anitakuTitle,
  hianimeTitle,
  type JikanTitle,
} from "./levenshtein";

export async function getAnimeTitle(id: number) {
  try {
    // Fetch anime info from Jikan API
    const data = await getInfoById(id);
    const englishTitle = data.animeInfo?.title?.english as string;
    const modifiedString = englishTitle?.split(":")?.at(0)?.trim();
    const romanjiTitle = data.animeInfo?.title.romanji as string;
    const titles: JikanTitle = data.animeInfo?.title as JikanTitle;
    if (!titles) throw new Error("English title not found.");

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
        console.error("Error fetching from Anitaku:", error);
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
            // alt: item.alternatives || "stubborn provider",
          })) || []
        );
      } catch (error) {
        console.error("Error fetching from AnimeZ:", error);
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
            alt: item.alternatives || "stubborn provider",
          })) || []
        );
      } catch (error) {
        console.error("Error fetching from AnimeZ Suggestions:", error);
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
            romanji: item.romanji,
          })) || []
        );
      } catch (error) {
        console.error("Error fetching from HiAnime:", error);
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
      const matchingAnimeZ = animeZResults.map((animeItem) => {
        const matchingSuggestion = animeZSuggestionsResults.find(
          (animesuggest) => animesuggest.animeId === animeItem.animeId
        );
        if (matchingSuggestion) {
          return {
            ...animeItem,
            alt: matchingSuggestion.alt,
          };
        }
        return animeItem;
      });
      const { gogoanime } = anitakuTitle(titles, anitakures);
      const { hiAnime } = hianimeTitle(titles, hianimeres);
      const dat = animeZtitle(titles, matchingAnimeZ);
      // console.log(dat.matchalmost.length);

      return {
        titles,
        dat: dat.matchalmost,
        gogoanime,
        hiAnime,

        // matchingAnimeZ
      };
    };

    return await fetchProviderResults(modifiedString as string, romanjiTitle);
  } catch (error) {
    console.error("Error in getAnimeTitle:", error);
    throw error;
  }
}

// Example usage
// getAnimeTitle(56784).then(console.log).catch(console.error);
