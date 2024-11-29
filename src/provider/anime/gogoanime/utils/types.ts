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
