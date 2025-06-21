import { Anilist, AnimeKai, HiAnime, Jikan, Meta } from './provider';
import { Anime } from './provider/anime/anime';
import { TheMovieDb } from './provider/meta/tmdb';
import {
  _getPopularMovies,
  _getTrendingMovies,
  _getTrendingTv,
  getMovieInfo,
  _getTopRatedMovies,
  getTvEpisodes,
  getTvShowInfo,
  _getUpcomingMovies,
  searchTmdbMovie,
  searchTVShows,
  _getPopularTv,
  _getTopRatedTv,
  _getAiringTv,
  _getReleasingMovies,
} from './provider/meta/tmdb/tmdb';
import { _getInfo, _getServers, _getsources, _search } from './provider/movies/flixhq/flixhq';

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
// const data = await _getTrendingMovies('week', 3, 'b29bfe548cc2a3e4225effbd54ef0fda');
// const data = await _getPopularMovies(3, 'b29bfe548cc2a3e4225effbd54ef0fda');
// const data = await _getTopRatedMovies(9, 'b29bfe548cc2a3e4225effbd54ef0fda');
// const data = await _getUpcomingMovies(6, 'b29bfe548cc2a3e4225effbd54ef0fda');
// const data = await _getTrendingTv('day', 7, 'b29bfe548cc2a3e4225effbd54ef0fda');
// const data = await _getPopularTv(1, 'b29bfe548cc2a3e4225effbd54ef0fda');
// const data = await _getTopRatedTv(4, 'b29bfe548cc2a3e4225effbd54ef0fda');
// const data = await _getAiringTv(1, 'b29bfe548cc2a3e4225effbd54ef0fda');
// const data = await _getReleasingMovies(1, 'b29bfe548cc2a3e4225effbd54ef0fda');

const zoro = new HiAnime();
// const data = await zoro.fetchEpisodeServers('solo-leveling-18718-episode-119497');
const data = await zoro.fetchSources('solo-leveling-18718-episode-119497', 'hd-3', 'dub');
// const data = await _getServers('1167571');
// const data = await _getsources('1171939', 'vidcloud');
// const data = await _getInfo('tv/watch-vincenzo-67955');
// const data = await _search('bad boys');
// console.log(JSON.stringify(data));
console.log(data);
// export { Anime, Meta, Anilist, Jikan, HiAnime, AnimeKai };
