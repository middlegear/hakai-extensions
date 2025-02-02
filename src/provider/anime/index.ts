// file to handle imports and export for anime
import { animeZClient, anitakuClient, zoroClient } from '../../config/clients';
import {
  USER_AGENT_HEADER,
  ACCEPT_ENCODING,
  ACCEPT_HEADER,
  anitaku_USER_AGENT_HEADER,
  animeZ_USER_AGENT_HEADER,
} from '../../config/headers';
import { GogoServer } from '../../source-extractors/anitaku/gogoserver';
import { MP4Upload } from '../../source-extractors/anitaku/mp4upload';
import { StreamWish } from '../../source-extractors/anitaku/streamwish';
import { VidHide } from '../../source-extractors/anitaku/vidhide';
import { puppeteer } from '../../source-extractors/hianime/puppeteer';
import {
  zoroBaseUrl,
  zoroSearch,
  anitakuDomain,
  anitakuBaseUrl,
  anitakuAjaxLoadEpisodes,
  animeZBaseUrl,
  anitakuInfoUrl,
  anitakuSearchUrl,
} from '../../utils/constants';

///

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
  GogoServer,
  MP4Upload,
  StreamWish,
  VidHide,
  puppeteer,
};
