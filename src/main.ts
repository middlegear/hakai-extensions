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
import { _getInfo, _search } from './provider/movies/flixhq/flixhq';

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

const data = await _getInfo('movie/bad-boys-18997');
// const data = await anime.fetchSources('solo-leveling-18718-episode-119497', 'hd-2');
console.log(data);
// export { Anime, Meta, Anilist, Jikan, HiAnime, AnimeKai };
