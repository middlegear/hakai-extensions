///hiAnime
const altZoroBaseUrl = 'https://aniwatchtv.to' as const; // works fine
const mainZoroBaseUrl = 'https://hianime.to' as const; /// main one
export const zoroBaseUrl = altZoroBaseUrl;
export const zoroSearch = `${zoroBaseUrl}/search` as const; ///keyword is the query params

/// animekai
export const animekaiBaseUrl = 'https://animekai.to' as const;
