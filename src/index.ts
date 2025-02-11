////main file where everything gets exported
// export * as Anilist from './provider/meta/anilist/index.js'; the way to export stuff for building
// import { getCharacters, getInfoById } from "./meta/jikan/jikan";

// import {
//   fetchAnimeInfo,
//   fetchSources,
//   matchingSearcResponse,
// } from './provider/anime/animeZ/animeZ.js';
// import { Servers, Dubbing } from './provider/anime/hianime/types.js';
import { AnimeZ, HiAnime } from './provider/index.js';

// import {
//   getEpisodes,
//   getEpisodeInfo,
//   getEpisodeswithInfo,
// } from './provider/meta/jikan/jikan.js';
// import Meta from './provider/meta/meta.js';
// import { AnimeProvider, AnimeStatusFilter, Season } from './types/jikan.js';
// // getCharacters(16498)
const anitaku = new AnimeZ();
//   .search('one piece')
// matchingSearcResponse('bleach', 1)
//   .then((data) => console.log(data))
//   .catch((err) => console.error(err));
// anitaku
// .fetchSources("bleach-sennen-kessen-hen-soukoku-tan-episode-8")
// .then((data) => console.log(data))
// .catch((err) => console.error(err));
//bleach-thousandyear-blood-war-–-the-conflict-12505/epi-14dub-195280/
anitaku
  .fetchSources('bleach-thousandyear-blood-war-–-the-conflict-12505/epi-14dub-195280')
  //   // getEpisodeswithInfo(56784, 1, AnimeProvider.HiAnime)
  .then(data => console.log(data))
  .catch(err => console.error(err));
//
// const anitaku = new AnimeZ();
// import { fetchProviderId } from "./meta/anilist/fetchProviderId";
// fetchProviderId(163146)
// .then((data) => console.log(data))
// .catch((err) => console.error(err));

// const jikan = new Meta.Anilist();
// jikan
//   .search('bleach')
//   .then((data) => console.log(data))
//   .catch((err) => console.error(err));

// // 56784 52635 59989 41467  52635  269  40028  48583  51535

// getProviderId(59989)
//   .then((data) => console.log(data))
//   .catch((err) => console.error(err));

// const hianime = new HiAnime();
// hianime
//   .fetchInfo("bleach-thousand-year-blood-war-the-conflict-19322")
//   .then((data) => console.log(data))
//   .catch((err) => console.error(err));
// hianime
//   .fetchInfo("boruto-naruto-next-generations-8143")
//   .then((data) => console.log(data))
//   .catch((err) => console.error(err));
// hianime
//   .fetchSources('bleach-806-episode-13793', Servers.HD1, Dubbing.Sub)
//   .then((data: any) => console.log(data))
//   .catch((err: any) => console.error(err));
// ///boruto-naruto-next-generations-8143
