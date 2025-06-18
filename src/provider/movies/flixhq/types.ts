export type searchTypes = {
  id: string | null;
  quality: string | null;
  title: string | null;
  url: string | null;
  image: string | null;
  type: string;
};
export type MediaInfo = {
  id: string | null;
  cover: string | null;
  image: string | null;
  title: string | null;
  description: string | null;
  type: string | null;
  releaseDate: string | null;
  genres: string[] | [];
  casts: string[] | [];
  tags: string[] | [];
  production: string | null;
  country: string | null;
  duration: string | null;
  rating: number | null;
};

export const StreamingServers = {
  Upcloud: 'upcloud',
  // Mixdrop: 'mixdrop', disabled for now
  VidCloud: 'vidcloud',
} as const;
export type StreamingServers = (typeof StreamingServers)[keyof typeof StreamingServers];
