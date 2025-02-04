// file to handle imports and exports
import { animeZClient, anitakuClient, zoroClient } from '../config/clients.js';
import {
  USER_AGENT_HEADER,
  ACCEPT_ENCODING,
  ACCEPT_HEADER,
  animeZ_USER_AGENT_HEADER,
  anitaku_USER_AGENT_HEADER,
} from '../config/headers.js';
//
import { GogoServer } from '../source-extractors/anitaku/gogoserver.js';
import { MP4Upload } from '../source-extractors/anitaku/mp4upload.js';
import { StreamWish } from '../source-extractors/anitaku/streamwish.js';
import { VidHide } from '../source-extractors/anitaku/vidhide.js';
import MegaCloud from '../source-extractors/hianime/megacloud/index.js';
import { puppeteer } from '../source-extractors/hianime/puppeteer.js';

///
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
import { AnimeZ } from './anime/animeZ/index.js';
import { Anitaku } from './anime/anitaku/index.js';
import { HiAnime } from './anime/hianime/index.js';

export {
  USER_AGENT_HEADER,
  ACCEPT_ENCODING,
  ACCEPT_HEADER,
  animeZBaseUrl,
  animeZClient,
  animeZ_USER_AGENT_HEADER,
  anitakuAjaxLoadEpisodes,
  anitakuBaseUrl,
  anitakuClient,
  anitakuDomain,
  anitakuInfoUrl,
  anitakuSearchUrl,
  anitaku_USER_AGENT_HEADER,
  zoroBaseUrl,
  zoroClient,
  zoroSearch,
  HiAnime,
  AnimeZ,
  Anitaku,
  GogoServer,
  MP4Upload,
  StreamWish,
  VidHide,
  puppeteer,
  MegaCloud,
};
