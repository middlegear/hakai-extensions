/// this has been copied from  https://github.com/ghoshRitesh12/aniwatch  thanks!

import axios from "axios";
import { load, type CheerioAPI } from "cheerio";

type Video = {
  url: string;
  quality?: string;
  isM3U8?: boolean;
  size?: number;
  [x: string]: unknown;
};
class StreamTape {
  // private serverName = "StreamTape";
  private sources: Video[] = [];

  async extract(videoUrl: URL): Promise<Video[]> {
    try {
      const { data } = await axios.get(videoUrl.href).catch(() => {
        throw new Error("Video not found");
      });

      const $: CheerioAPI = load(data);

      let [fh, sh] = $.html()
        ?.match(/robotlink'\).innerHTML = (.*)'/)![1]
        .split("+ ('");

      sh = sh.substring(3);
      fh = fh.replace(/\'/g, "");

      const url = `https:${fh}${sh}`;

      this.sources.push({
        url: url,
        isM3U8: url.includes(".m3u8"),
      });

      return this.sources;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }
}
export default StreamTape;
