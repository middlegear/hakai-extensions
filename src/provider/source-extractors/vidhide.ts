import { anitakuClient } from "../../config";
// import * as cheerio from "cheerio";
/// same script as streamwish works here too?
export async function VidHide(videoUrl: URL) {
  const sources: { url: string; isM3U8: boolean }[] = [];
  try {
    const response = await anitakuClient.get(`${videoUrl.href}`, {
      headers: {
        Referer: "https://s3embtaku.pro/",
      },
    });

    // Code adapted from Zenda-Cross (https://github.com/Zenda-Cross/vega-app/blob/main/src/lib/providers/multi/multiGetStream.ts)
    // Thank you to Zenda-Cross for the original implementation.

    const functionRegex =
      /eval\(function\((.*?)\)\{.*?return p\}.*?\('(.*?)'\.split/;
    const match = functionRegex.exec(response.data);
    let p = "";
    if (match) {
      const params = match[1].split(",").map((param) => param.trim());
      const encodedString = match[0];

      p = encodedString.split("',36,")?.[0].trim();
      const a = 36;
      let c = encodedString.split("',36,")[1].slice(2).split("|").length;
      const k = encodedString.split("',36,")[1].slice(2).split("|");

      while (c--) {
        if (k[c]) {
          const regex = new RegExp("\\b" + c.toString(a) + "\\b", "g");
          p = p.replace(regex, k[c]);
        }
      }
    } else {
      console.log("No match found");
    }
    const links = p.match(/file:\s*"([^"]+\.m3u8[^"]*)"/) ?? [];

    // console.log(links);

    links.forEach((link: string) => {
      if (link.includes('file:"')) {
        link = link.replace('file:"', "").replace(new RegExp('"', "g"), "");
      }
      const linkParser = new URL(link);

      sources.push({
        url: linkParser.href,
        isM3U8: link.includes(".m3u8"),
      });
    });
    const newSources = {
      source:
        sources.map((item) => ({
          file: item.url,

          isM3u8: item.isM3U8,
        })) || null,
    };
    return newSources;
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Request Error,chech headers ",
    };
  }
}
