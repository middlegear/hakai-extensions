// console.log("Hello via Bun!");
import HiAnime from "./provider/anime/hianime/hiAnime";
const zoro = new HiAnime();
zoro
  .search("")
  .then((data) => console.log(data))
  .catch((err) => console.error(err));
