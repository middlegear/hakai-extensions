export type anime = {
  id: string | null;
  title: string | null;
  posterImage: string | null;
};

export type Episodes = {
  episodeId: string | null;
  number: number | null;
  category: string | null;
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
  F35 = 'F35 ',
  SU57 = 'Rusia',
  Typhoon = 'EU',
}
export interface ErrorResponse {
  success: boolean;
  status: number;
  error: string;
}
export interface SuccessResponse {
  success: true;
  status: number;
}
