////main file where everything gets exported
// export * as Anilist from './provider/meta/anilist/index.js'; the way to export stuff for building

import { Servers, Dubbing } from './provider/anime/hianime/types.js';
import { AnimeZ, HiAnime } from './provider/index.js';
import {
  fetchAnimeById,
  fetchTopAiring,
  fetchUpcoming,
  getEpisodeswithInfo,
  getRelated,
  getTrends,
} from './provider/meta/anilist/anilist.js';
import { Anilist } from './provider/meta/anilist/index.js';

import { getAnilistMapping, getMalMapping } from './provider/meta/anizip/index.js';
import { Jikan } from './provider/meta/jikan/index.js';
import { getAnimeCharacters } from './provider/meta/jikan/jikan.js';
import { AnimeProvider } from './types/types.js';

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
// anitaku;
// .fetchInfo('bleach-thousandyear-blood-war-–-the-conflict-12505')
// .fetchSources('bleach-thousandyear-blood-war-–-the-conflict-12505/epi-14dub-195280')
//   // getEpisodeswithInfo(56784, 1, AnimeProvider.HiAnime)
// .then(data => console.log(data))
// .catch(err => console.error(err));
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

const hianime = new HiAnime();
const jikan = new Anilist();

jikan
  .fetchInfo(269)

  // .fetchTrending()
  // getAnimeCharacters(269)

  // .fetchInfo(21)
  // getMalMapping(25519)
  .then((data: any) => console.log(data))
  .catch((err: any) => console.error(err));
