import type { ExtractedData } from '../../../source-extractors/streamwish.js';
import { _getEmbedMovieUrl } from './2embed.js';
import { EmbedServers } from './types.js';
import { _getVidSrcMovieUrl } from './vidsrc.js';

interface SuccessResponse {
  data: ExtractedData;
}
interface ErrorResponse {
  data: [];
  error: string;
}
export type EmbedSrcResponse = SuccessResponse | ErrorResponse;
export async function getMovieUrl(tmdbId: number, server: EmbedServers): Promise<EmbedSrcResponse> {
  try {
    switch (server) {
      case EmbedServers.CloudStream:
        const data = await _getVidSrcMovieUrl(tmdbId);
        if ('error' in data) return { data: [], error: data.error as string };

        return { data: data.data };
      case EmbedServers.TwoEmbed:
        const data2 = await _getEmbedMovieUrl(tmdbId);
        if ('error' in data2) return { data: [], error: data2.error as string };

        return { data: data2.data };
    }
  } catch (error) {
    return { data: [], error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
