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

export type testing = {
  id: number | null;
};
