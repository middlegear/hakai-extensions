import { providerClient } from '../config/clients.js';
import { USER_AGENT_HEADER, ACCEPT_ENCODING, ACCEPT_HEADER } from '../config/headers.js';

import { animekaiBaseUrl, zoroBaseUrl, zoroSearch } from '../utils/constants.js';
import { AnimeKai } from './anime/animekai/index.js';
import { HiAnime } from './anime/hianime/index.js';
import { Meta } from './meta/meta.js';
import { Anilist } from './meta/anilist/index.js';
import { Jikan } from './meta/jikan/index.js';
import { TheMovieDatabase } from './meta/tmdb/index.js';
import { TvMaze } from './meta/tvmaze/index.js';
import { FlixHQ } from './movies/flixhq/index.js';
import { SubOrDub } from '../types/types.js';
import { Anime } from './anime/anime.js';
import MegaCloud from '../source-extractors/megacloud.js';
export {
  USER_AGENT_HEADER,
  ACCEPT_ENCODING,
  ACCEPT_HEADER,
  providerClient,
  animekaiBaseUrl,
  zoroBaseUrl,
  zoroSearch,
  MegaCloud,
  AnimeKai,
  SubOrDub,
  HiAnime,
  Anime,
  Meta,
  Anilist,
  TheMovieDatabase,
  TvMaze,
  FlixHQ,
  Jikan,
};
