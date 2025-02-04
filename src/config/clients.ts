import type { AxiosRequestConfig } from 'axios';
import {
  ACCEPT_ENCODING,
  ACCEPT_HEADER,
  animeZ_USER_AGENT_HEADER,
  anitaku_USER_AGENT_HEADER,
  USER_AGENT_HEADER,
} from './headers.js';
import axios from 'axios';

const client: AxiosRequestConfig = {
  timeout: 4000,
  headers: {
    Accept: ACCEPT_HEADER,
    'Content-Encoding': ACCEPT_ENCODING,
    'User-Agent': animeZ_USER_AGENT_HEADER,
  },
};

const axiosAnitaku: AxiosRequestConfig = {
  timeout: 4000,
  headers: {
    'User-Agent': anitaku_USER_AGENT_HEADER,
    Accept: ACCEPT_HEADER,
    'Content-Encoding': ACCEPT_ENCODING,
  },
};

const axiosZoro: AxiosRequestConfig = {
  timeout: 4000,
  headers: {
    Accept: ACCEPT_HEADER,
    'Content-Encoding': ACCEPT_ENCODING,
    'User-Agent': USER_AGENT_HEADER,
  },
};

const zoroClient = axios.create(axiosZoro);

const anitakuClient = axios.create(axiosAnitaku);

const animeZClient = axios.create(client);

export { animeZClient, anitakuClient, zoroClient };
