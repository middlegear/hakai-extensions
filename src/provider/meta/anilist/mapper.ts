import { findBestMatch } from '../../../utils/string-similarity.js';

export type AnilistTitle = {
  english: string;
  romaji: string;
};

export type SearchResults = {
  animeId: string;
  name?: string;
  romaji?: string;
  alt?: string;
};

function normalizeTitle(title: string) {
  return title ? title.toLowerCase().trim() : 'No title provided';
}

export function bestZoroTitle(title: AnilistTitle, results: SearchResults[]) {
  const normalizedRomaji = normalizeTitle(title.romaji);
  const normalizedEngishTitle = normalizeTitle(title.english);

  const normalizedResults = results.map(item => ({
    ...item,
    normalizedname: normalizeTitle(item.name as string),
    normalizedRomaji: normalizeTitle(item.romaji as string),
  }));

  const bestTitle =
    normalizedResults.length > 0
      ? findBestMatch(
          normalizedEngishTitle,
          normalizedResults.map(title => title.normalizedname),
        ) ||
        findBestMatch(
          normalizedRomaji,
          normalizedResults.map(item => item.normalizedRomaji),
        )
      : null;

  let match = null;
  if (bestTitle !== null && bestTitle.bestMatch !== null) {
    match = normalizedResults.find(
      item => item.normalizedname === bestTitle.bestMatch.target || item.normalizedRomaji === bestTitle.bestMatch.target,
    );
  }
  return {
    animeId: match?.animeId || null,
    name: match?.name || null,
    romaji: match?.romaji || null,
    score: bestTitle?.bestMatch.rating || null,
  };
}
