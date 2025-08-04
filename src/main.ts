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
import { getMovieUrl, getTvUrl } from './provider/movies/vidsrc/vidsrc.js';

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
// const data = await getMovieUrl(1146972, '2embed');
// const data = await getTvUrl(90228, 1, 5, '2embed');
// console.log(data.data);

export { Anime, Meta, Anilist, Jikan, HiAnime, AnimeKai, FlixHQ, TheMovieDatabase, TvMaze };
