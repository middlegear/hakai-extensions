////main file where everything gets exported
// export * as Anilist from './provider/meta/anilist/index.js'; the way to export stuff for building

import { Servers, Dubbing } from './provider/anime/hianime/types.js';
import { AnimeZ, HiAnime } from './provider/index.js';
import {
  fetchAnimeById,
  fetchAnimeCharacters,
  fetchTopAiring,
  fetchUpcoming,
  getEpisodeswithInfo,
  getRelated,
  getTrends,
} from './provider/meta/anilist/anilist.js';
import { Anilist } from './provider/meta/anilist/index.js';

import { getAnilistMapping, getMalMapping } from './provider/meta/anizip/index.js';
import { Jikan } from './provider/meta/jikan/index.js';
import { getAnimeCharacters } from './provider/meta/jikan/jikan.js';
import { AnimeProvider, Charactersort } from './types/types.js';

const hianime = new HiAnime();
const jikan = new Anilist();

jikan
  .fetchAnimeEpisodes(21, AnimeProvider.HiAnime)
  .then((data: any) => console.log(data))
  .catch((err: any) => console.error(err));
// 163146
