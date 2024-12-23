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

    // Providers
    const providers = [
      {
        key: "anitaku",
        title: romanjiTitle,
        instance: new Anitaku(),
        mapFields: (item: any) => ({
          animeId: item.id,
          name: item.title,
        }),
      },
      {
        key: "animeZ",
        title: modifiedString,
        instance: new AnimeZ(),
        mapFields: (item: any) => ({
          animeId: item.id,
          name: item.title,
          romanji: item.romanji,
        }),
      },
      {
        key: "hiAnime",
        title: romanjiTitle,
        instance: new HiAnime(),
        mapFields: (item: any) => ({
          animeId: item.id,
          name: item.name,
          romanji: item.romanji,
        }),
      },
    ];

    const providerResults = await Promise.all(
      providers.map(async ({ key, instance, title, mapFields }) => {
        try {
          const searchResults = await instance.search(title as string);
          return { key, data: searchResults.anime?.map(mapFields) || [] };
        } catch (error) {
          console.error(
            `Error fetching from provider: ${instance.constructor.name}`,
            error
          );
          return { key, data: [] };
        }
      })
    );

    const separatedResults = providerResults.reduce((acc, { key, data }) => {
      acc[key] = data;
      return acc;
    }, {} as Record<string, any[]>);
    const anitakures = separatedResults.anitaku;
    const hianimeres = separatedResults.hiAnime;
    const animeZres = separatedResults.animeZ;
    const { gogoanime } = anitakuTitle(titles, anitakures);
    const { hiAnime } = hianimeTitle(titles, hianimeres);
    const { animeZ } = animeZtitle(titles, animeZres);
    return {
      titles,
      gogoanime,
      hiAnime,
      animeZ,

      // animeZres,
    };
  } catch (error) {
    console.error("Error in getAnimeTitle:", error);
    throw error;
  }
}

// Example usage
// getAnimeTitle(56784).then(console.log).catch(console.error);
