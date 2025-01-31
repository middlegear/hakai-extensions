// import { getCharacters, getInfoById } from "./meta/jikan/jikan";

import { getProviderId } from "./meta/jikan/providers";
import { AnimeZ } from "./provider/anime/animeZ/animeZ";
import { Anitaku } from "./provider/anime/anitaku/anitaku";
import {
  fetchAnimeById,
  fetchAnimeCharacters,
  fetchPopular,
  fetchSeason,
  fetchTopAiring,
  fetchTopRated,
  searchAnime,
} from "./meta/anilist/anilist";
import { HiAnime } from "./provider/anime/hianime/hiAnime";
import { Dubbing, Servers } from "./provider/anime/hianime/types";
// getCharacters(16498)
// const anitaku = new Anitaku();

// anitaku
//   .fetchSources("bleach-sennen-kessen-hen-soukoku-tan-episode-8")
//   .then((data) => console.log(data))
//   .catch((err) => console.error(err));

// import { Anitaku } from "./provider/anime/anitaku/anitaku";
// import { HiAnime } from "./provider/anime/hianime/hiAnime";
// const anitaku = new AnimeZ();
// import { fetchProviderId } from "./meta/anilist/fetchProviderId";
// fetchProviderId(163146)
//   .then((data) => console.log(data))
//   .catch((err) => console.error(err));

// import Meta from "./meta";
// const jikan = new Meta.Jikan();

// // 56784 52635 59989 41467  52635  269  40028  48583  51535

// getProviderId(41467)
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
hianime
  .fetchSources(
    "boruto-naruto-next-generations-8143-episode-47159",
    Servers.HD1,
    Dubbing.Dub
  )
  .then((data) => console.log(data))
  .catch((err) => console.error(err));
///boruto-naruto-next-generations-8143
