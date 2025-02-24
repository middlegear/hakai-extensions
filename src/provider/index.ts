import { zoroClient } from '../config/clients.js';
import {
  USER_AGENT_HEADER,
  ACCEPT_ENCODING,
  ACCEPT_HEADER,
  animeZ_USER_AGENT_HEADER,
  anitaku_USER_AGENT_HEADER,
} from '../config/headers.js';

import MegaCloud from '../source-extractors/hianime/megacloud/index.js';

import {
  animeZBaseUrl,
  anitakuAjaxLoadEpisodes,
  anitakuBaseUrl,
  anitakuDomain,
  anitakuInfoUrl,
  anitakuSearchUrl,
  zoroBaseUrl,
  zoroSearch,
} from '../utils/constants.js';

import { HiAnime } from './anime/hianime/index.js';

export {
  USER_AGENT_HEADER,
  ACCEPT_ENCODING,
  ACCEPT_HEADER,
  animeZBaseUrl,
  animeZ_USER_AGENT_HEADER,
  anitakuAjaxLoadEpisodes,
  anitakuBaseUrl,
  anitakuDomain,
  anitakuInfoUrl,
  anitakuSearchUrl,
  anitaku_USER_AGENT_HEADER,
  zoroBaseUrl,
  zoroClient,
  zoroSearch,
  HiAnime,
  MegaCloud,
};
