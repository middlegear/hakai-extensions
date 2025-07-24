import { type ProviderSearchResults, bestTvShowTitle, bestMovieTitle } from '../../../utils/mapper.js';
import { FlixHQ } from '../../movies/flixhq/index.js';

import { type Info, type seasons, type Movie, getTvShowInfo, getMovieInfo } from './tmdb.js';

const flixhq = new FlixHQ();
const apiKey = 'b29bfe548cc2a3e4225effbd54ef0fda';

interface SuccessProviderIdRes {
  data: Info;
  seasons: seasons[];
  providerResult: ProviderSearchResults[];
}
interface ErrorProviderIdRes {
  data: null;
  seasons: [];
  providerResult: null;
  error: string;
}
export type TvProviderId = SuccessProviderIdRes | ErrorProviderIdRes;
export async function _getTvProviderId(tmdbId: number): Promise<TvProviderId> {
  if (!tmdbId) return { data: null, seasons: [], providerResult: null, error: 'Missing required params ProviderId' };
  try {
    const data = await getTvShowInfo(tmdbId, apiKey);

    const title = data.data?.name as string;
    const flixId = await flixhq.search(title);

    // const seasons = data.data?.seasons as number;
    const tvshow = flixId.data
      .filter((item: any) => item.type === 'TV')
      .map((item: any) => ({
        id: item.id,
        title: item.title,
        url: item.url,
        seasons: item.seasons,
        quality: item.quality,
      }));
    /// will use seasons as afront to further narrow down stuff
    const matchTitle = bestTvShowTitle(title, tvshow);
    return {
      data: data.data as Info,
      seasons: data.seasons as seasons[],
      providerResult: matchTitle as ProviderSearchResults[],
    };
  } catch (error) {
    return {
      data: null,
      seasons: [],
      providerResult: null,
      error: error instanceof Error ? error.message : 'Unknown Error',
    };
  }
}
interface SuccessMovieRes {
  data: Movie;
  providerResult: ProviderSearchResults[];
}
interface ErrorMovieRes {
  data: null;
  providerResult: null;
  error: string;
}
export type MovieProviderId = SuccessMovieRes | ErrorMovieRes;
export async function _getMovieProviderId(tmdbId: number): Promise<MovieProviderId> {
  if (!tmdbId) {
    return { data: null, providerResult: null, error: 'Missing required params: tmdbId!' };
  }
  try {
    const data = await getMovieInfo(tmdbId, apiKey);
    const title = data.data?.name as string;
    const flixId = await flixhq.search(title);

    const movie = flixId.data
      .filter((item: any) => item.type === 'Movie')
      .map((item: any) => ({
        id: item.id,
        title: item.title,
        url: item.url,
        releaseDate: item.releaseDate,
        quality: item.quality,
      }));
    /// will use seasons as afront to further narrow down stuff
    const matchTitle = bestMovieTitle(title, movie);
    return {
      data: data.data as Movie,
      providerResult: matchTitle as ProviderSearchResults[],
    };
  } catch (error) {
    return {
      data: null,
      providerResult: null,
      error: error instanceof Error ? error.message : 'Unknown Error',
    };
  }
}
