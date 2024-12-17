import { anitakuClient } from "../../config";
// import * as cheerio from "cheerio";

export async function StreamWish(videoUrl: URL) {
  const sources: { quality: string; url: string; isM3U8: boolean }[] = [];
  try {
    const response = await anitakuClient.get(`${videoUrl.href}`, {
      headers: {
        Referer: "https://s3embtaku.pro/",
      },
    });
    ///Me NOOB ive scraped the eval obfsucated stuff tried to execute it but failed idk why CTRL + C +V ill try sth with pupeteer later
    // const data$: cheerio.CheerioAPI = cheerio.load(response.data);
    // data$("script").each((i, script) => {
    //   const scriptContent = data$(script).html();

    //   if (scriptContent && scriptContent.includes("eval")) {
    //   }
    // });

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
    const subtitleMatches =
      p?.match(
        /{file:"([^"]+)",(label:"([^"]+)",)?kind:"(thumbnails|captions)"/g
      ) ?? [];
    // console.log(links, subtitleMatches);

    const subtitles = subtitleMatches.map((sub) => {
      const lang = sub?.match(/label:"([^"]+)"/)?.[1] ?? "";
      const url = sub?.match(/file:"([^"]+)"/)?.[1] ?? "";
      const kind = sub?.match(/kind:"([^"]+)"/)?.[1] ?? "";
      if (kind.includes("thumbnail")) {
        return {
          lang: kind,
          url: `https://streamwish.com${url}`,
        };
      }
      return {
        lang: lang,
        url: url,
      };
    });
    let lastLink: string | null = null;
    links.forEach((link: string) => {
      if (link.includes('file:"')) {
        link = link.replace('file:"', "").replace(new RegExp('"', "g"), "");
      }
      const linkParser = new URL(link);
      linkParser.searchParams.set("i", "0.4");
      sources.push({
        quality: lastLink! ? "backup" : "default",
        url: linkParser.href,
        isM3U8: link.includes(".m3u8"),
      });
      lastLink = link;
    });
    return sources;
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Request Error,chech headers ",
    };
  }
}
