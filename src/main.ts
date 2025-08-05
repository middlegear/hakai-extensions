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
import { _getEmbedMovieUrl } from './provider/movies/embed/2embed.js';

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
// const tmdb = new TheMovieDatabase();
// const data = await tmdb.fetchTvSources(90228, 1, 4);
// const data = await tmdb.fetchMovieSources(1146972, '2embed');
// const data = await _getEmbedMovieUrl(1146972);

// console.log(data.data);

export { Anime, Meta, Anilist, Jikan, HiAnime, AnimeKai, FlixHQ, TheMovieDatabase, TvMaze };
