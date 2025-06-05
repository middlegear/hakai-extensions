import { providerClient, USER_AGENT_HEADER } from '../provider';
import { getSources } from './megacloud/megacloud.getsrcs';

class VidCloud {
  extract = async (videoUrl: URL, _?: boolean, referer: string = 'https://flixhq.to/') => {
    const result: { sources: any; subtitles: any; intro?: any } = {
      sources: [],
      subtitles: [],
    };
    try {
      const options = {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          Referer: videoUrl.href,
          'User-Agent': USER_AGENT_HEADER,
        },
      };

      const res = await getSources(videoUrl.href, referer);
      let sources = res.sources;

      sources = sources.map((s: any) => ({
        url: s.file,
        isM3U8: s.file.includes('.m3u8') || s.file.endsWith('m3u8'),
      }));

      result.sources.push(...sources);

      result.sources = [];
      sources = [];

      for (const source of sources) {
        const { data } = await providerClient.get(source.file, options);
        const urls = data.split('\n').filter((line: string) => line.includes('.m3u8') || line.endsWith('m3u8')) as string[];
        const qualities = data.split('\n').filter((line: string) => line.includes('RESOLUTION=')) as string[];

        const TdArray = qualities.map((s, i) => {
          const f1 = s.split('x')[1];
          const f2 = urls[i];

          return [f1, f2];
        });

        for (const [f1, f2] of TdArray) {
          sources.push({
            url: f2,
            quality: f1,
            isM3U8: f2.includes('.m3u8') || f2.endsWith('m3u8'),
          });
        }
        result.sources.push(...sources);
      }

      result.sources.push({
        url: sources[0].file,
        isM3U8: sources[0].file.includes('.m3u8') || sources[0].file.endsWith('m3u8'),
        quality: 'auto',
      });

      result.subtitles = res.tracks.map((s: any) => ({
        url: s.file,
        lang: s.label ? s.label : 'Default (maybe)',
      }));

      return result;
    } catch (err) {
      throw err;
    }
  };
}

export default VidCloud;
