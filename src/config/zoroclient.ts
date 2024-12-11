import axios from "axios";
import { AxiosError, type AxiosRequestConfig } from "axios";
import { ACCEPT_HEADER, ACCEPT_ENCODING, USER_AGENT_HEADER } from "./index";

const axiosConfig: AxiosRequestConfig = {
  timeout: 5000,
  headers: {
    Accept: ACCEPT_HEADER,
    "Content-Encoding": ACCEPT_ENCODING,
    "User-Agent": USER_AGENT_HEADER,
  },
};

const zoroClient = axios.create(axiosConfig);

export { zoroClient, AxiosError };
