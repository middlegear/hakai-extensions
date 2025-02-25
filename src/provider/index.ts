import { providerClient } from '../config/clients.js';

import { USER_AGENT_HEADER, ACCEPT_ENCODING, ACCEPT_HEADER } from '../config/headers.js';

import MegaCloud from '../source-extractors/megacloud/index.js';
import { MegaUp } from '../source-extractors/megaup/megaup.js';
import { animekaiBaseUrl, zoroBaseUrl, zoroSearch } from '../utils/constants.js';

import { RakuzanAnime } from './anime/rakuzananime/index.js';
import { KagamiAnime } from './anime/kagamianime/index.js';
export {
  USER_AGENT_HEADER,
  ACCEPT_ENCODING,
  ACCEPT_HEADER,
  providerClient,
  animekaiBaseUrl,
  zoroBaseUrl,
  zoroSearch,
  RakuzanAnime,
  KagamiAnime,
  MegaCloud,
  MegaUp,
};
