/**
 * Improved string similarity comparison focusing on TV show title matching
 */
export function compareTwoStrings(first: string, second: string): number {
  // Enhanced normalization for TV show titles
  const normalize = (str: string) => {
    return str
      .toLowerCase()
      .replace(/[^\w\s]|_/g, ' ') // Replace punctuation with spaces
      .replace(/\s+/g, ' ') // Collapse multiple spaces
      .trim();
  };

  first = normalize(first);
  second = normalize(second);

  if (first === second) return 1;

  const len1 = first.length;
  const len2 = second.length;

  // More lenient minimum length check
  if (len1 < 1 || len2 < 1) return 0;

  // Special case for very short strings
  if (len1 === 1 && len2 === 1) {
    return first[0] === second[0] ? 1 : 0;
  }

  const bigrams1 = new Set<string>();
  for (let i = 0; i < len1 - 1; i++) {
    const bigram = first.substr(i, 2);
    if (bigram.trim().length === 2) {
      // Only add proper 2-character bigrams
      bigrams1.add(bigram);
    }
  }

  let matches = 0;
  for (let i = 0; i < len2 - 1; i++) {
    const bigram = second.substr(i, 2);
    if (bigrams1.has(bigram)) {
      matches++;
    }
  }

  // More accurate denominator calculation
  const totalPossible = Math.max(len1, len2) - 1;
  return totalPossible > 0 ? matches / totalPossible : 0;
}

/**
 * Improved best match finder for TV show titles
 */
export function findBestMatch(main: string, targets: string[]) {
  if (typeof main !== 'string' || !Array.isArray(targets)) {
    throw new Error('Invalid arguments: main must be string and targets must be array');
  }

  if (targets.length === 0) {
    return {
      ratings: [],
      bestMatch: { target: '', rating: 0 },
      bestMatchIndex: -1,
    };
  }

  const normalizedMain = compareTwoStrings.normalize(main);
  const lenMain = normalizedMain.length;

  let bestIndex = 0;
  let bestRating = -1;
  const ratings = [];

  for (let i = 0; i < targets.length; i++) {
    const target = targets[i];
    const rating = compareTwoStrings(normalizedMain, target);
    ratings.push({ target, rating });

    if (rating > bestRating) {
      bestRating = rating;
      bestIndex = i;
    }
  }

  return {
    ratings,
    bestMatch: ratings[bestIndex],
    bestMatchIndex: bestIndex,
  };
}

compareTwoStrings.normalize = (str: string) => {
  return str
    .toLowerCase()
    .replace(/[^\w\s]|_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};
