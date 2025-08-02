import { HiAnime } from './provider/anime/hianime/index.js';
import { Meta, Anilist, Jikan, AnimeKai, FlixHQ, TvMaze, TheMovieDatabase } from './provider/index.js';
import { Anime } from './provider/anime/anime.js';

import {
  AnimeKaiServers,
  Seasons,
  SubOrDub,
  Sort,
  StreamingServers,
  TimeWindow,
  JikanStatus,
  AnilistStatus,
  Format,
  Charactersort,
  HiAnimeServers,
  AnimeProvider,
} from './types/index.js';

export {
  Seasons,
  SubOrDub,
  Sort,
  JikanStatus,
  AnilistStatus,
  Format,
  Charactersort,
  AnimeKaiServers,
  HiAnimeServers,
  TimeWindow,
  StreamingServers,
  AnimeProvider,
};
// const flixhq = new FlixHQ();
//movie/final-destination-bloodlines-124888'
// const data = await flixhq.fetchSources('episode-1019968');
const hianime = new HiAnime();
const data = await hianime.fetchSources('solo-leveling-18718-episode-119497', HiAnimeServers.HD2, SubOrDub.DUB);
console.log(JSON.stringify(data));
// export { Anime, Meta, Anilist, Jikan, HiAnime, AnimeKai, FlixHQ, TheMovieDatabase, TvMaze };
