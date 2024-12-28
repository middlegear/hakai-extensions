// import { getCharacters, getInfoById } from "./meta/jikan/jikan";

import { getProviderId } from "./meta/jikan/providers";
import { AnimeZ } from "./provider/anime/animeZ/animeZ";
import {
  fetchAnimeById,
  fetchPopular,
  fetchSeason,
  fetchTopAiring,
  fetchTopRated,
  searchAnime,
} from "./meta/anilist/anilist";
// getCharacters(16498)
//   .then((data) => console.log(data))
//   .catch((err) => console.error(err));

// import { Anitaku } from "./provider/anime/anitaku/anitaku";
// import { HiAnime } from "./provider/anime/hianime/hiAnime";
// const anitaku = new AnimeZ();

fetchPopular()
  .then((data) => console.log(data))
  .catch((err) => console.error(err));

// import Meta from "./meta";
// const jikan = new Meta.Jikan();

// // 56784 52635 59989 41467  52635  269  40028  48583  51535
// jikan
//   .fetchProviderId(41467)
//   .then((data) => console.log(data))
//   .catch((err) => console.error(err));
