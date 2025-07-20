import { HiAnime } from './provider/anime/hianime/index.js';
import { Meta, Anilist, Jikan, AnimeKai, FlixHQ, TvMaze, TheMovieDatabase } from './provider/index.js';
import { Anime } from './provider/anime/anime.js';
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
// const data = await _getsources('movie-109831', 'akcloud');
// const data = await _getsources('episode-1019968', 'vidcloud');
// const flixhq = new FlixHQ();
//movie/final-destination-bloodlines-124888'
// const data = await flixhq.fetchMediaInfo('tv/watch-the-boys-33895');
// const data = await flixhq.fetchMediaInfo('movie/watch-bad-boys-ride-or-die-109831');
// const data = await flixhq.fetchMediaServers('movie-109831');
// const data = await flixhq.fetchMediaServers('episode-1019968');
// const hianime = new HiAnime();
// const data = await hianime.fetchSources('solo-leveling-18718-episode-119497', HiAnimeServers.HD2, SubOrDub.DUB);

// console.log(JSON.stringify(data));
// console.log(data.data?.sources);
export { Anime, Meta, Anilist, Jikan, HiAnime, AnimeKai, FlixHQ, TheMovieDatabase, TvMaze };
