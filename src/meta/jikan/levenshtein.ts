import { closest } from "fastest-levenshtein";
import Fuse from "fuse.js";
type result = {
  animeId: string;
  name?: string;
  romanji?: string;
  alt?: string;
};

export type JikanTitle = {
  romanji: string;
  english: string;
};

const normalizetitle = (title: string) => title?.toLowerCase().trim();

export function anitakuTitle(title: JikanTitle, results: result[]) {
  const normalizedResults = results.map((item) => ({
    ...item,
    normalizedName: normalizetitle(item.name as string),
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
    // normalizedName: normalizetitle(item.name),
    normalizeRomanji: normalizetitle(item.romanji as string),
  }));

  // const normalizedEnglish = normalizetitle(title.english || "");
  const normalizedRomanji = normalizetitle(title.romanji || "");
  const fuseOptions = {
    keys: ["normalizeRomanji"],
    threshold: 0.3,
    includeScore: true,
  };

  const fuse = new Fuse(normalizedResults, fuseOptions);
  const query = `${normalizedRomanji}`.trim();
  const res = fuse.search(query);

  const fuzzy = res.map((item) => ({
    id: item.item.animeId,
    name: item.item.name,
    score: item.score,
    index: item.refIndex,
  }));

  return {
    hiAnime: fuzzy,
  };
}
export function animeZtitle(title: JikanTitle, results: result[]) {
  const normalizedEnglish = normalizetitle(title.english || "");

  const normalizedResults = results.map((item) => ({
    ...item,
    normalizedName: normalizetitle(item.name as string),
  }));

  const fuseOptions = {
    keys: ["name"],
    threshold: 0.4,
    includeScore: true,
    ignoreLocation: true,
  };

  const fuse = new Fuse(normalizedResults, fuseOptions);
  const query = `${normalizedEnglish}`.trim();
  const res = fuse.search(query);

  const fuzzy = res.map((item) => ({
    id: item.item.animeId,
    name: item.item.name,
    score: item.score,
    index: item.refIndex,
  }));

  return { animeZ: fuzzy.at(0) };
}
// ,
