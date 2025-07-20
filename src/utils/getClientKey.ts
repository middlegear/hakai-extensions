import axios from 'axios';

import { load } from 'cheerio';

import { USER_AGENT_HEADER } from '../provider/index.js';

export async function getClientKey(embedUrl: string, Referer: string): Promise<string> {
  const salts: string[] = [];
  const maxAttempts = 100;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await axios.get(embedUrl, {
        headers: {
          Referer,
          'User-Agent': USER_AGENT_HEADER,
          'X-Requested-With': 'XMLHttpRequest',
        },
      });

      const html = response.data;
      console.log(html);

      const $ = load(html);

      // 1. Check for 48-character alphanumeric nonce in HTML
      const noncePattern1 = /\b[a-zA-Z0-9]{48}\b/;
      const noncePattern2 = /\b([a-zA-Z0-9]{16})\b.*?\b([a-zA-Z0-9]{16})\b.*?\b([a-zA-Z0-9]{16})\b/;
      const match1 = html.match(noncePattern1);
      const match2 = html.match(noncePattern2);

      if (match1) {
        salts.push(match1[0]);
      }
      if (match2 && match2.length === 4) {
        const combinedNonce = [match2[1], match2[2], match2[3]].join('');

        salts.push(combinedNonce);
      }

      // 2. Check <script> tags for nonce variables
      const scripts = $('script').toArray();
      for (const script of scripts) {
        const content = $(script).html();
        if (!content) continue;

        // Check for window._xy_ws or similar variables
        const varMatch = content.match(/_[a-zA-Z0-9_]+\s*=\s*['"]([a-zA-Z0-9]{32,})['"]/);
        if (varMatch?.[1]) {
          salts.push(varMatch[1]);
        }

        // Check for object with x, y, z keys (like window._lk_db)
        const objMatch = content.match(
          /_[a-zA-Z0-9_]+\s*=\s*{[^}]*x\s*:\s*['"]([a-zA-Z0-9]{16,})['"][^}]*y\s*:\s*['"]([a-zA-Z0-9]{16,})['"][^}]*z\s*:\s*['"]([a-zA-Z0-9]{16,})['"]/,
        );
        if (objMatch?.[1] && objMatch[2] && objMatch[3]) {
          const key = objMatch[1] + objMatch[2] + objMatch[3];

          salts.push(key);
        }
      }

      // 3. Check <script nonce="..."> attributes
      const nonceAttr = $('script[nonce]').attr('nonce');
      if (nonceAttr && nonceAttr.length >= 32) {
        salts.push(nonceAttr);
      }

      // 4. Check meta tags and data attributes generically
      const metaContent = $('meta[name]')
        //@ts-ignore
        .filter((i, el) => $(el).attr('name')?.startsWith('_'))
        .attr('content');
      if (metaContent && /[a-zA-Z0-9]{32,}/.test(metaContent)) {
        salts.push(metaContent);
      }

      const dataAttr = $('[data-dpi], [data-key], [data-token]').first().attr();
      const dataKey = dataAttr?.['data-dpi'] || dataAttr?.['data-key'] || dataAttr?.['data-token'];
      if (dataKey && /[a-zA-Z0-9]{32,}/.test(dataKey)) {
        salts.push(dataKey);
      }

      // Remove duplicates and validate length
      const uniqueSalts = [...new Set(salts)].filter(key => key.length >= 32 && key.length <= 64);
      if (uniqueSalts.length > 0) {
        return uniqueSalts[0];
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    }
  }

  return '';
}
// import axios from 'axios';
// import * as cheerio from 'cheerio';
// import { USER_AGENT_HEADER } from '../provider/index.js';

// export async function getClientKey(embedUrl: string, Referer: string): Promise<string | null> {
//   for (let i = 0; i < 5; i++) {
//     try {
//       const response = await axios.get(embedUrl, {
//         headers: {
//           Referer: Referer,
//           'User-Agent': USER_AGENT_HEADER,
//           'X-Requested-With': 'XMLHttpRequest',
//         },
//       });
//       // console.log(response.data);

//       const $ = cheerio.load(response.data);

//       // 1. Check <meta name="_gg_fb" content="...">
//       const metaContent = $('meta[name="_gg_fb"]').attr('content');
//       if (metaContent) {
//         console.log('key found in meta content');

//         return metaContent;
//       }

//       // 2. Look for HTML comment: <!-- _is_th:somekey -->
//       const comments: string[] = [];
//       const commentRegex = /<!--\s*(_is_th:[^>]+)\s*-->/g;
//       let match: RegExpExecArray | null;

//       while ((match = commentRegex.exec(response.data)) !== null) {
//         comments.push(match[1].trim());
//       }

//       const commentMatch = comments.find(c => /^_is_th:/.test(c));
//       if (commentMatch) {
//         const matchKey = commentMatch.match(/^_is_th:([^\n\r]+)$/);
//         if (matchKey?.[1]) {
//           console.log('key found in  _is_th:somekey');

//           return matchKey[1].trim();
//         }
//       }

//       // 3. Check <div data-dpi="...">
//       const dpiContent = $('[data-dpi]').attr('data-dpi');
//       if (dpiContent) {
//         console.log('key found in data-dpi=');
//         return dpiContent;
//       }

//       // 4 & 5. Check <script> for window._xy_ws or window._lk_db
//       const scripts = $('script');
//       for (const scriptElement of scripts.toArray()) {
//         const scriptText = $(scriptElement).html()?.trim();
//         if (!scriptText) continue;

//         const xyMatch = scriptText.match(/window\._xy_ws\s*=\s*["']([^"']+)["']/);
//         if (xyMatch?.[1]) {
//           return xyMatch[1];
//         }

//         const lkMatch = scriptText.match(
//           /window\._lk_db\s*=\s*{x:\s*["']([^"']+)["'],\s*y:\s*["']([^"']+)["'],\s*z:\s*["']([^"']+)["']}/,
//         );
//         if (lkMatch?.[1] && lkMatch[2] && lkMatch[3]) {
//           console.log('key found in window._xy_ws or window._lk_db');
//           return lkMatch[1] + lkMatch[2] + lkMatch[3];
//         }
//       }
//       ////its missing the script nonce

//       console.log(`🔁 Attempt ${i + 1} finished. Key not found.`);
//     } catch (err: unknown) {
//       let errorMessage = 'An unknown error occurred';
//       if (err instanceof Error) {
//         errorMessage = err.message;
//       } else if (typeof err === 'string') {
//         errorMessage = err;
//       }
//       console.error(`❌ Attempt ${i + 1} failed:`, errorMessage);
//     }
//   }

//   console.log('❌ Key not found after 5 attempts.');
//   return null;
// }
