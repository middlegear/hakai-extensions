///hiAnime
const altZoroBaseUrl = 'https://aniwatchtv.to' as const; // works fine
const mainZoroBaseUrl = 'https://hianimez.to' as const; /// main one
export const zoroBaseUrl = mainZoroBaseUrl;
export const zoroSearch = `${zoroBaseUrl}/search` as const; ///keyword is the query params

/// animekai
const kaicodex = 'https://kaicodex-level-1.vercel.app';
export const animekaiBaseUrl = 'https://animekai.to' as const;
