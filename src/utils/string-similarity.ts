export function compareTwoStrings(first: string, second: string): number {
  first = first.trim().toLowerCase();
  second = second.trim().toLowerCase();

  if (first === second) return 1;
  if (first.length < 2 || second.length < 2) return 0;

  const firstBigrams = new Set<string>();
  for (let i = 0; i < first.length - 1; i++) {
    firstBigrams.add(first.substring(i, i + 2));
  }

  let intersectionSize = 0;
  // More efficient iteration: avoid repeated substring calls
  for (let i = 0, len = second.length - 1; i < len; i++) {
    const bigram = second.slice(i, i + 2); // Use slice for slight performance gain
    if (firstBigrams.has(bigram)) {
      intersectionSize++;
      // Consider if deletion is actually beneficial.  Often it isn't.
      // firstBigrams.delete(bigram);  // Removing can be slower than just counting
    }
  }

  return (2.0 * intersectionSize) / (first.length + second.length - 2);
}

export function findBestMatch(
  mainString: string,
  targetStrings: string[],
): {
  ratings: { target: string; rating: number }[];
  bestMatch: { target: string; rating: number };
  bestMatchIndex: number;
} {
  if (!isValidInput(mainString, targetStrings)) {
    throw new Error('Bad arguments: First argument should be a string, second should be an array of strings');
  }

  // Pre-calculate mainString bigrams outside the loop for significant performance improvement
  const mainStringBigrams = new Set<string>();
  const trimmedMainString = mainString.trim().toLowerCase();
  for (let i = 0; i < trimmedMainString.length - 1; i++) {
    mainStringBigrams.add(trimmedMainString.slice(i, i + 2));
  }

  const ratings = targetStrings.map(target => ({
    target,
    /// tricky
    rating: compareTwoStringsOptimized(trimmedMainString, target.trim().toLowerCase(), mainStringBigrams), // Use optimized comparison
  }));

  let bestRating = -1;
  let bestMatchIndex = -1;
  for (let i = 0; i < ratings.length; i++) {
    if (ratings[i].rating > bestRating) {
      bestRating = ratings[i].rating;
      bestMatchIndex = i;
    }
  }

  return {
    ratings,
    bestMatch: ratings[bestMatchIndex],
    bestMatchIndex,
  };
}

function compareTwoStringsOptimized(first: string, second: string, firstBigrams: Set<string>): number {
  if (first === second) return 1;
  if (first.length < 2 || second.length < 2) return 0;

  let intersectionSize = 0;
  for (let i = 0, len = second.length - 1; i < len; i++) {
    const bigram = second.slice(i, i + 2);
    if (firstBigrams.has(bigram)) {
      intersectionSize++;
    }
  }

  return (2.0 * intersectionSize) / (first.length + second.length - 2);
}

function isValidInput(mainString: string, targetStrings: string[]): boolean {
  return (
    typeof mainString === 'string' &&
    Array.isArray(targetStrings) &&
    targetStrings.length > 0 &&
    targetStrings.every(str => typeof str === 'string')
  );
}
