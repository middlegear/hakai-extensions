import { providerClient } from '../config/clients.js';
import { USER_AGENT_HEADER, ACCEPT_ENCODING, ACCEPT_HEADER } from '../config/headers.js';
import MegaCloud from '../source-extractors/megacloud/megacloud.js';
// import { MegaUp } from '../source-extractors/megaup/megaup.js';
import { animekaiBaseUrl, zoroBaseUrl, zoroSearch } from '../utils/constants.js';
import { AnimeKai } from './anime/animekai/index.js';
import { HiAnime } from './anime/hianime/index.js';
import { Meta } from './meta/meta.js';
import { Anilist } from './meta/anilist/index.js';
import { Jikan } from './meta/jikan/index.js';
import { SubOrDub } from '../types/types.js';
export {
  USER_AGENT_HEADER,
  ACCEPT_ENCODING,
  ACCEPT_HEADER,
  providerClient,
  animekaiBaseUrl,
  zoroBaseUrl,
  zoroSearch,
  MegaCloud,
  // MegaUp,
  AnimeKai,
  SubOrDub,
  HiAnime,
  Meta,
  Anilist,
  Jikan,
};
