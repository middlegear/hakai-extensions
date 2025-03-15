import { Anime } from './provider/anime/anime';
import { Anilist, Jikan, Meta } from './provider';
import { HiAnime } from './provider/anime/hianime';
import { AnimeKai } from './provider/anime/animekai';

// export { Anime, Meta, Anilist, Jikan, HiAnime, AnimeKai };
const animekai = new Anime.AnimeKai();
// const search = await animekai.search('bleach');
// console.log(search);

// const info = await animekai.fetchAnimeInfo('bleach-thousand-year-blood-war-the-conflict-zev9');
// console.log(info);

// const servers = await animekai.fetchServers(
//   'bleach-thousand-year-blood-war-the-conflict-zev9$ep=1$token=MIWzueTktEjhmW9Nj5TU',
// );
// console.log(servers);

// const sources = await animekai.fetchSources(
//   'bleach-thousand-year-blood-war-the-conflict-zev9$ep=1$token=MIWzueTktEjhmW9Nj5TU',
// );
// const sources = await animekai.fetchSources('solo-leveling-18718-episode-119497');
const anilist = new Jikan();
///5114
const AnilistEpisodes = await anilist.fetchTopAiring();
console.log(AnilistEpisodes);

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
