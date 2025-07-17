import axios from 'axios';
import * as cheerio from 'cheerio';
import { USER_AGENT_HEADER } from '../provider/index.js';

export async function getClientKey(embedUrl: string, Referer: string): Promise<string | null> {
  for (let i = 0; i < 5; i++) {
    try {
      const response = await axios.get(embedUrl, {
        headers: {
          Referer: Referer,
          'User-Agent': USER_AGENT_HEADER,
          'X-Requested-With': 'XMLHttpRequest',
        },
      });
      // console.log(response.data);

      const $ = cheerio.load(response.data);

      // 1. Check <meta name="_gg_fb" content="...">
      const metaContent = $('meta[name="_gg_fb"]').attr('content');
      if (metaContent) {
        console.log('key found in meta content');

        return metaContent;
      }

      // 2. Look for HTML comment: <!-- _is_th:somekey -->
      const comments: string[] = [];
      const commentRegex = /<!--\s*(_is_th:[^>]+)\s*-->/g;
      let match: RegExpExecArray | null;

      while ((match = commentRegex.exec(response.data)) !== null) {
        comments.push(match[1].trim());
      }

      const commentMatch = comments.find(c => /^_is_th:/.test(c));
      if (commentMatch) {
        const matchKey = commentMatch.match(/^_is_th:([^\n\r]+)$/);
        if (matchKey?.[1]) {
          console.log('key found in  _is_th:somekey');

          return matchKey[1].trim();
        }
      }

      // 3. Check <div data-dpi="...">
      const dpiContent = $('[data-dpi]').attr('data-dpi');
      if (dpiContent) {
        console.log('key found in data-dpi=');
        return dpiContent;
      }

      // 4 & 5. Check <script> for window._xy_ws or window._lk_db
      const scripts = $('script');
      for (const scriptElement of scripts.toArray()) {
        const scriptText = $(scriptElement).html()?.trim();
        if (!scriptText) continue;

        const xyMatch = scriptText.match(/window\._xy_ws\s*=\s*["']([^"']+)["']/);
        if (xyMatch?.[1]) {
          return xyMatch[1];
        }

        const lkMatch = scriptText.match(
          /window\._lk_db\s*=\s*{x:\s*["']([^"']+)["'],\s*y:\s*["']([^"']+)["'],\s*z:\s*["']([^"']+)["']}/,
        );
        if (lkMatch?.[1] && lkMatch[2] && lkMatch[3]) {
          console.log('key found in window._xy_ws or window._lk_db');
          return lkMatch[1] + lkMatch[2] + lkMatch[3];
        }
      }
      ////its missing the script nonce

      console.log(`🔁 Attempt ${i + 1} finished. Key not found.`);
    } catch (err: unknown) {
      let errorMessage = 'An unknown error occurred';
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      console.error(`❌ Attempt ${i + 1} failed:`, errorMessage);
    }
  }

  console.log('❌ Key not found after 5 attempts.');
  return null;
}
