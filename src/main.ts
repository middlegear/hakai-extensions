import { Meta, HiAnime, Anilist, Jikan, AnimeKai, FlixHQ, TvMaze, TheMovieDatabase, Anime } from './provider/index.js';
import { _getMovieProviderId } from './provider/meta/tmdb/mapping.js';

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
// const data = await _getTrendingMovies('week', 3, 'b29bfe548cc2a3e4225effbd54ef0fda');
// const data = await _getPopularMovies(3, 'b29bfe548cc2a3e4225effbd54ef0fda');
// const data = await _getTopRatedMovies(9, 'b29bfe548cc2a3e4225effbd54ef0fda');
// const data = await _getUpcomingMovies(6, 'b29bfe548cc2a3e4225effbd54ef0fda');
// const data = await _getTrendingTv('day', 7, 'b29bfe548cc2a3e4225effbd54ef0fda');
// const data = await _getPopularTv(1, 'b29bfe548cc2a3e4225effbd54ef0fda');
// const data = await _getTopRatedTv(4, 'b29bfe548cc2a3e4225effbd54ef0fda');
// const data = await _getAiringTv(1, 'b29bfe548cc2a3e4225effbd54ef0fda');
// const data = await _getReleasingMovies(1, 'b29bfe548cc2a3e4225effbd54ef0fda');
// const data = await _getTvProviderId(79744);
// const data = await _getMovieProviderId(353081);

// const zoro = new HiAnime();
// const data = await zoro.fetchEpisodeServers('solo-leveling-18718-episode-119497');
// const data = await zoro.fetchSources('solo-leveling-18718-episode-119497', 'hd-3', 'dub');

// const data = await _getServers('1167571');
// const data = await _getsources('1171939', StreamingServers.Akcloud);
// const data = await _getInfo('tv/watch-vincenzo-67955');
// const data = await _search('bad boys');
// console.log(JSON.stringify(data));
// console.log(data);
export { Anime, Meta, Anilist, Jikan, HiAnime, AnimeKai, FlixHQ, TheMovieDatabase, TvMaze };
