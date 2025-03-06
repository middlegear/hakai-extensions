type Subtitles = {
  url: string | null;
  lang: string | null;
};

type Source = {
  url: string | null;
  isM3U8: boolean | null;
  type: string | null;
};

export type ASource = {
  intro?: {
    start: number | null;
    end: number | null;
  };
  outro?: {
    start: number | null;
    end: number | null;
  };
  subtitles?: Subtitles[];
  sources?: Source[];
  download?: string;
};

export const SubOrDub = {
  SUB: 'sub',
  DUB: 'dub',
} as const;
export type SubOrDub = (typeof SubOrDub)[keyof typeof SubOrDub];

export enum MediaType {
  ANIME = 'ANIME',
}
export const Sort = {
  SCORE_DESC: 'SCORE_DESC',
  POPULARITY_DESC: 'POPULARITY_DESC',
} as const;
export type Sort = (typeof Sort)[keyof typeof Sort];

export const Seasons = {
  WINTER: 'WINTER',
  SPRING: 'SPRING',
  SUMMER: 'SUMMER',
  FALL: 'FALL',
} as const;
export type Seasons = (typeof Seasons)[keyof typeof Seasons];

export const JikanStatus = {
  Airing: 'airing',
  Popularity: 'bypopularity',
  Upcoming: 'upcoming',
  Favourite: 'favorite',
} as const;
export type JikanStatus = (typeof JikanStatus)[keyof typeof JikanStatus];

export const AnilistStatus = {
  NOT_YET_RELEASED: 'NOT_YET_RELEASED',
  RELEASING: 'RELEASING',
} as const;
export type AnilistStatus = (typeof AnilistStatus)[keyof typeof AnilistStatus];

export const Format = {
  TV: 'TV',
  MOVIE: 'MOVIE',
  SPECIAL: 'SPECIAL',
  OVA: 'OVA',
  ONA: 'ONA',
  MUSIC: 'MUSIC',
} as const;
export type Format = (typeof Format)[keyof typeof Format];

export const Charactersort = {
  RELEVANCE: 'RELEVANCE',
} as const;
export type Charactersort = (typeof Charactersort)[keyof typeof Charactersort];

export const AnimeProvider = {
  HiAnime: 'hianime',
  Animekai: 'animekai',
} as const;
export type AnimeProvider = (typeof AnimeProvider)[keyof typeof AnimeProvider];
