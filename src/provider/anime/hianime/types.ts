export type Anime = {
  id: string | null;
  name: string | null;
  romanji: string | null;
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

export enum Servers {
  HD1 = 'hd-1',
  // StreamSB = "streamsb",
  // StreamTape = "streamtape",
  HD2 = 'hd-2',
}
export type language = 'sub' | 'dub' | 'raw';
export enum Dubbing {
  Dub = 'dub',
  Sub = 'sub',
  Raw = 'raw',
}
export type scrappedAnime = {
  success: boolean;
  anime: Anime[];
  hasNextPage?: boolean;
  totalPages?: number | null;
  currentPage?: number | null;
};
