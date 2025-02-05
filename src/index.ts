////main file where everything gets exported
// import { getCharacters, getInfoById } from "./meta/jikan/jikan";

import { Servers, Dubbing } from './provider/anime/hianime/types.js';
import { HiAnime } from './provider/index.js';
import { getProviderId } from './provider/meta/jikan/providers.js';
import Meta from './provider/meta/meta.js';
import { AnimeStatusFilter, Season } from './types/jikan.js';

// getCharacters(16498)
// const anitaku = new Anitaku();

// anitaku
//   .fetchSources("bleach-sennen-kessen-hen-soukoku-tan-episode-8")
//   .then((data) => console.log(data))
//   .catch((err) => console.error(err));

//
// const anitaku = new AnimeZ();
// import { fetchProviderId } from "./meta/anilist/fetchProviderId";
// fetchProviderId(163146)
//   .then((data) => console.log(data))
//   .catch((err) => console.error(err));

const jikan = new Meta.Anilist();
jikan
  .search('bleach')
  .then((data) => console.log(data))
  .catch((err) => console.error(err));

// // 56784 52635 59989 41467  52635  269  40028  48583  51535

// getProviderId(59989)
//   .then((data) => console.log(data))
//   .catch((err) => console.error(err));

const hianime = new HiAnime();
// hianime
//   .fetchInfo("bleach-thousand-year-blood-war-the-conflict-19322")
//   .then((data) => console.log(data))
//   .catch((err) => console.error(err));
// hianime
//   .fetchInfo("boruto-naruto-next-generations-8143")
//   .then((data) => console.log(data))
//   .catch((err) => console.error(err));
// hianime
//   .fetchSources(
//     'boruto-naruto-next-generations-8143-episode-47159',
//     Servers.HD1,
//     Dubbing.Dub
//   )
//   .then((data: any) => console.log(data))
//   .catch((err: any) => console.error(err));
// ///boruto-naruto-next-generations-8143
