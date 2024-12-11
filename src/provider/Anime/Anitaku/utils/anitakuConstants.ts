export const anitakuDomain = "anitaku.bz" as const;
export const anitakuBaseUrl = `https://${anitakuDomain}` as const;
export const anitakuSearchUrl = `${anitakuBaseUrl}/search.html` as const; ///remember to add ?keyword=
export const anitakuInfoUrl = `${anitakuBaseUrl}/category` as const; //remember to add  trailing slash/
export const anitakuAjaxLoadEpisodes =
  `https://ajax.gogocdn.net/ajax/load-list-episode` as const;
// const bookmarkInfo = "https://gogotaku.info/";
