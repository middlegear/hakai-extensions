import { providerClient } from '../config/clients.js';

import { USER_AGENT_HEADER, ACCEPT_ENCODING, ACCEPT_HEADER } from '../config/headers.js';

import MegaCloud from '../source-extractors/megacloud/index.js';

import { animekaiBaseUrl, zoroBaseUrl, zoroSearch } from '../utils/constants.js';

import { HiAnime } from './anime/hianime/index.js';

export {
  USER_AGENT_HEADER,
  ACCEPT_ENCODING,
  ACCEPT_HEADER,
  providerClient,
  animekaiBaseUrl,
  zoroBaseUrl,
  zoroSearch,
  HiAnime,
  MegaCloud,
};
