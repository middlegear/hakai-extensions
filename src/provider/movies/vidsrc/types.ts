export const MediaType = {
  Movie: 'movie',
  Tv: 'tv',
} as const;
export type MediaType = (typeof MediaType)[keyof typeof MediaType];

export type vidServers = {
  name: string;
  hash: string;
};

export const VidSRCServers = {
  CloudStreamPro: 'cloudstream pro',
  TwoEmbed: '2embed',
  // SuperEmbed: 'superembed',
} as const;
export type VidSRCServers = (typeof VidSRCServers)[keyof typeof VidSRCServers];
