//// v2

const { ANIME, META } = require("@consumet/extensions");
import { closest } from "fastest-levenshtein";

function getBestTitle(titles) {
  return (
    titles.english || titles.romaji || titles.userPreferred || "Unknown Title"
  );
}

const getAnilistToGogo = async (id) => {
  try {
    const anilistMeta = new META().Anilist();
    const gogoAnime = new ANIME.Gogoanime();

    const animeInfo = await anilistMeta.getAnimeInfo(id);

    const bestAnilistTitle = getBestTitle(animeInfo.title);

    const gogoSearch = await gogoAnime.search(bestAnilistTitle);

    if (!gogoSearch.results || gogoSearch.results.length === 0) {
      throw new Error(`No results found on Gogoanime for: ${bestAnilistTitle}`);
    }

    const bestGogoResultTitle = closest(
      bestAnilistTitle,
      gogoSearch.results.map((t) => t.title).filter(Boolean) // Filter out falsy values
    );

    const bestGogoResult = gogoSearch.results.find(
      (r) => r.title === bestGogoResultTitle
    );

    return bestGogoResult || null;
  } catch (error) {
    console.error("Error in getAnilistToGogo:", error.message);
    return null;
  }
};
