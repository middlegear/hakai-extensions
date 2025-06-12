import { Anilist, AnimeKai, HiAnime, Jikan, Meta } from './provider';
import { Anime } from './provider/anime/anime';
import { TheMovieDb } from './provider/meta/tmdb';
import {
  getMovieInfo,
  getPopularMovies,
  getTopRatedMovies,
  getTrendingMovies,
  getTvEpisodes,
  getTvShowInfo,
  getUpcomingMovies,
  searchTmdbMovie,
  searchTVShows,
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
const data = await getTvEpisodes(59941, 1, 'b29bfe548cc2a3e4225effbd54ef0fda');
// const data = await _getServers('1167571', 'tv/watch-vincenzo-67955');
// const data = await _getsources('147', 'movie/bad-company-147');
// const data = await _getInfo('tv/watch-vincenzo-67955');
// const data = await _search('bad boys');
console.log(data);
// export { Anime, Meta, Anilist, Jikan, HiAnime, AnimeKai };
