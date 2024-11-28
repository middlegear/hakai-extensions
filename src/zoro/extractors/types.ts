export type Video = {
  url: string;
  quality?: string;
  isM3U8?: boolean;
  size?: number;
  [x: string]: unknown;
};
