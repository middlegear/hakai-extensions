/// info

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
export enum AnimeProvider {
  AnimeZ = 'animez',
  HiAnime = 'hianime',
  // Anitaku = 'anitaku',
}
