import * as cheerio from 'cheerio';
import type { vidServers } from './types.js';

export function getServersHash($: cheerio.CheerioAPI) {
  const servers: vidServers[] = [];

  $('div.serversList > div.server').each((i, element) => {
    const name = $(element)
      .text()
      .toLowerCase()
      .replace(/\s*pro/i, '')
      .trim();
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

export function ScrapeCloudStreampro($: cheerio.CheerioAPI) {
  const playerScript = $('script').filter((_, el) => {
    const content = $(el).html();
    return content?.includes('new Playerjs') ?? false;
  });

  const scriptContent = playerScript.length > 0 ? playerScript.html() : null;

  if (!scriptContent) {
    return {
      file: null,
      cuid: null,
    };
  }

  const fileRegex = /file:\s*'(.*?)'/;
  const cuidRegex = /cuid:\s*"(.*?)"/;

  const fileMatch = scriptContent.match(fileRegex);
  // const cuidMatch = scriptContent.match(cuidRegex);

  return {
    file: fileMatch?.[1] ?? null,
    // cuid: cuidMatch?.[1] ?? null,
  };
}

export function ScrapeSwishId($: cheerio.CheerioAPI) {
  const id = $('#iframesrc').attr('data-src');
  return id;
}

export function Scrape2EmbedIframe($: cheerio.CheerioAPI) {
  const iframe = $('#cptxt').attr('value');
  const regex = /src="(.*?)"/;
  const match = iframe?.match(regex);

  if (match && match[1]) {
    return match[1];
  }
}
