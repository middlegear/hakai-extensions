import { closest } from "fastest-levenshtein";

type result = {
  animeId: string;
  name: string;
  romanji?: string;
  alt?: string;
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

    normalizeAlts: normalizetitle(item.alt as string),
  }));

  const normalizedEnglish = normalizetitle(title.english || "");
  const normalizedRomanji = normalizetitle(title.romanji || "");
  // const bestEnglishMatch = normalizedEnglish
  //   ? closest(
  //       normalizedEnglish,
  //       normalizedResults.map((r) => r.normalizedName)
  //     )
  //   : null;

  // const bestRomanjiMatch = normalizedRomanji
  //   ? closest(
  //       normalizedRomanji,
  //       normalizedResults.map((r) => r.normalizeAlts)
  //     )
  //   : null;

  const matchalmost = normalizedResults.filter(
    (item) =>
      item.normalizedName === normalizedEnglish ||
      item.normalizeAlts?.includes(normalizedRomanji)
  );

  const match = matchalmost.find(
    (item) => item.normalizedName == normalizedEnglish
  );

  return {
    matchalmost: matchalmost,
  };
}
