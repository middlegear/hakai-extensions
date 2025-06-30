import { test, expect } from 'vitest';

import { AnimeProvider, Seasons } from '../src/types/types.js';
import { Anilist } from '../src/provider/index.js';

const anilist = new Anilist();

test('searches for anime', async () => {
  const data = await anilist.search('bleach', 1, 20);
  expect(Array.isArray(data.data)).toBe(true);
  expect(data.data.length).toBeGreaterThan(0);
});

test('fetch airing anime', async () => {
  const data = await anilist.fetchAiring(1, 25);
  expect(Array.isArray(data.data)).toBe(true);
  expect(data.data.length).toBeGreaterThan(0);
});

test('fetch anime info', async () => {
  const data = await anilist.fetchInfo(21);
  expect(data.data).not.toBeNull();
});

test('fetch related anime', async () => {
  const data = await anilist.fetchRelatedAnime(115230);
  expect(Array.isArray(data.data)).toBe(true);
  expect(data.data.length).toBeGreaterThan(0);
});

test('fetch trending anime', async () => {
  const data = await anilist.fetchTrending();
  expect(Array.isArray(data.data)).toBe(true);
  expect(data.data.length).toBeGreaterThan(0);
});

test('fetch anime provider ID with info', async () => {
  const data = await anilist.fetchProviderAnimeId(169755, AnimeProvider.HiAnime);
  expect(data.animeProvider).not.toBeNull();
  expect(data.data).not.toBeNull();
});

test('fetch characters', async () => {
  const data = await anilist.fetchCharacters(116674);
  expect(data.data).not.toBeNull();
});

test('fetch most popular anime', async () => {
  const data = await anilist.fetchMostPopular(1, 25, 'ONA');
  expect(Array.isArray(data.data)).toBe(true);
  expect(data.data.length).toBeGreaterThan(0);
});

test('fetch top rated anime', async () => {
  const data = await anilist.fetchTopRatedAnime(1, 3, 'MUSIC');
  expect(Array.isArray(data.data)).toBe(true);
  expect(data.data.length).toBeGreaterThan(0);
});

test('fetch seasonal anime', async () => {
  const data = await anilist.fetchSeasonalAnime(Seasons.WINTER, 2025, 'ONA', 1, 10);
  expect(Array.isArray(data.data)).toBe(true);
  expect(data.data.length).toBeGreaterThan(0);
});

test('fetch upcoming anime', async () => {
  const data = await anilist.fetchTopUpcoming(1, 10);
  expect(Array.isArray(data.data)).toBe(true);
  expect(data.data.length).toBeGreaterThan(0);
});

test('fetch anime provider episodes with info', async () => {
  const data = await anilist.fetchAnimeProviderEpisodes(159322, AnimeProvider.HiAnime);
  expect(Array.isArray(data.providerEpisodes)).toBe(true);
  expect(data.providerEpisodes.length).toBeGreaterThan(0);
  expect(data.data).not.toBeNull();
});
