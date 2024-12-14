// console.log("Hello via Bun!");
// import HiAnime from "./provider/anime/hianime/hiAnime";
import { Anitaku } from "./provider/anime/anitaku/anitaku";
const zoro = new Anitaku();
zoro
  .search("bleach")
  .then((data) => console.log(data))
  .catch((err) => console.error(err));
