import { ASource } from '../../types/types.js';
import { getSources } from './megacloud.getsrcs.js';

class MegaCloud {
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
      const errRes = {
        success: false,
        status: 500,
        error: 'MegaCloud Changed Encryption',
        data: null,
      };

      const xrax = embedIframeURL.pathname.split('/').pop() || '';

      const resp = await getSources(xrax);
      if (!resp) return errRes;

      if (Array.isArray(resp.sources)) {
        extractedData.sources = resp.sources.map((s: { file: any; type: any }) => ({
          url: s.file,
          type: s.type,
        }));
      }
      extractedData.intro = resp.intro ? resp.intro : extractedData.intro;
      extractedData.outro = resp.outro ? resp.outro : extractedData.outro;
      extractedData.subtitles = resp.tracks;

      return extractedData;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
}

export default MegaCloud;
