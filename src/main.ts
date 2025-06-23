import { Meta, HiAnime, Anilist, Jikan, AnimeKai, FlixHQ, TvMaze, TheMovieDatabase, Anime } from './provider/index.js';
// import { _getsources } from './provider/movies/flixhq/flixhq.js';

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
// const data = await _getsources('1171939', 'vidcloud');
// console.log(data.data?.sources);
export { Anime, Meta, Anilist, Jikan, HiAnime, AnimeKai, FlixHQ, TheMovieDatabase, TvMaze };
