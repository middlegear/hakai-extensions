import { findBestMatch } from './string-similarity.js';

export type Title = {
  english: string;
  tvTitle?: string;
  romaji?: string;
  // movieTitle?: string;
};

type AnimeSearchResults = {
  animeId: string;
  name: string;
  romaji: string;
  providerName: string;
};
type TvSearchResults = {
  name: string;
  tmdbId: number;
};

function normalizeTitle(title?: string) {
  return title?.toLowerCase().trim() || '';
}

export function bestTitleMatch(title: Title, results: AnimeSearchResults[]) {
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

export function bestTVTitle(title: string, results: TvSearchResults[]) {
  if (!results.length) return null;

  const normTvtitle = normalizeTitle(title);

  const normalizedResults = results.map(item => ({
    ...item,
    _name: normalizeTitle(item.name),
  }));

  const findTitle = findBestMatch(
    normTvtitle,
    normalizedResults.map(r => r._name),
  );
  const best = findTitle.bestMatch;
  const match = normalizedResults.find(r => r._name === best.target);
  return match
    ? {
        tmdbId: match.tmdbId,
        name: match.name || null,
        score: best.rating,
      }
    : null;
}
