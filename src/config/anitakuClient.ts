import axios from "axios";
import type { AxiosRequestConfig } from "axios";
import {
  anitaku_USER_AGENT_HEADER,
  ACCEPT_HEADER,
  ACCEPT_ENCODING,
} from "./headers";

const axiosConfig: AxiosRequestConfig = {
  headers: {
    "User-Agent": anitaku_USER_AGENT_HEADER,
    Accept: ACCEPT_HEADER,
    "Content-Encoding": ACCEPT_ENCODING,
  },
};

const anitakuClient = axios.create(axiosConfig);
export { anitakuClient };
