export type pagination = {
  hasNextPage: boolean | null;
  totalPages: number | null;
  currentPage: number | null;
};
export type animeSearch = {
  id: string | null;
  title: string | null;
  posterImage: string | null;
  //   release_year: string | null; find a fix for this
  subOrDub: string | null;
};
export enum subOrDub {
  SUB = "sub",
  DUB = "dub",
}
// export type pageInfo = {
//   currentPage: number | null;
//   hasNextPage: boolean | null;
//   totalPages: number | null;
// };

export type AnimeInfo = {
  id: string | null;
  title: string | null;
  altTitle: string | null;
  posterImage: string | null;
  subOrDub: string | null;
  description: string | null;
  releaseDate: number | null;
  currentStatus: string | null;
  type: string | null;
};

export type EpisodeInfo = {
  id: string | null;
  number: number | null;
  category: string | null;
  name: string | null;
};

export type Servers = {
  name: string | null;
  serverId: number | null;
  href: string | null;
};
export type Sources = {
  serverId: number | null;
  sourceUrl: string | null;
};
export type downloadUrl = {
  downloadUrl: string | null;
  iframe: null | string;
};

export enum anitakuServers {
  Vidstreaming = "vidstreaming",
  GogoServer = "gogo server",
  StreamWish = "streamwish",
  Doodstream = "doodstream",
  VidHide = "videhide",
  MP4Upload = "mp4upload",
}

export type anitakuAnimeServers =
  | "vidstreaming"
  | "gogo server"
  | "streamwish"
  | "doodstream"
  | "videhide"
  | "mp4upload";

export type scrappedAnimeInfo = {
  success: boolean;
  data: AnimeInfo;
  episodes: EpisodeInfo[];
};
export type scrappedServers = {
  server: Servers[];
  download: string | null;
  iframe: string | null;
};
