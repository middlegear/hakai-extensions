// console.log("Hello via Bun!");
// import HiAnime from "./provider/anime/hianime/hiAnime";
import { AnimeZ } from "./provider/anime/animeZ/animeZ";
import { Anitaku } from "./provider/anime/anitaku/anitaku";

// const zoro = new Anitaku();
// zoro
//   .search("bleach")
//   .then((data) => console.log(data))
//   .catch((err) => console.error(err));

//
// const o = new AnimeZ();
// o.search("bleach")
//   .then((data) => console.log(data))
//   .catch((err) => console.error(err));

///

const o = new AnimeZ();
o.fetchInfo("/bleach-thousandyear-blood-war-–-the-conflict-12505")
  .then((data) => console.log(data))
  .catch((err) => console.error(err));
