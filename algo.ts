interface Title {
  english: string | null;
  romaji: string | null;
  native: string | null;
  userPreferred: string;
}

export type StringMatchType = "strict" | "loose" | "fuzzy";

interface MatchResult {
  index: number;
  similarity: number;
  bestMatch: Result;
  matchType: StringMatchType;
}

function wordMatchPercentage(titleA: string, titleB: string): number {
  const wordsA = titleA.split(/\s+/);
  const wordsB = titleB.split(/\s+/);
  const totalWords = Math.max(wordsA.length, wordsB.length);

  // Count matching words
  const matchingWords = wordsA.filter((wordA) => wordsB.includes(wordA)).length;

  // Calculate percentage
  return matchingWords / totalWords;
}

function hasExtraWords(
  titleA: string,
  titleB: string,
  maxExtraWords: number = 2
): boolean {
  const wordsA = titleA.split(/\s+/);
  const wordsB = titleB.split(/\s+/);
  const difference = Math.abs(wordsA.length - wordsB.length);

  return difference > maxExtraWords;
}

function hasMatchingNumbers(titleA: string, titleB: string): boolean {
  const numberPattern = /\d+/g;
  const numbersA = titleA.match(numberPattern) || [];
  const numbersB = titleB.match(numberPattern) || [];

  if (numbersA.length === 0 && numbersB.length === 0) return true; // no numbers in either title
  return numbersA.some((num) => (numbersB as RegExpExecArray).includes(num));
}

export function findBestMatchedAnime(
  title: Title | undefined,
  titles: Result[] | undefined
): MatchResult | null {
  if (!title || !titles || titles.length === 0) {
    return null;
  }

  const sanitizedTitleOptions = [
    sanitizeTitle(title.romaji ?? ""),
    sanitizeTitle(title.english ?? ""),
    sanitizeTitle(title.native ?? ""),
    sanitizeTitle(title.userPreferred ?? ""),
  ].filter(Boolean);

  if (sanitizedTitleOptions.length === 0) {
    return null;
  }

  const sanitizedResults = titles.map((result) => ({
    ...result,
    sanitizedTitle: sanitizeTitle(result.title as string),
  }));

  // First check for strict matches (exact matches)
  for (let i = 0; i < sanitizedResults.length; i++) {
    if (sanitizedTitleOptions.includes(sanitizedResults[i].sanitizedTitle)) {
      return {
        index: i,
        similarity: 1,
        bestMatch: sanitizedResults[i],
        matchType: "strict",
      };
    }
  }

  // Next check for loose matches (substring or partial matches)
  for (let i = 0; i < sanitizedResults.length; i++) {
    const sanitizedResult = sanitizedResults[i].sanitizedTitle;

    const isLooseMatch = sanitizedTitleOptions.some((sanitizedTitle) => {
      const matchPercentage = wordMatchPercentage(
        sanitizedResult,
        sanitizedTitle
      );

      // Ensure at least 80% word match
      const isWordMatch = matchPercentage >= 0.8;

      // Ensure titles don't have too many extra words
      const hasFewExtraWords = !hasExtraWords(sanitizedResult, sanitizedTitle);

      // Ensure numbers (like seasons) match correctly
      const hasNumberMatch = hasMatchingNumbers(
        sanitizedResult,
        sanitizedTitle
      );

      return isWordMatch && hasFewExtraWords && hasNumberMatch;
    });

    if (isLooseMatch) {
      return {
        index: i,
        similarity: 0.8, // loose matches are not perfect
        bestMatch: sanitizedResults[i],
        matchType: "loose",
      };
    }
  }

  let bestMatchIndex = -1;
  let highestSimilarity = 0;
  const similarityThreshold = 0.7; // Minimum similarity for fuzzy matching to be considered a valid match

  // Fuzzy matching as fallback
  sanitizedResults.forEach((result, index) => {
    const bestMatch = stringSimilarity.findBestMatch(
      result.sanitizedTitle,
      sanitizedTitleOptions
    );

    if (bestMatch.bestMatch.rating > highestSimilarity) {
      highestSimilarity = bestMatch.bestMatch.rating;
      bestMatchIndex = index;
    }
  });

  // If no fuzzy match meets the threshold, return null
  if (highestSimilarity < similarityThreshold || bestMatchIndex === -1) {
    return null;
  }

  return {
    index: bestMatchIndex,
    similarity: highestSimilarity,
    bestMatch: sanitizedResults[bestMatchIndex],
    matchType: "fuzzy",
  };
}
