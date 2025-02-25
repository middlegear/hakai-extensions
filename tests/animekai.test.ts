import { test, expect } from 'vitest';
import { AnimeKai } from '../src/provider/anime/animekai';

const animekai = new AnimeKai();

test('search anime ', async () => {
  const data = await animekai.search('solo levelling');
  expect(data.success).toEqual(true);
  expect(data.data).not.toBe([]);
});

test('fetch animeinfo including episodes', async () => {
  const data = await animekai.fetchAnimeInfo('solo-leveling-season-2-arise-from-the-shadow-x7rq');
  expect(data.success).toEqual(true);
  expect(data.data).not.toBe(null);
});

test('fetch servers using episodeId', async () => {
  const data = await animekai.fetchServers(
    'solo-leveling-season-2-arise-from-the-shadow-x7rq$ep=1$token=nlDUzxikR-FjjoaHrd1v',
  );
  expect(data.success).toEqual(true);
  expect(data.data).not.toBe([]);
});
