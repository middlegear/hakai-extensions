import { Anime } from './provider/anime/anime';
import { Anilist, Jikan, Meta } from './provider';
import { HiAnime } from './provider/anime/hianime';
import { AnimeKai } from './provider/anime/animekai';

// export { Anime, Meta, Anilist, Jikan, HiAnime, AnimeKai };

const animeka = new AnimeKai();
const data = await animeka.search('solo');
console.log(data);
import {
  type Seasons,
  type SubOrDub,
  type Sort,
  type JikanStatus,
  type AnilistStatus,
  type Format,
  type Charactersort,
  type AnimeKaiServers,
  type HiAnimeServers,
  type AnimeProvider,
} from './types/index';

export {
  type Seasons,
  type SubOrDub,
  type Sort,
  type JikanStatus,
  type AnilistStatus,
  type Format,
  type Charactersort,
  type AnimeKaiServers,
  type HiAnimeServers,
  type AnimeProvider,
};
