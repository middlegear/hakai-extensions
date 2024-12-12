import type { AxiosRequestConfig } from "axios";
import {
  ACCEPT_ENCODING,
  ACCEPT_HEADER,
  animeZ_USER_AGENT_HEADER,
} from "./headers";
import axios from "axios";

const client: AxiosRequestConfig = {
  timeout: 4000,
  headers: {
    Accept: ACCEPT_HEADER,
    "Content-Encoding": ACCEPT_ENCODING,
    "User-Agent": animeZ_USER_AGENT_HEADER,
  },
};

const animeZClient = axios.create(client);
export { animeZClient };
