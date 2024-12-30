import { fetchAnimeById } from "./anilist";
import { Anitaku } from "../../provider/anime/anitaku/anitaku";
import { AnimeZ } from "../../provider/anime/animeZ/animeZ";
import { HiAnime } from "../../provider/anime/hianime/hiAnime";

import {
  bestanimeZTitle,
  bestAnitakuTitle,
  bestHianimeTitle,
} from "./stringSimilarity";

export async function fetchProviderId(id: number) {
  try {
    // Fetch anime info from Anilist  API
    const data = await fetchAnimeById(id);
    const titles = data.data?.Media?.title;
    const englishTitle = titles.english;
    const userPref = titles.userPreferred.split(" ").slice(0, 3).join(" ");
    const modifiedString = englishTitle?.split(":")?.at(0)?.trim();

    if (!titles) throw new Error(" title not found.");
    console.log(titles, userPref);

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
            romaji: item.romanji,
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
      userPref: string
    ) => {
      const providerResults = await Promise.all([
        searchAnitaku(userPref),
        searchAnimeZ(modifiedString),
        searchAnimeZSuggestions(modifiedString),
        searchHiAnime(userPref),
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

      const { gogoAnime } = bestAnitakuTitle(titles, anitakures);
      const { hiAnime } = bestHianimeTitle(titles, hianimeres);
      const { animeZ } = bestanimeZTitle(titles, matchingAnimeZ);

      return {
        gogoAnime,
        hiAnime,
        animeZ,
      };
    };

    return await fetchProviderResults(modifiedString as string, userPref);
  } catch (error) {
    console.error("Error in getAnimeTitle:", error);
    throw error;
  }
}
