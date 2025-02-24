export interface ErrorResponse {
  success: boolean;
  status: number;
  error: string;
}
export interface SuccessResponse {
  success: true;
  status: number;
}
export type searchRes = {
  id: string | null;
  title: string | null;
  image: string | null;
  japaneseTitle: string | null;
  type: string | null;
  sub: number;
  dub: number;
  episodes: number;
};
