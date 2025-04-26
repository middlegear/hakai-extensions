export function compareTwoStrings(first: string, second: string): number {
  first = first.trim().toLowerCase();
  second = second.trim().toLowerCase();

  const len1 = first.length;
  const len2 = second.length;

  if (first === second) return 1;
  if (len1 < 2 || len2 < 2) return 0;

  const bigrams1 = new Set<string>();
  for (let i = 0; i < len1 - 1; i++) {
    bigrams1.add(first[i] + first[i + 1]);
  }

  let matches = 0;
  for (let i = 0; i < len2 - 1; i++) {
    if (bigrams1.has(second[i] + second[i + 1])) {
      matches++;
    }
  }

  return (2 * matches) / (len1 + len2 - 2);
}

export function findBestMatch(main: string, targets: string[]) {
  if (typeof main !== 'string' || !Array.isArray(targets) || targets.length === 0) {
    throw new Error('Bad arguments');
  }

  const mainTrimmed = main.trim().toLowerCase();
  const lenMain = mainTrimmed.length;

  if (lenMain < 2) {
    return {
      ratings: targets.map(t => ({ target: t, rating: 0 })),
      bestMatch: { target: targets[0], rating: 0 },
      bestMatchIndex: 0,
    };
  }

  const bigrams = new Set<string>();
  for (let i = 0; i < lenMain - 1; i++) {
    bigrams.add(mainTrimmed[i] + mainTrimmed[i + 1]);
  }

  let bestIndex = 0;
  let bestRating = -1;

  const ratings = targets.map((t, i) => {
    const s = t.trim().toLowerCase();
    const lenS = s.length;

    if (lenS < 2) return { target: t, rating: 0 };

    let score = 0;
    for (let j = 0; j < lenS - 1; j++) {
      if (bigrams.has(s[j] + s[j + 1])) {
        score++;
      }
    }

    const rating = (2 * score) / (lenMain + lenS - 2);

    if (rating > bestRating) {
      bestRating = rating;
      bestIndex = i;
    }

    return { target: t, rating };
  });

  return {
    ratings,
    bestMatch: ratings[bestIndex],
    bestMatchIndex: bestIndex,
  };
}
