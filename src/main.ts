import { Anime } from './provider/anime/anime';
import { Anilist, Jikan, Meta } from './provider';
import { HiAnime } from './provider/anime/hianime';
import { AnimeKai } from './provider/anime/animekai';

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
export { Anime, Meta, Anilist, Jikan, HiAnime, AnimeKai };
// const anime = new AnimeKai();
// const data = await anime.fetchSources('solo-leveling-season-2-arise-from-the-shadow-x7rq$ep=3$token=L4Hk-fHztBWzhH5Xy4mH');
// console.log(data);
// const data = await anime.fetchAnimeProviderEpisodes(5114, 'animekai');

// console.log(data);
