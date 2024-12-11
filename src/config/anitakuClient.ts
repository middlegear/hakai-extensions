import axios from "axios";
import type { AxiosRequestConfig } from "axios";
import {
  anitaku_USER_AGENT_HEADER,
  anitaku_ACCEPT_HEADER,
  anitaku_ACCEPT_ENCODING_HEADER,
} from "./index";

const axiosConfig: AxiosRequestConfig = {
  headers: {
    "User-Agent": anitaku_USER_AGENT_HEADER,
    Accept: anitaku_ACCEPT_HEADER,
    "Content-Encoding": anitaku_ACCEPT_ENCODING_HEADER,
  },
};

const anitakuClient = axios.create(axiosConfig);
export { anitakuClient };
