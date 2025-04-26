import { findBestMatch } from './string-similarity.js';

export type AnilistTitle = {
  english: string;
  romaji: string;
};

export type SearchResults = {
  animeId: string;
  name?: string;
  romaji?: string;
  providerName?: string;
};

function normalizeTitle(title?: string) {
  return title?.toLowerCase().trim() || '';
}

export function bestTitleMatch(title: AnilistTitle, results: SearchResults[]) {
  if (!results.length) return null;

  const normRomaji = normalizeTitle(title.romaji);
  const normEnglish = normalizeTitle(title.english);

  const normalizedResults = results.map(item => ({
    ...item,
    _name: normalizeTitle(item.name),
    _romaji: normalizeTitle(item.romaji),
  }));

  const englishMatch = findBestMatch(
    normEnglish,
    normalizedResults.map(r => r._name),
  );

  const romajiMatch = findBestMatch(
    normRomaji,
    normalizedResults.map(r => r._romaji),
  );

  // Pick better of the two
  const best =
    englishMatch.bestMatch.rating >= romajiMatch.bestMatch.rating ? englishMatch.bestMatch : romajiMatch.bestMatch;

  const match = normalizedResults.find(r => r._name === best.target || r._romaji === best.target);

  return match
    ? {
        animeId: match.animeId,
        name: match.name || null,
        romaji: match.romaji || null,
        providerName: match.providerName || null,
        score: best.rating,
      }
    : null;
}
