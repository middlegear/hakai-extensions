// console.log("Hello via Bun!");
// import { HiAnime } from "./provider/anime/hianime/hiAnime";
// import { AnimeZ } from "./provider/anime/animeZ/animeZ";
import { Anitaku } from "./provider/anime/anitaku/anitaku";

const zoro = new Anitaku();
zoro
  .fetchSources("bleach-sennen-kessen-hen-ketsubetsu-tan-episode-1")
  .then((data) => console.log(data))
  .catch((err) => console.error(err));

// const zoro = new HiAnime();
// zoro
//   .fetchSources(
//     "bleach-thousand-year-blood-war-the-conflict-19322-episode-128444"
//   )
//   .then((data) => console.log(data))
//   .catch((err) => console.error(err));
//
// const o = new AnimeZ();
// o.search("bleach")
//   .then((data) => console.log(data))
//   .catch((err) => console.error(err));

///

// const o = new AnimeZ();
// o.fetchInfo("bleach-thousandyear-blood-war-–-the-conflict-12505")
//   .then((data) => console.log(data))
//   .catch((err) => console.error(err));

// const o = new AnimeZ();
// o.fetchSources("the-uninhabited-wonderland-12554/epi-27-192290/")
//   .then((data) => console.log(data))
//   .catch((err) => console.error(err))
