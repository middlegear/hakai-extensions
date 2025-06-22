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

export type ProviderSearchResults = {
  id: string;
  title: string;
  url: string;
  seasons?: number;
  releaseDate?: number;
  quality: string;
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

export function tmdbTitle(title: string, results: TvSearchResults[]) {
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
// export function bestTvShowTitle(title: string, results: ProviderSearchResults[]) {
//   if (!results.length) return null;

//   const normTvtitle = normalizeTitle(title);

//   const normalizedResults = results.map(item => ({
//     ...item,
//     _title: normalizeTitle(item.title),
//     _id: normalizeTitle(item.id),
//   }));

//   const findTitle = findBestMatch(
//     normTvtitle,
//     normalizedResults.map(r => r._title),
//   );
//   const findId = findBestMatch(
//     normTvtitle,
//     normalizedResults.map(r => r._id),
//   );

//   // const best = findTitle.bestMatch;
//   // Pick better of the two
//   const best = findTitle.bestMatch.rating >= findId.bestMatch.rating ? findTitle.bestMatch : findId.bestMatch;

//   const match = normalizedResults.find(r => r._title === best.target || r._id === best.target);
//   // const match = normalizedResults.find(r => r._title === best.target);
//   return match
//     ? {
//         id: match.id || null,
//         title: match.title || null,
//         quality: match.quality || null,
//         url: match.url || null,
//         score: best.rating,
//       }
//     : null;
// }
//
export function bestTvShowTitle(title: string, results: ProviderSearchResults[]) {
  if (!results.length) return null;

  const normTvtitle = normalizeTitle(title);

  const normalizedResults = results.map(item => ({
    ...item,
    _title: normalizeTitle(item.title),
    _id: normalizeTitle(item.id),
  }));

  const findTitle = findBestMatch(
    normTvtitle,
    normalizedResults.map(r => r._title),
  );
  const findId = findBestMatch(
    normTvtitle,
    normalizedResults.map(r => r._id),
  );

  // Pick better of the two scores
  const bestOverallMatch = findTitle.bestMatch.rating >= findId.bestMatch.rating ? findTitle.bestMatch : findId.bestMatch;

  // If the best score is very low, it might indicate no good match
  // You might want to set a threshold here, e.g., if (bestOverallMatch.rating < 0.7) return [];
  if (bestOverallMatch.rating === 0) {
    // If there's absolutely no similarity
    return []; // Or null, depending on your desired output for no match
  }

  // Filter for all matches that have the best overall score
  // and whose normalized title or ID matches the target that produced the best score.
  // This ensures we only pick results that genuinely contributed to the 'best' decision.
  const matches = normalizedResults.filter(r => {
    // Check if this result's normalized title matches the best target AND
    // if the best overall match came from a title comparison with this score.
    const isTitleMatch = r._title === bestOverallMatch.target && findTitle.bestMatch.rating === bestOverallMatch.rating;
    // Check if this result's normalized ID matches the best target AND
    // if the best overall match came from an ID comparison with this score.
    const isIdMatch = r._id === bestOverallMatch.target && findId.bestMatch.rating === bestOverallMatch.rating;

    return isTitleMatch || isIdMatch;
  });

  // If you want to return an array of formatted results
  if (matches.length > 0) {
    return matches.map(match => ({
      id: match.id || null,
      title: match.title || null,
      quality: match.quality || null,
      url: match.url || null,
      seasons: match.seasons || null,
      score: bestOverallMatch.rating, // All these results share the same best score
    }));
  } else {
    return null; // Or an empty array, depending on your preferred "no match" return value
  }
}

export function bestMovieTitle(title: string, results: ProviderSearchResults[]) {
  if (!results.length) return null;

  const normTvtitle = normalizeTitle(title);

  const normalizedResults = results.map(item => ({
    ...item,
    _title: normalizeTitle(item.title),
    _id: normalizeTitle(item.id),
  }));

  const findTitle = findBestMatch(
    normTvtitle,
    normalizedResults.map(r => r._title),
  );
  const findId = findBestMatch(
    normTvtitle,
    normalizedResults.map(r => r._id),
  );

  // Pick better of the two scores
  const bestOverallMatch = findTitle.bestMatch.rating >= findId.bestMatch.rating ? findTitle.bestMatch : findId.bestMatch;

  // If the best score is very low, it might indicate no good match
  // You might want to set a threshold here, e.g., if (bestOverallMatch.rating < 0.7) return [];
  if (bestOverallMatch.rating === 0) {
    // If there's absolutely no similarity
    return []; // Or null, depending on your desired output for no match
  }

  // Filter for all matches that have the best overall score
  // and whose normalized title or ID matches the target that produced the best score.
  // This ensures we only pick results that genuinely contributed to the 'best' decision.
  const matches = normalizedResults.filter(r => {
    // Check if this result's normalized title matches the best target AND
    // if the best overall match came from a title comparison with this score.
    const isTitleMatch = r._title === bestOverallMatch.target && findTitle.bestMatch.rating === bestOverallMatch.rating;
    // Check if this result's normalized ID matches the best target AND
    // if the best overall match came from an ID comparison with this score.
    const isIdMatch = r._id === bestOverallMatch.target && findId.bestMatch.rating === bestOverallMatch.rating;

    return isTitleMatch || isIdMatch;
  });

  // If you want to return an array of formatted results
  if (matches.length > 0) {
    return matches.map(match => ({
      id: match.id || null,
      title: match.title || null,
      quality: match.quality || null,
      url: match.url || null,
      releaseDate: match.releaseDate || null,
      score: bestOverallMatch.rating, // All these results share the same best score
    }));
  } else {
    return null; // Or an empty array, depending on your preferred "no match" return value
  }
}
