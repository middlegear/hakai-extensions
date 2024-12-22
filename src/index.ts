// import { getCharacters, getInfoById } from "./meta/jikan/jikan";

import { getAnimeTitle } from "./meta/jikan/promise";

// getCharacters(16498)
//   .then((data) => console.log(data))
//   .catch((err) => console.error(err));

// import { Anitaku } from "./provider/anime/anitaku/anitaku";
// import { HiAnime } from "./provider/anime/hianime/hiAnime";
// const anitaku = new HiAnime();
// anitaku
//   .search("Bleach: Thousand-Year Blood War - The Conflict")
//   .then((data) => console.log(data))
//   .catch((err) => console.error(err));

// import Meta from "./meta";
// const anilist = new Meta.Anilist();
// anilist.fetchInfo
getAnimeTitle(269)
  .then((data) => console.log(data))
  .catch((err) => console.error(err));
