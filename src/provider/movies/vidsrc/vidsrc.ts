import * as cheerio from 'cheerio';
import { providerClient } from '../../../config/clients.js';
import { vidsrcBaseUrl } from '../../../utils/constants.js';
import { VidSRCServers, type MediaType } from './types.js';
import { getFrame, getServersHash, Scrape2EmbedIframe } from './scraper.js';
import { USER_AGENT_HEADER } from '../../index.js';
import axios from 'axios';
import CloudStreamPro from '../../../source-extractors/cloudstreampro.js';
import TwoEmbed, { type ExtractedData } from '../../../source-extractors/twoembed.js';

async function _getRCP(hash: string) {
  try {
    const rcp = await axios.get(`https://cloudnestra.com/rcp/${hash}`, {
      headers: {
        'User-Agent': USER_AGENT_HEADER,
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        Referer: 'https://vidsrc.io/',
        'Content-Encoding': 'gzip, deflate, br, zstd',
      },
    });
    const frame$ = cheerio.load(rcp.data);
    const iframe = getFrame(frame$);
    const srcp = await axios.get(`https://cloudnestra.com/${iframe}`, {
      headers: {
        'User-Agent': USER_AGENT_HEADER,
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        Referer: `https://cloudnestra.com/rcp/${hash}`,
        'Content-Encoding': 'gzip, deflate, br, zstd',
      },
    });
    return srcp.data;
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unknown Err' };
  }
}
async function _getMovieHash(tmdbId: number, server: VidSRCServers) {
  try {
    const response = await providerClient.get(`${vidsrcBaseUrl}/${tmdbId}/`);
    const data$ = cheerio.load(response.data);
    const servers = getServersHash(data$);

    if (!Array.isArray(servers) || servers.length === 0) {
      throw new Error('No servers found');
    }
    const index = servers.findIndex(s => s.name === server);
    if (index === -1) {
      throw new Error(`Server ${server} not found`).message;
    }

    const serverId = servers[index].hash;
    const rcpData = await _getRCP(serverId);

    if (!rcpData) {
      throw new Error('Failed to retrieve rcp data').message;
    }

    return rcpData;
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unknown Err' };
  }
}
async function _getTvHash(tmdbId: number, season: number, episodeNumber: number, server: VidSRCServers) {
  try {
    const response = await providerClient.get(`${vidsrcBaseUrl}/${tmdbId}/${season}-${episodeNumber}/`);
    const data$ = cheerio.load(response.data);
    const servers = getServersHash(data$);
    if (!Array.isArray(servers) || servers.length === 0) {
      throw new Error('No servers found');
    }
    const index = servers.findIndex(s => s.name === server);
    if (index === -1) {
      throw new Error(`Server ${server} not found`).message;
    }

    const serverId = servers[index].hash;
    const rcpData = await _getRCP(serverId);

    if (!rcpData) {
      throw new Error('Failed to retrieve rcp data').message;
    }
    if (server === VidSRCServers.CloudStreamPro) {
      // early return
      return rcpData;
      //
    }
    if (server === VidSRCServers.TwoEmbed) {
      const iframe$ = cheerio.load(rcpData);
      const data3 = Scrape2EmbedIframe(iframe$) as string;

      const res = await axios.get(data3, {
        headers: {
          'User-Agent': USER_AGENT_HEADER,
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
          Referer: `https://cloudnestra.com/rcp/${serverId}`,
          'Content-Encoding': 'gzip, deflate, br, zstd',
        },
      });

      return res.data;
    }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unknown Err' };
  }
}
interface SuccessResponse {
  data: ExtractedData;
}
interface ErrorResponse {
  data: [];
  error: string;
}
export type VidSrcResponse = SuccessResponse | ErrorResponse;
export async function getMovieUrl(tmdbId: number, server: VidSRCServers): Promise<VidSrcResponse> {
  if (!tmdbId) {
    return { data: [], error: 'Missing required params: tmdbId!' };
  }
  try {
    const data = await _getMovieHash(tmdbId, server);

    const data$: cheerio.CheerioAPI = cheerio.load(data);
    switch (server) {
      case VidSRCServers.CloudStreamPro:
        return { data: new CloudStreamPro().extract(data$) as ExtractedData };

      case VidSRCServers.TwoEmbed:
        return { data: (await new TwoEmbed().extract(data$)) as ExtractedData };

      // case VidSRCServers.SuperEmbed:
      //   return { messag: 'SuperEmbed method not implemented' }; // method not implemented

      default:
        return { data: new CloudStreamPro().extract(data$) };
    }
  } catch (error) {
    return { data: [], error: error instanceof Error ? error.message : 'Unknown Err' };
  }
}

export async function getTvUrl(
  tmdbId: number,
  season: number,
  episodeNumber: number,
  server: VidSRCServers,
): Promise<VidSrcResponse> {
  if (!tmdbId) {
    return {
      data: [],
      error: 'Missing required params: tmdbId! ',
    };
  }
  try {
    const data = await _getTvHash(tmdbId, season, episodeNumber, server);

    const data$: cheerio.CheerioAPI = cheerio.load(data);
    switch (server) {
      case VidSRCServers.CloudStreamPro:
        return { data: new CloudStreamPro().extract(data$) as ExtractedData };

      case VidSRCServers.TwoEmbed:
        return { data: (await new TwoEmbed().extract(data$)) as ExtractedData };

      // case VidSRCServers.SuperEmbed:
      //   return { message: 'SuperEmbed method not implemented' }; // method not implemeted

      default:
        return { data: new CloudStreamPro().extract(data$) };
    }
  } catch (error) {
    return { data: [], error: error instanceof Error ? error.message : 'Unknown Err' };
  }
}
