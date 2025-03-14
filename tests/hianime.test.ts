import { test, expect } from 'vitest';
import { Anime } from '../src/provider/anime/anime.js';
import { SubOrDub } from '../src/provider/index.js';
import { HiAnimeServers } from '../src/provider/anime/hianime/types.js';

const zoro = new Anime.HiAnime();
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
test('searches for anime based on query', async () => {
  const data = await zoro.search('bleach', 1);

  expect(data.data).not.toEqual([]);
  await wait(1000);
});

test('Fetches animeInfo ', async () => {
  const data = await zoro.fetchInfo('demon-slayer-kimetsu-no-yaiba-swordsmith-village-arc-18056');

  expect(data.data).not.toEqual(null);
  expect(data).not.toEqual([]);
  await wait(1000);
});

test('Fetches episodes data ', async () => {
  const data = await zoro.fetchInfo('demon-slayer-kimetsu-no-yaiba-swordsmith-village-arc-18056');

  expect(data.data).not.toEqual([]);
  await wait(1000);
});
test('fetches streaming servers', async () => {
  const data = await zoro.fetchEpisodeServers('solo-leveling-18718-episode-119497');

  expect(data.data).not.toEqual(null);
  await wait(1000);
});

test('Fetches streaming sources on HD1', async () => {
  const data = await zoro.fetchSources('solo-leveling-18718-episode-119497', HiAnimeServers.HD2, SubOrDub.DUB);

  expect(data.data).not.toEqual(null);

  await wait(1000);
});
