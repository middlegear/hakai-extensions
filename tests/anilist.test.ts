import { Anilist } from '../src/provider/meta/anilist/index.js';
import { test, expect } from 'vitest';

import { AnimeProvider, Seasons } from '../src/types/types.js';

const anilist = new Anilist();

test('Searches for anime ', async () => {
  const data = await anilist.search('bleach', 1, 20);
  expect(data.data).not.toEqual([]);
});

test('fetch airing anime', async () => {
  const data = await anilist.fetchAiring(1, 25);
  expect(data.data).not.toEqual([]);
});

test('fetch animeInfo', async () => {
  const data = await anilist.fetchInfo(21);
  expect(data.data).not.toEqual(null);
});

test('fetch related anime', async () => {
  const data = await anilist.fetchRelatedAnime(115230);
  expect(data.data).not.toEqual([]);
});

test('fetch trending anime', async () => {
  const data = await anilist.fetchTrending();
  expect(data.data).not.toEqual([]);
});

test('fetch provider anime with info', async () => {
  const data = await anilist.fetchProviderAnimeId(169755, AnimeProvider.HiAnime);
  expect(data.animeProvider).not.toEqual(null);
  expect(data.data).not.toEqual(null);
});

test('fetch characters', async () => {
  const data = await anilist.fetchCharacters(116674);
  expect(data.data).not.toEqual(null);
});

test('fetch popular anime', async () => {
  const data = await anilist.fetchMostPopular(1, 25, 'ONA');
  expect(data.data).not.toEqual([]);
});

test('fetch top rated anime', async () => {
  const data = await anilist.fetchTopRatedAnime(1, 3, 'MUSIC');

  expect(data.data).not.toEqual([]);
});

test('fetch seasonal anime', async () => {
  const data = await anilist.fetchSeasonalAnime(Seasons.WINTER, 2025, 1, 10, 'ONA');

  expect(data.data).not.toEqual([]);
});

test('fetch upcoming anime', async () => {
  const data = await anilist.fetchTopUpcoming(1, 10);

  expect(data.data).not.toEqual([]);
});

test('fetch provider episodes with info', async () => {
  const data = await anilist.fetchAnimeProviderEpisodes(159322, AnimeProvider.HiAnime);
  expect(data.providerEpisodes).not.toBe([]);
  expect(data.data).not.toEqual(null);
});
