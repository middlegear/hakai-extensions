/// info

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
  intro: {
    start: number | null;
    end: number | null;
  };
  outro: {
    start: number | null;
    end: number | null;
  };
  subtitles: Subtitles[];
  sources: Source[];
};

export enum MediaType {
  Anime = 'ANIME',
  // Manga = 'MANGA',
}
export enum Sort {
  SCORE_DESC = 'SCORE_DESC',
  POPULARITY_DESC = 'POPULARITY_DESC',
}
export enum Seasons {
  WINTER = 'WINTER',
  SPRING = 'SPRING',
  SUMMER = 'SUMMER',
  FALL = 'FALL',
}
export enum Status {
  NOT_YET_RELEASED = 'NOT_YET_RELEASED',
  Airing = 'airing',
  Popularity = 'bypopularity',
  Upcoming = 'upcoming',
  Favourite = 'favorite',
  RELEASING = 'RELEASING',
}

export enum Format {
  TV = 'TV',
  MOVIE = 'MOVIE',
  SPECIAL = 'SPECIAL',
  OVA = 'OVA',
  ONA = 'ONA',
  MUSIC = 'MUSIC',
}
export enum Charactersort {
  RELEVANCE = 'RELEVANCE',
}
