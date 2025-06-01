// import { Anime } from './provider/anime/anime';
// import { Anilist, Jikan, Meta } from './provider';
// import { HiAnime } from './provider/anime/hianime';
// import { AnimeKai } from './provider/anime/animekai';

import { Anilist, Jikan } from './provider';
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

