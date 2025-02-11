import { test, expect } from 'vitest';
import { Anime } from '../src/provider/anime/anime.js';
import { Dubbing, Servers } from '../src/provider/anime/hianime/types.js';
const zoro = new Anime.HiAnime();
test('searches for anime based on query', async () => {
  const data = await zoro.search('bleach', 1);
  expect(data.success).not.toEqual(false);
  expect(data.data).not.toEqual([]);
});

test('Fetches animeInfo including episodes', async () => {
  const data = await zoro.fetchInfo('demon-slayer-kimetsu-no-yaiba-swordsmith-village-arc-18056');
  expect(data.success).toEqual(true);
  expect(data.data?.animeInfo).not.toEqual(null);
  expect(data.data?.episodes).not.toEqual([]);
});

test('fetches streaming servers', async () => {
  const data = await zoro.fetchEpisodeServers('solo-leveling-18718-episode-119497');

  expect(data.data).not.toEqual(null);
});

test('Fetches streaming sources on HD1', async () => {
  const data = await zoro.fetchSources(
    'boruto-naruto-next-generations-8143-episode-47182',
    Servers.HD1,
    Dubbing.Dub,
  );

  expect(data.data?.sources).not.toEqual([]);
});
