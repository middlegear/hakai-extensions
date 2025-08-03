import * as cheerio from 'cheerio';
import type { vidServers } from './types.js';

export function getServersHash($: cheerio.CheerioAPI) {
  const servers: vidServers[] = [];

  $('div.serversList > div.server').each((i, element) => {
    const name = $(element).text().trim().toLowerCase();
    const hash = $(element).attr('data-hash');

    servers.push({
      name: name,
      hash: hash as string,
    });
  });

  return servers;
}

export function getFrame($: cheerio.CheerioAPI): string | null {
  const scriptContent = $('script')
    .filter(function () {
      const html = $(this).html() || '';

      return html.includes('function loadIframe');
    })
    .html();

  if (scriptContent) {
    const regex = /src:\s*'(.*?)'/;
    const match = scriptContent.match(regex);

    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}
