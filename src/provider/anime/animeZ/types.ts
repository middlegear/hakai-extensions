export type anime = {
  id: string | null;
  title: string | null;
  posterImage: string | null;
  episodes: number | null;
  dub: string | null;
};
export type scrappedAnimeSearch = {};
export type Episodes = {
  id: string | null;
  title: string | null;
};
export type animeInfo = {
  id: string | null;
  title: string | null;
  posterImage: string | null;
  href: string | null;
  // episodes: Episodes[];
};
