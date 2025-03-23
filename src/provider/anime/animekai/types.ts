export interface ErrorResponse {
  success: boolean;
  status: number;
  error: string;
}
export interface SuccessResponse {
  success: boolean;
  status: number;
}
export type searchRes = {
  id: string | null;
  title: string | null;
  image: string | null;
  romaji: string | null;
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
  status: string | null;
  type: null | string;
  synopsis: null | string;
  episodes: {
    sub: null | number;
    dub: null | number;
  };
  totalEpisodes: null | number;
};

export const AnimeKaiServers = {
  MegaUp: 'megaup',
} as const;
export type AnimeKaiServers = (typeof AnimeKaiServers)[keyof typeof AnimeKaiServers];
