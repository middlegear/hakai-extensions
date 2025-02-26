import { providerClient } from '../config/clients.js';
import { USER_AGENT_HEADER, ACCEPT_ENCODING, ACCEPT_HEADER } from '../config/headers.js';
import MegaCloud from '../source-extractors/megacloud/index.js';
import { MegaUp } from '../source-extractors/megaup/megaup.js';
import { animekaiBaseUrl, zoroBaseUrl, zoroSearch } from '../utils/constants.js';
import { Anime } from './anime/anime.js';
import { AnimeKai } from './anime/animekai/index.js';
import { HiAnime } from './anime/hianime/index.js';
import { Meta } from './meta/meta.js';
export {
  USER_AGENT_HEADER,
  ACCEPT_ENCODING,
  ACCEPT_HEADER,
  providerClient,
  animekaiBaseUrl,
  zoroBaseUrl,
  zoroSearch,
  MegaCloud,
  MegaUp,
  AnimeKai,
  Anime,
  HiAnime,
  Meta,
};
