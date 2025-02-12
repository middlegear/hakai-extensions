import axios from 'axios';
import { transformData } from './utils.js';

const baseUrl = 'https://api.ani.zip/mappings';

export async function getAnilistMapping(id: number) {
  if (!id)
    return {
      success: false,
      status: 400,
      error: ' Missing required params: Id',
      data: null,
    };
  try {
    const response = await axios.get(`${baseUrl}?anilist_id=${id}`);
    if (!response.data) {
      return {
        success: false,
        status: 204,
        error: 'Received empty response from server',
        data: [],
      };
    }
    const results = transformData(response.data);
    return {
      success: true,
      status: 200,
      images: results.images,
      titles: results.animeTitles,
      episodes: results.episodes,
      mapping: results.mappings,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        status: error.response?.status || 500,
        error: `Request failed ${error.message}`,
        data: null,
      };
    }
    return {
      success: false,
      status: 500,
      data: null,
      error: error instanceof Error ? error.message : 'Contact dev if you see this ',
    };
  }
}

export async function getMalMapping(id: number) {
  if (!id)
    return {
      success: false,
      status: 400,
      error: ' Missing required params: Id',
      data: null,
    };
  try {
    const response = await axios.get(`${baseUrl}?mal_id=${id}`);
    if (!response.data) {
      return {
        success: false,
        status: 204,
        error: 'Received empty response from server',
        data: [],
      };
    }
    const results = transformData(response.data);
    return {
      success: true,
      status: 200,
      images: results.images,
      titles: results.animeTitles,
      episodes: results.episodes,
      mapping: results.mappings,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        status: error.response?.status || 500,
        error: `Request failed ${error.message}`,
        data: null,
      };
    }
    return {
      success: false,
      status: 500,
      data: null,
      error: error instanceof Error ? error.message : 'Contact dev if you see this ',
    };
  }
}
