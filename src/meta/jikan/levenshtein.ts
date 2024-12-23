import { closest } from "fastest-levenshtein";

type result = {
  animeId: string;
  name: string;
  romanji?: string;
};

export type JikanTitle = {
  romanji: string;
  english: string;
};

const normalizetitle = (title: string) => title?.toLowerCase().trim() || "";

export function anitakuTitle(title: JikanTitle, results: result[]) {
  const normalizedResults = results.map((item) => ({
    ...item,
    normalizedName: normalizetitle(item.name),
  }));

  const normalizedEnglish = normalizetitle(title.english || "");
  const normalizedRomanji = normalizetitle(title.romanji || "");

  const bestEnglishMatch = normalizedEnglish
    ? closest(
        normalizedEnglish,
        normalizedResults.map((r) => r.normalizedName)
      )
    : null;

  const bestRomanjiMatch = normalizedRomanji
    ? closest(
        normalizedRomanji,
        normalizedResults.map((r) => r.normalizedName)
      )
    : null;

  // Filter matches for sub and dub
  const subbed = normalizedResults.find(
    (item) =>
      item.normalizedName === bestEnglishMatch ||
      item.normalizedName === bestRomanjiMatch
  );

  const dubbed = normalizedResults.find(
    (item) =>
      item.normalizedName.includes(bestRomanjiMatch as string) &&
      item.animeId.includes("-dub")
  );
  const sub = {
    id: subbed?.animeId || null,
    title: subbed?.name || null,
  };

  const dub = {
    id: dubbed?.animeId || null,
    title: dubbed?.name || null,
  };
  const gogoanime = {
    dub: dub,
    sub: sub,
  };
  return {
    gogoanime,
  };
}

export function hianimeTitle(title: JikanTitle, results: result[]) {
  const normalizedResults = results.map((item) => ({
    ...item,
    normalizedName: normalizetitle(item.name),
    normalizeRomanji: normalizetitle(item.romanji as string),
  }));

  const normalizedEnglish = normalizetitle(title.english || "");
  const normalizedRomanji = normalizetitle(title.romanji || "");

  const bestEnglishMatch = normalizedEnglish
    ? closest(
        normalizedEnglish,
        normalizedResults.map((r) => r.normalizedName)
      )
    : null;

  const bestRomanjiMatch = normalizedRomanji
    ? closest(
        normalizedRomanji,
        normalizedResults.map((r) => r.normalizeRomanji)
      )
    : null;

  // Filter matches
  const zoro = normalizedResults.find(
    (item) =>
      item.normalizedName === bestEnglishMatch ||
      item.normalizeRomanji === bestRomanjiMatch
  );

  const hiAnime = {
    id: zoro?.animeId || null,
    title: zoro?.name || null,
    romanji: zoro?.romanji || null,
  };

  return {
    hiAnime,
  };
}
export function animeZtitle(title: JikanTitle, results: result[]) {
  const normalizedResults = results.map((item) => ({
    ...item,
    normalizedName: normalizetitle(item.name),
    normalizedId: normalizetitle(item.animeId),
    normalizeRomanji: normalizetitle(item.romanji as string),
  }));

  const normalizedEnglish = normalizetitle(title.english || "");
  const normalizedRomanji = normalizetitle(title.romanji || "");

  const bestEnglishMatch = normalizedEnglish
    ? closest(
        normalizedEnglish,
        normalizedResults.map((r) => r.normalizedName)
      )
    : null;

  const bestRomanjiMatch = normalizedRomanji
    ? closest(
        normalizedRomanji,
        normalizedResults.map((r) => r.normalizeRomanji)
      )
    : null;
  const anime2 = normalizedResults.filter(
    (item) =>
      item.normalizedName === (normalizedEnglish as string) ||
      item.normalizeRomanji === (normalizedRomanji as string)
  );

  const anime = normalizedResults.find((item) =>
    // item.normalizedName.includes(bestEnglishMatch as string) &&
    item.normalizeRomanji.includes(normalizedRomanji as string)
  );
  const animeZ = {
    id: anime?.animeId || "search on this site is broken",
    title: anime?.name || "search on this site is broken",
  };

  return {
    animeZ,

    // normalizedResults,
  };
}
