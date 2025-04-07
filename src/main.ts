import { Anime } from './provider/anime/anime';
import { Anilist, Jikan, Meta } from './provider';
import { HiAnime } from './provider/anime/hianime';
import { AnimeKai } from './provider/anime/animekai';

export { Anime, Meta, Anilist, Jikan, HiAnime, AnimeKai };
// const anime = new AnimeKai();
// const data = await anime.fetchSources('bleach-thousand-year-blood-war-the-conflict-zev9$ep=1$token=MIWzueTktEjhmW9Nj5TU');
// console.log(JSON.stringify(data));

import {
  AnimeKaiServers,
  type Seasons,
  type SubOrDub,
  type Sort,
  type JikanStatus,
  type AnilistStatus,
  type Format,
  type Charactersort,
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
