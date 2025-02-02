import { anitakuClient } from '../../provider/anime';

export async function MP4Upload(videoUrl: URL) {
  try {
    const { data } = await anitakuClient.get(`${videoUrl.href}`, {
      headers: {
        Referer: 'https://s3embtaku.pro/',
      },
    });

    if (data.includes('player.src')) {
      const match = data.match(
        /type:\s*"(.*?)",\s*src:\s*"(https?:\/\/[^"]+)"/
      ); // Match type and src
      if (match) {
        return { type: match[1], src: match[2] };
      }
    } else {
      return {
        success: false,
        error: Error instanceof Error ? Error.message : 'No match found',
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Check URL href',
    };
  }
}
