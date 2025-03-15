import { ASource } from '../../types/types.js';
import { getSources } from './megacloud.getsrcs.js';

class MegaCloud {
  // protected override sources: ASource =
  async extract(embedIframeURL: URL) {
    try {
      const extractedData: ASource = {
        intro: {
          start: 0,
          end: 0,
        },
        outro: {
          start: 0,
          end: 0,
        },
        subtitles: [],
        sources: [],
      };

      const xrax = embedIframeURL.pathname.split('/').pop() || '';

      const resp = await getSources(xrax);
      if (!resp) return extractedData;

      if (Array.isArray(resp.sources)) {
        extractedData.sources = resp.sources.map((s: { file: any; type: any }) => ({
          url: s.file,
          type: s.type,
        }));
      }
      extractedData.intro = resp.intro ? resp.intro : extractedData.intro;
      extractedData.outro = resp.outro ? resp.outro : extractedData.outro;
      extractedData.subtitles = resp.tracks;
      const headers = {
        Referer: embedIframeURL.origin,
      };
      // headers: embedIframeURL.origin
      return {
        Notice: 'Use a m3u8 proxy with Referer headers or enjoy 403 cors error',
        success: true,
        status: 200,
        data: extractedData,
      };
    } catch (err) {
      throw err;
    }
  }
}

export default MegaCloud;
