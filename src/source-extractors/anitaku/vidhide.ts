import { anitakuClient } from '../../provider/index.js';

export async function VidHide(videoUrl: URL) {
  const sources: { url: string; isM3U8: boolean }[] = [];
  try {
    const response = await anitakuClient.get(`${videoUrl.href}`, {
      headers: {
        Referer: 'https://s3embtaku.pro/',
      },
    });

    // Code adapted from Zenda-Cross (https://github.com/Zenda-Cross/vega-app/blob/main/src/lib/providers/multi/multiGetStream.ts)
    // Thank you to Zenda-Cross for the original implementation.

    const functionRegex = /eval\(function\((.*?)\)\{.*?return p\}.*?\('(.*?)'\.split/;
    const match = functionRegex.exec(response.data);
    let p = '';
    if (match) {
      // Ensure match[1] exists before splitting
      const params = match[1]?.split(',').map(param => param.trim()) ?? [];
      const encodedString = match[0] ?? '';

      // Safely extract `p` using optional chaining
      p = encodedString.split("',36,")?.[0]?.trim() ?? '';

      const a = 36;
      const secondPart = encodedString.split("',36,")[1] ?? ''; // Ensure second part exists
      let c = secondPart.slice(2).split('|').length;
      const k = secondPart.slice(2).split('|');

      // Replace placeholders in `p` with values from `k`
      while (c--) {
        if (k[c]) {
          const regex = new RegExp('\\b' + c.toString(a) + '\\b', 'g');
          p = p.replace(regex, k[c] ?? '');
        }
      }
    } else {
      console.log('No match found');
    }

    // Safely extract links from `p` (ensure `p` is defined)
    const links = p?.match(/file:\s*"([^"]+\.m3u8[^"]*)"/) ?? [];
    console.log(links);

    // console.log(links);

    links.forEach((link: string) => {
      if (link.includes('file:"')) {
        link = link.replace('file:"', '').replace(new RegExp('"', 'g'), '');
      }
      const linkParser = new URL(link);

      sources.push({
        url: linkParser.href,
        isM3U8: link.includes('.m3u8'),
      });
    });
    const newSources = {
      source:
        sources.map(item => ({
          file: item.url,

          isM3u8: item.isM3U8,
        })) || null,
    };
    return newSources;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Request Error,chech headers ',
    };
  }
}
