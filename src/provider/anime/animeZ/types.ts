export type anime = {
  id: string | null;
  title: string | null;
  posterImage: string | null;
  episodes?: number | null;
  dub?: string | null;
  romanji?: string | null;
};

export type Episodes = {
  id: string | null;
  title: string | null;
};
export type animeInfo = {
  id: string | null;
  title: string | null;
  posterImage: string | null;
};
export enum category {
  DUB = 'dub',
  SUB = 'sub',
}
export enum servers {
  F35,
  SU57,
  Typhoon,
}
