export interface ErrorResponse {
  success: boolean;
  status: number;
  error: string;
}
export interface SuccessResponse {
  success: true;
  status: number;
}
export type searchRes = {
  id: string | null;
  title: string | null;
  image: string | null;
  japaneseTitle: string | null;
  type: string | null;
  sub: number;
  dub: number;
  episodes: number;
};
export type Info = {
  animeId: null | string;
  title: null | string;
  posterImage: null | string;
  romaji: null | string;

  type: null | string;
  synopsis: null | string;
  episodes: {
    sub: null | number;
    dub: null | number;
  };
  totalEpisodes: null | number;
};

export enum Servers {
  MegaUp = 'megaup',
}
export enum SubOrDub {
  SUB = 'sub',
  DUB = 'dub',
}
