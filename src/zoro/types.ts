export type Anime = {
  id: string | null;
  name: string | null;
  japaneseName: string | null;
  posterImage: string | null;
  url: string | null;
  duration: string | null;
  type: string | null;
  rating: string | null;
  episodes: {
    sub: number | null;
    dub: number | null;
  };
};
export type scrappedAnime = {
  anime: [];
  hasNextPage: boolean;
  totalPages: number;
  currentPage: number;
};

export type AnimeInfo = {
  id: string | null;
  title: string | null;
  AnilistId: number | null;
  MalId: number | null;
  posterImage: string | null;
  synopsis: string | null;
  duration: number | null;
  type: string | null;
  episodes: {
    sub: number | null;
    dub: number | null;
  };
  totalEpisodes: number | null;
};
export type EpisodeInfo = {
  episodeId: string | null;
  number: number | null;
  title: string | null;
  href: string | null;
};

export type SubServers = {
  severId: number | null;
  serverName: string | null;
};
export type DubServers = SubServers;
export type RawServers = SubServers;
export type ScrappedServers = {
  sub: SubServers[];
  dub: DubServers[];
  raw: RawServers[];
  episodeNumber: number | null;
};
