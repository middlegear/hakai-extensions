import { test, expect } from 'vitest';
import { KagamiAnime } from '../src/provider/anime/kagamianime';
import { SubOrDub } from '../src/provider/anime/kagamianime/types';
const kagamiAnime = new KagamiAnime();
test('search anime ', async () => {
  const data = await kagamiAnime.search('solo levelling');
  expect(data.success).toEqual(true);
  expect(data.data).not.toBe([]);
});

test('fetch animeinfo including episodes', async () => {
  const data = await kagamiAnime.fetchAnimeInfo('solo-leveling-season-2-arise-from-the-shadow-x7rq');
  expect(data.success).toEqual(true);
  expect(data.data).not.toBe(null);
});

test('fetch servers using episodeId', async () => {
  const data = await kagamiAnime.fetchServers(
    'solo-leveling-season-2-arise-from-the-shadow-x7rq$ep=1$token=nlDUzxikR-FjjoaHrd1v',
  );
  expect(data.success).toEqual(true);
  expect(data.data).not.toBe([]);
});

test('fetch episode sources', async () => {
  const data = await kagamiAnime.fetchSources(
    'solo-leveling-season-2-arise-from-the-shadow-x7rq$ep=1$token=nlDUzxikR-FjjoaHrd1v',
    SubOrDub.SUB,
  );
  expect(data.success).toEqual(true);
  expect(data.data).not.toBe(null);
});
