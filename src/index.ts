// console.log("Hello via Bun!");
// import HiAnime from "./provider/anime/hianime/hiAnime";
// import { AnimeZ } from "./provider/anime/animeZ/animeZ";
import { Anitaku } from "./provider/anime/anitaku/anitaku";

const zoro = new Anitaku();
zoro
  .fetchSources("bleach-sennen-kessen-hen-soukoku-tan-episode-8")
  .then((data) => console.log(data))
  .catch((err) => console.error(err));

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
