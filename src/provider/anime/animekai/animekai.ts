import * as cheerio from 'cheerio';
import { providerClient } from '../../../config/clients';
import { animekaiBaseUrl } from '../../../utils/constants';
import { extractsearchresults } from './scraper';
import axios from 'axios';
import { ErrorResponse, searchRes, SuccessResponse } from './types';
export interface SuccessSearchResponse extends SuccessResponse {
  data: searchRes[];
  hasNextPage: boolean;
  currentPage: number;
  totalPages: number;
}
export interface SearchErrorResponse extends ErrorResponse {
  data: [];
  hasNextPage: boolean;
  totalPages: number;
  currentPage: number;
}
export type SearchResponse = SuccessSearchResponse | SearchErrorResponse;
export async function searchanime(query: string, page: number = 1): Promise<SearchResponse> {
  if (!query)
    return {
      success: false,
      status: 400,
      hasNextPage: false,
      currentPage: 0,
      totalPages: 0,
      data: [],
      error: 'Missing required Params : query',
    };
  try {
    const response = await providerClient.get(
      `${animekaiBaseUrl}/browser?keyword=${query.replace(/[\W_]+/g, '+')}&page=${page}`,
    );
    const data$ = cheerio.load(response.data);
    const { hasNextPage, totalPages, currentPage, searchresults } = extractsearchresults(data$);
    if (!searchresults) {
      return {
        hasNextPage: false,
        currentPage: 0,
        totalPages: 0,
        status: 204,
        success: false,
        error: 'Scraper Error',
        data: [],
      };
    }
    return {
      success: true,
      status: 200,
      hasNextPage: hasNextPage as boolean,
      currentPage: Number(currentPage) || 0,
      totalPages: Number(totalPages) || 0,
      data: searchresults,
    };
  } catch (error) {
    if (axios.isAxiosError(error))
      return {
        hasNextPage: false,
        currentPage: 0,
        totalPages: 0,
        status: error.response?.status || 500,
        error: `Request failed: ${error.message}` || 'Unknown axios error',
        success: false,
        data: [],
      };
    return {
      success: false,
      hasNextPage: false,
      currentPage: 0,
      totalPages: 0,
      status: 500,
      data: [],
      error: error instanceof Error ? error.message : 'Contact dev if you see this',
    };
  }
}

///fetchanimeInfo
///fetchSources
