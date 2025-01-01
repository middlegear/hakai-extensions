import { findBestMatch } from "string-similarity";

type result = {
  animeId: string;
  name?: string;
  romaji?: string;
  alt?: string;
};

export type JikanTitle = {
  romaji: string;
  english: string;
};

const normalizetitle = (title: string) => title?.toLowerCase().trim();

export function anitakuTitle(title: JikanTitle, results: result[]) {
  const normalizedResults = results.map((item) => ({
    ...item,
    normalizedName: normalizetitle(item.name as string),
    normalizedId: normalizetitle(item.animeId),
  }));

  const normalizedRomanji = normalizetitle(title.romaji);

  const bestSubMatch =
    normalizedResults.length > 0
      ? findBestMatch(
          normalizedRomanji,
          normalizedResults.map((title) => title.normalizedName)
        ) ||
        findBestMatch(
          normalizedRomanji,
          normalizedResults.map((item) => item.normalizedId)
        )
      : null;

  const bestDubMatch =
    normalizedResults.length > 0
      ? findBestMatch(
          normalizedRomanji,
          normalizedResults
            .filter((item) => item.normalizedName.includes("dub"))
            .map((item) => item.normalizedName)
        ) ||
        findBestMatch(
          normalizedRomanji,
          normalizedResults
            .filter((item) => item.normalizedId.includes("dub"))
            .map((item) => item.normalizedId)
        )
      : null;
  let subres = null;
  let dubres = null;

  // Filter matches for sub and dub
  if (bestSubMatch !== null && bestSubMatch.bestMatch) {
    subres = normalizedResults.find(
      (item) =>
        item.normalizedName === bestSubMatch.bestMatch.target ||
        item.normalizedId === bestSubMatch.bestMatch.target
    );
  }
  if (bestDubMatch !== null && bestDubMatch.bestMatch) {
    dubres = normalizedResults.find(
      (item) =>
        item.normalizedName === bestDubMatch.bestMatch.target ||
        item.normalizedId === bestDubMatch.bestMatch.target
    );
  }
  const gogoanime = {
    sub: {
      animeId: subres?.animeId || null,
      name: subres?.name || null,
      score: bestSubMatch?.bestMatch.rating || null,
    },
    dub: {
      animeId: dubres?.animeId || null,
      name: dubres?.name || null,
      score: bestDubMatch?.bestMatch.rating || null,
    },
  };
  return {
    gogoanime,
  };
}

export function hianimeTitle(title: JikanTitle, results: result[]) {
  const normalizedResults = results.map((item) => ({
    ...item,
    normalizedName: normalizetitle(item.name as string),
    normalizeRomanji: normalizetitle(item.romaji as string),
  }));

  const normalizedEnglish = normalizetitle(title.english);
  const normalizedRomanji = normalizetitle(title.romaji);
  const bestTitleMatch =
    normalizedResults.length > 0
      ? findBestMatch(
          normalizedRomanji,
          normalizedResults.map((item) => item.normalizeRomanji)
        ) ||
        findBestMatch(
          normalizedEnglish,
          normalizedResults.map((item) => item.normalizedName)
        )
      : null;
  let match = null;

  if (bestTitleMatch !== null && bestTitleMatch.bestMatch) {
    match = normalizedResults.find(
      (item) =>
        item.normalizeRomanji === bestTitleMatch.bestMatch.target ||
        item.name === bestTitleMatch.bestMatch.target
    );
  }
  const hiAnime = {
    animeId: match?.animeId || null,
    name: match?.name || null,
    romaji: match?.romaji || null,
    score: bestTitleMatch?.bestMatch.rating || null,
  };
  return { hiAnime };
}
export function animeZtitle(title: JikanTitle, results: result[]) {
  const normalizedEnglish = normalizetitle(title.english);

  const normalizedResults = results.map((item) => ({
    ...item,
    normalizedName: normalizetitle(item.name as string),
    nomalizedAnimeId: normalizetitle(item.animeId),
  }));
  const bestTitle =
    normalizedResults.length > 0
      ? findBestMatch(
          normalizedEnglish,
          normalizedResults.map((item) => item.normalizedName)
        ) ||
        findBestMatch(
          normalizedEnglish,
          normalizedResults.map((item) => item.nomalizedAnimeId)
        )
      : null;

  let match = null;

  if (bestTitle !== null && bestTitle.bestMatch) {
    match = normalizedResults.find(
      (item) =>
        item.normalizedName === bestTitle.bestMatch.target ||
        item.nomalizedAnimeId === bestTitle.bestMatch.target
    );
  }
  const animeZ = {
    animeId: match?.animeId || null,
    name: match?.name || null,
    alt:
      match?.alt ||
      "Sometimes the anime provider Maybe Good, Sometimes Maybe Shit",
    score: bestTitle?.bestMatch.rating,
  };
  return { animeZ };
}
