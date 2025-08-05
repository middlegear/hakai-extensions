import { providerClient } from '../../../config/clients.js';
import { embedBaseUrl } from '../../../utils/constants.js';
import * as cheerio from 'cheerio';
import { ScrapeSwishId } from './scraper.js';
import StreamWish, { type ExtractedData } from '../../../source-extractors/streamwish.js';

const embedUrl = 'https://yesmovies.baby' as const;
/// tv url has cors issues
export async function _getEmbedMovieUrl(tmdbId: number) {
  try {
    const response = await providerClient.get(`${embedBaseUrl}/embed/${tmdbId}`);
    const data$ = cheerio.load(response.data);
    const swishUrl = ScrapeSwishId(data$);
    if (!swishUrl || typeof swishUrl !== 'string') {
      throw new Error('Invalid swishUrl from ScrapeSwishId').message;
    }

    const id = swishUrl.split('=').at(1);
    if (!id) {
      throw new Error(`Invalid swishUrl format: ${swishUrl}`).message;
    }
    const referer = new URL(swishUrl);
    const packedScriptUrl = await providerClient.get(`${embedUrl}/e/${id}`, {
      headers: {
        Referer: `${referer.origin}/`,
      },
    });

    if (!packedScriptUrl.data) throw new Error('Missing the packedScript Url Html').message;

    const packedScript$ = cheerio.load(packedScriptUrl.data);
    let packedScript: string | null = null;

    packedScript$('script').each((_, el) => {
      const code = packedScript$(el).html();
      if (code?.includes('eval(function(p,a,c,k,e,d)')) {
        packedScript = code;
      }
    });

    if (!packedScript) {
      throw new Error('No packed script found.').message;
    }

    return { data: (await new StreamWish().extract(packedScript)) as ExtractedData };
  } catch (error) {
    return { data: [], error: error instanceof Error ? error.message : 'Unknown Err' };
  }
}
