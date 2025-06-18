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
  animeId: string | null;
  title: string | null;
  anilistId: number | null;
  malId: number | null;
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
  episodeNumber: number | null;
  title: string | null;
  href: string | null;
};

export type SubServers = {
  severId: number | null;
  serverName: string | null;
};
export type DubServers = SubServers;
export type RawServers = SubServers;
export type ServerInfo = {
  sub: SubServers[];
  dub: DubServers[];
  episodeNumber: number | null;
};

export const HiAnimeServers = {
  HD1: 'hd-1',
  HD2: 'hd-2',
  HD3: 'hd-3',
} as const;
export type HiAnimeServers = (typeof HiAnimeServers)[keyof typeof HiAnimeServers];
