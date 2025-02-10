/// info
export type TINFO = {
  malId?: number;
  anilistId?: number;
  image: string | null;
  bannerImage?: string;
  title: {
    romaji: string | null;
    english: string | null;
    native: string | null;
  };
  trailer: string | null;
  type: string | null;
  status: string | null;
  duration: string | null;
  score: number | null;
  genres: string | null;
  episodes: number | null;
  synopsis: string | null;
  season: string | null;
  startDate: string | null;
  endDate: string | null;
  studio: string | null;
  producers: string | null;
};
//sources

export type Subtitles = {
  url: string | null;
  lang: string | null;
};
export type Source = {
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
