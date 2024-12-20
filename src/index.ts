import {
  getCharacters,
  getCurrentSeason,
  getInfoById,
  getNextSeason,
  getSeason,
  getTopAnime,
} from "./meta/jikan/jikan";
import { Season } from "./meta/jikan/types";

getTopAnime()
  .then((data) => console.log(data))
  .catch((err) => console.error(err));
