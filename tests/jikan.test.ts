import { test, expect } from 'vitest';
import { Jikan } from '../src/provider/meta/jikan/index.js';
import { AnimeStatusFilter, Season } from '../src/provider/meta/jikan/types.js';
import { AnimeProvider } from '../src/types/types.js';

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const jikan = new Jikan();
test('search anime using string', async () => {
  const data = await jikan.search('one piece');
  expect(data.success).toBe(true);
  expect(data.data).not.toEqual([]);
  await wait(400);
});
test('fetch top anime', async () => {
  const data = await jikan.fetchTopAnime(1, 25, AnimeStatusFilter.Popularity);
  expect(data.data).not.toBe([]);
  expect(data.success).toBe(true);
  await wait(400);
});

test('fetch anime by season', async () => {
  const data = await jikan.fetchSeason(2023, Season.Fall);
  expect(data.data).not.toEqual([]);
  expect(data.success).toBe(true);
  await wait(400);
});

test('fetch next season anime', async () => {
  const data = await jikan.fetchNextSeason();
  expect(data.data).not.toEqual([]);
  expect(data.success).toBe(true);
  await wait(400);
});

test('fetch animeinfo by id', async () => {
  const data = await jikan.fetchInfo(56784);
  expect(data.data).not.toEqual(null);
  expect(data.success).toEqual(true);
  await wait(400);
});

test('fetch Mal anime episodes', async () => {
  const data = await jikan.fetchMalEpisodes(56784);
  expect(data.data).not.toEqual([]);
  expect(data.success).toBe(true);
  await wait(400);
});

test('fetch detailed mal info about an episode', async () => {
  const data = await jikan.fetchMalEpisodeInfo(58567, 3);
  expect(data.success).toBe(true);
  expect(data.data).not.toEqual(null);
  await wait(400);
});

test('fetch provider animeId', async () => {
  const data = await jikan.fetchProviderAnimeId(52299);
  expect(data.success).toBe(true);
  expect(data.data).not.toEqual(null);
  await wait(400);
});

test('fetch anime current season', async () => {
  const data = await jikan.fetchCurrentSeason();
  expect(data.success).toBe(true);
  expect(data.data).not.toEqual([]);
  await wait(400);
});

test('fetch AnimeProvider episodes', async () => {
  const data = await jikan.fetchAnimeEpisodes(52299, AnimeProvider.HiAnime);
  expect(data?.success).toBe(true);
  expect(data?.data).not.toEqual(null);

  await wait(400);
});

test('fetch anime characters', async () => {
  const data = await jikan.fetchAnimeCharacters(56784);
  expect(data.success).toBe(true);
  expect(data.data).not.toEqual([]);
  await wait(400);
});
