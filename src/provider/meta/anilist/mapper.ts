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

export function bestAnitakuTitle(title: AnilistTitle, results: SearchResults[]) {
  const normalizedRomajiTitle = normalizeTitle(title.romaji);

  const normalizedResults = results.map(item => ({
    ...item,
    normalizedRomaji: normalizeTitle(item.name as string),
    normalizedId: normalizeTitle(item.animeId),
  }));

  const bestResult =
    normalizedResults.length > 0
      ? findBestMatch(
          normalizedRomajiTitle,
          normalizedResults.map(title => title.normalizedRomaji),
        ) ||
        findBestMatch(
          normalizedRomajiTitle,
          normalizedResults.map(item => item.normalizedId),
        )
      : null;

  const bestDubResult =
    normalizedResults.length > 0
      ? findBestMatch(
          normalizedRomajiTitle,
          normalizedResults.filter(title => title.normalizedRomaji.includes('dub')).map(title => title.normalizedRomaji),
        ) ||
        findBestMatch(
          normalizedRomajiTitle,
          normalizedResults.filter(title => title.normalizedId.includes('dub')).map(title => title.normalizedId),
        )
      : null;

  let subres = null;
  let dubres = null;

  if (bestResult !== null && bestResult.bestMatch) {
    subres = normalizedResults.find(
      item => item.normalizedRomaji === bestResult.bestMatch.target || item.normalizedId === bestResult.bestMatch.target,
    );
  }

  if (bestDubResult !== null && bestDubResult.bestMatch) {
    dubres = normalizedResults.find(
      item =>
        item.normalizedRomaji === bestDubResult.bestMatch.target || item.normalizedId === bestDubResult.bestMatch.target,
    );
  }

  return {
    sub: {
      animeId: subres?.animeId || null,
      name: subres?.name || null,
      score: bestResult?.bestMatch?.rating || null,
    },
    dub: {
      animeId: dubres?.animeId || null,
      name: dubres?.name || null,
      score: bestDubResult?.bestMatch?.rating || null,
    },
  };
}

export function bestHianimeTitle(title: AnilistTitle, results: SearchResults[]) {
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

export function bestanimeZTitle(title: AnilistTitle, result: SearchResults[]) {
  const normalizedResults = result.map(item => ({
    ...item,
    normalizedId: normalizeTitle(item.animeId),
    normalizedName: normalizeTitle(item.name as string),
  }));

  const normalizedEngishTitle = normalizeTitle(title.english);

  const bestTitle =
    normalizedResults.length > 0
      ? findBestMatch(
          normalizedEngishTitle,
          normalizedResults.map(item => item.normalizedName) ||
            findBestMatch(
              normalizedEngishTitle,
              normalizedResults.map(item => item.normalizedId),
            ),
        )
      : null;
  let resultMatch;
  if (bestTitle && bestTitle.bestMatch) {
    resultMatch = normalizedResults.find(
      item => item.normalizedName === bestTitle.bestMatch.target || item.normalizedId === bestTitle.bestMatch.target,
    );
  }
  return {
    animeId: resultMatch?.animeId || null,
    name: resultMatch?.name || null,
    altName: resultMatch?.alt || 'Sometimes the anime provider Maybe Good, Sometimes Maybe Shit',
    score: bestTitle?.bestMatch.rating || null,
  };
}
