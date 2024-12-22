import { getInfoById } from "./jikan";
import { Anitaku } from "../../provider/anime/anitaku/anitaku";
import { AnimeZ } from "../../provider/anime/animeZ/animeZ";
import { HiAnime } from "../../provider/anime/hianime/hiAnime";

export async function getAnimeTitle(id: number) {
  try {
    // Fetch anime info from Jikan API
    const data = await getInfoById(id);
    const englishTitle = data.animeInfo?.title?.English as string;
    if (!englishTitle) throw new Error("English title not found.");

    // Providers
    const providers = [
      {
        key: "anitaku",
        instance: new Anitaku(),
        mapFields: (item: any) => ({ animeId: item.id, name: item.title }),
      },
      {
        key: "animeZ",
        instance: new AnimeZ(),
        mapFields: (item: any) => ({ animeId: item.id, name: item.title }),
      },
      {
        key: "hiAnime",
        instance: new HiAnime(),
        mapFields: (item: any) => ({
          animeId: item.id,
          name: item.name,
          romanji: item.romanji,
        }),
      },
    ];

    // Fetch results for each provider
    const providerResults = await Promise.all(
      providers.map(async ({ key, instance, mapFields }) => {
        try {
          const searchResults = await instance.search(englishTitle);
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

    // Organize results by provider
    const separatedResults = providerResults.reduce((acc, { key, data }) => {
      acc[key] = data;
      return acc;
    }, {} as Record<string, any[]>);

    return { data, providers: separatedResults };
  } catch (error) {
    console.error("Error in getAnimeTitle:", error);
    throw error;
  }
}

// Example usage
// getAnimeTitle(56784).then(console.log).catch(console.error);
