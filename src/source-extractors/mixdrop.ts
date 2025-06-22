import { providerClient } from '../provider/index.js';

class MixDrop {
  extract = async (videoUrl: URL) => {
    try {
      const { data } = await providerClient.get(videoUrl.href);
      const formated = eval(/(eval)(\(f.*?)(\n<\/script>)/s.exec(data)![2].replace('eval', ''));
      const sources = [];
      const [poster, source] = formated
        .match(/poster="([^"]+)"|wurl="([^"]+)"/g)
        .map((x: string) => x.split(`="`)[1].replace(/"/g, ''))
        .map((x: string) => (x.startsWith('http') ? x : `https:${x}`));

      sources.push({
        url: source,
        isM3U8: source.includes('.m3u8'),
        poster: poster,
      });

      return sources;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };
}
export default MixDrop;
