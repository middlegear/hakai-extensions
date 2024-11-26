import axios from "axios";
import { AxiosError, type AxiosRequestConfig } from "axios";
import {
  USER_AGENT_HEADER,
  ACCEPT_ENCODING,
  ACCEPT_HEADER,
} from "../utils/zoroconstants";

const axiosConfig: AxiosRequestConfig = {
  timeout: 5000,
  headers: {
    Accept: ACCEPT_HEADER,
    "Content-Encoding": ACCEPT_ENCODING,
    "User-Agent": USER_AGENT_HEADER,
  },
};

const client = axios.create(axiosConfig);

export { client, AxiosError };
