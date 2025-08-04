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
import { _getMovieHash, _getTvHash, getMovieUrl } from './provider/movies/vidsrc/vidsrc.js';
import { Base64 } from './provider/movies/vidsrc/utils.js';

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
const data = await getMovieUrl(573435, 'cloudstream pro');
// const data = await _getTvHash(1399, 1, 1);
console.log(data.data);

// export { Anime, Meta, Anilist, Jikan, HiAnime, AnimeKai, FlixHQ, TheMovieDatabase, TvMaze };
