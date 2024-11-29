export const anitakuDomain = "anitaku.bz" as const;
export const anitakuBaseUrl = `https://${anitakuDomain}` as const;
export const anitakuSearchUrl = `${anitakuBaseUrl}/search.html` as const; ///remember to add ?keyword=
export const anitakuInfoUrl = `${anitakuBaseUrl}/category` as const; //remember to add  trailing slash/
export const anitakuAjaxLoadEpisodes =
  `https://ajax.gogocdn.net/ajax/load-list-episode` as const;
// const bookmarkInfo = "https://gogotaku.info/";
export const anitaku_USER_AGENT_HEADER =
  "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36" as const;
export const anitaku_ACCEPT_ENCODING_HEADER =
  "gzip, deflate, br, zstd" as const;
export const anitaku_ACCEPT_HEADER =
  "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8" as const;
