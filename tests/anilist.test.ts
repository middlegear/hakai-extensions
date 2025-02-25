import { Anilist } from '../src/provider/meta/anilist/index.js';
import { test, expect } from 'vitest';

import { Seasons } from '../src/types/types.js';

const anilist = new Anilist();

test('Searches for anime ', async () => {
  const data = await anilist.search('bleach', 1, 20);
  expect(data.success).toEqual(true);
  expect(data.data).not.toEqual([]);
});

test('fetch airing anime', async () => {
  const data = await anilist.fetchAiring(1, 25);
  expect(data.data).not.toEqual([]);
  expect(data.success).toEqual(true);
});

test('fetch animeInfo', async () => {
  const data = await anilist.fetchInfo(21);
  expect(data.data).not.toEqual(null);
  expect(data.success).toEqual(true);
});

test('fetch related anime', async () => {
  const data = await anilist.fetchRelatedAnime(115230);
  expect(data.data).not.toEqual([]);
  expect(data.success).toEqual(true);
});

test('fetch trending anime', async () => {
  const data = await anilist.fetchTrending();
  expect(data.data).not.toEqual([]);
  expect(data.success).toEqual(true);
});

test('fetch animeId mapping', async () => {
  const data = await anilist.fetchHianimeMapping(169755);
  expect(data.success).toEqual(true);
  expect(data.data).not.toEqual(null);
});

test('fetch characters', async () => {
  const data = await anilist.fetchCharacters(116674);
  expect(data.data).not.toEqual(null);
  expect(data.success).toEqual(true);
});

test('fetch popular anime', async () => {
  const data = await anilist.fetchMostPopular(1, 25);
  expect(data.data).not.toEqual([]);
  expect(data.success).toEqual(true);
});

test('fetch top rated anime', async () => {
  const data = await anilist.fetchTopRatedAnime(1, 3);
  expect(data.success).not.toEqual(false);
  expect(data.data).not.toEqual([]);
});

test('fetch seasonal anime', async () => {
  const data = await anilist.fetchSeasonalAnime(Seasons.WINTER, 2025, 1, 10);
  expect(data.success).not.toEqual(false);
  expect(data.data).not.toEqual([]);
});

test('fetch upcoming anime', async () => {
  const data = await anilist.fetchTopUpcoming(1, 10);
  expect(data.success).not.toEqual(false);
  expect(data.data).not.toEqual([]);
});

test('fetch episodes', async () => {
  const data = await anilist.fetchHiAnimeEpisodes(159322);
  expect(data?.success).not.toEqual(false);
  expect(data?.data).not.toEqual(null);
});
