import { test, expect } from 'vitest';
import { AnimeKai, SubOrDub } from '../src/provider';

const animekai = new AnimeKai();
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
test('search anime ', async () => {
  const data = await animekai.search('solo levelling');

  expect(data.data).not.toEqual([]);
  await wait(1000);
});

test('fetch animeinfo including episodes', async () => {
  const data = await animekai.fetchAnimeInfo('solo-leveling-season-2-arise-from-the-shadow-x7rq');

  expect(data.data).not.toBe(null);
  await wait(1000);
});

test('fetch servers using episodeId', async () => {
  const data = await animekai.fetchServers(
    'solo-leveling-season-2-arise-from-the-shadow-x7rq$ep=1$token=nlDUzxikR-FjjoaHrd1v',
  );
  expect(data.data).not.toBe([]);
  await wait(1000);
});

test('fetch episode sources', async () => {
  const data = await animekai.fetchSources(
    'solo-leveling-season-2-arise-from-the-shadow-x7rq$ep=7$token=JYu7qq7yvRuzlXRXxYfd',
    SubOrDub.SUB,
  );

  expect(data.headers.Referer).not.toBe(null);
  expect(data.data).not.toBe(null);

  await wait(1000);
});
