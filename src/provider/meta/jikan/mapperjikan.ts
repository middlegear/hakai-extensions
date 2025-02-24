import { findBestMatch } from '../../../utils/string-similarity.js';

type result = {
  animeId: string;
  name?: string;
  romaji?: string;
  alt?: string;
};

export type JikanTitle = {
  romaji: string | null;
  english: string | null;
};

const normalizetitle = (title: string) => title?.toLowerCase().trim();

export function hianimeTitle(title: JikanTitle, results: result[]) {
  const normalizedResults = results.map(item => ({
    ...item,
    normalizedName: normalizetitle(item.name as string),
    normalizeRomanji: normalizetitle(item.romaji as string),
  }));

  const normalizedEnglish = normalizetitle(title.english as string);
  const normalizedRomanji = normalizetitle(title.romaji as string);
  const bestTitleMatch =
    normalizedResults.length > 0
      ? findBestMatch(
          normalizedRomanji,
          normalizedResults.map(item => item.normalizeRomanji),
        ) ||
        findBestMatch(
          normalizedEnglish,
          normalizedResults.map(item => item.normalizedName),
        )
      : null;
  let match = null;

  if (bestTitleMatch !== null && bestTitleMatch.bestMatch) {
    match = normalizedResults.find(
      item => item.normalizeRomanji === bestTitleMatch.bestMatch.target || item.name === bestTitleMatch.bestMatch.target,
    );
  }
  return {
    animeId: match?.animeId || null,
    name: match?.name || null,
    romaji: match?.romaji || null,
    score: bestTitleMatch?.bestMatch.rating || null,
  };
}
