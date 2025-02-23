import { expect, test } from 'vitest';
import { Anime } from '../src/provider/anime/anime.js';
import { category, servers } from '../src/provider/anime/animeZ/types.js';
const animeZ = new Anime.AnimeZ();
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
test('Searches for anime based on the provided query', async () => {
  const data = await animeZ.search('bleach');
  expect(data.success).not.toEqual(false);
  expect(data.data).not.toEqual([]);
  await wait(300);
});

test('Fetches detailed information about a specific anime', async () => {
  const data = await animeZ.fetchInfo('naruto-shippuden-8196');
  expect(data.data).not.toEqual(null);
  expect(data.success).toEqual(true);
  await wait(300);
});

test('fetch episodes in an anime', async () => {
  const data = await animeZ.fetchEpisodes('solo-leveling-310');
  expect(data.success).toEqual(true);
  await wait(300);
});

test('Fetches subbed streaming sources about an anime', async () => {
  const data = await animeZ.fetchSources(
    'bleach-thousandyear-blood-war-–-the-conflict-12505/epi-14-195280',
    category.SUB,
    servers.SU57,
  );
  expect(data?.success).toEqual(true);
  await wait(300);
});

test('Fetches dubbed streaming sources about an anime', async () => {
  const data = await animeZ.fetchSources('solo-leveling-310/epi-12dub-180342', category.SUB, servers.SU57);
  expect(data?.success).toEqual(true);
  await wait(300);
});
