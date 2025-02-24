import type { AxiosRequestConfig } from 'axios';
import { ACCEPT_ENCODING, ACCEPT_HEADER, USER_AGENT_HEADER } from './headers.js';
import axios from 'axios';

const client: AxiosRequestConfig = {
  timeout: 5000,
  headers: {
    Accept: ACCEPT_HEADER,
    'Content-Encoding': ACCEPT_ENCODING,
    'User-Agent': USER_AGENT_HEADER,
  },
};

const providerClient = axios.create(client);

export { providerClient };
