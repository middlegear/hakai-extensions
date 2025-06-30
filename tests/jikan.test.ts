import { test, expect } from 'vitest';
import { AnimeProvider, Seasons } from '../src/types/types.js';
import { Jikan } from '../src/provider/index.js';

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const RATE_LIMIT_MS = 800;

const jikan = new Jikan();

test('search anime', async () => {
  const data = await jikan.search('one piece');
  expect(Array.isArray(data.data)).toBe(true);
  expect(data.data.length).toBeGreaterThan(0);
  await wait(RATE_LIMIT_MS);
});

test('fetch top upcoming anime', async () => {
  const data = await jikan.fetchTopUpcoming(1, 25);
  expect(data.data.length).toBeGreaterThan(0);
  await wait(RATE_LIMIT_MS);
});

test('fetch top airing anime', async () => {
  const data = await jikan.fetchTopAiring(1, 25);
  expect(data.data.length).toBeGreaterThan(0);
  await wait(RATE_LIMIT_MS);
});

test('fetch most popular anime', async () => {
  const data = await jikan.fetchMostPopular(1, 20, 'MOVIE', 'airing');
  expect(data.data.length).toBeGreaterThan(0);
  await wait(RATE_LIMIT_MS);
});

test('fetch top movies category', async () => {
  const data = await jikan.fetchTopMovies(1, 20, 'bypopularity', 'OVA');
  expect(data.data.length).toBeGreaterThan(0);
  await wait(RATE_LIMIT_MS);
});

test('fetch anime by season', async () => {
  const data = await jikan.fetchSeason(Seasons.FALL, 2022, 'MOVIE');
  expect(data.data.length).toBeGreaterThan(0);
  await wait(RATE_LIMIT_MS);
});

test('fetch next season anime', async () => {
  const data = await jikan.fetchNextSeason();
  expect(data.data.length).toBeGreaterThan(0);
  await wait(RATE_LIMIT_MS);
});

test('fetch anime info by ID', async () => {
  const data = await jikan.fetchInfo(56784);
  expect(data.data).not.toBeNull();
  await wait(RATE_LIMIT_MS);
});

test('fetch MAL anime episodes', async () => {
  const data = await jikan.fetchMalEpisodes(56784);
  expect(Array.isArray(data.data)).toBe(true);
  expect(data.data.length).toBeGreaterThan(0);
  await wait(RATE_LIMIT_MS);
});

test('fetch detailed MAL episode info', async () => {
  const data = await jikan.fetchMalEpisodeInfo(58567, 3);
  expect(data.data).not.toBeNull();
  await wait(RATE_LIMIT_MS);
});

test('fetch provider anime ID', async () => {
  const data = await jikan.fetchProviderAnimeId(52299, AnimeProvider.HiAnime);
  expect(data.data).not.toBeNull();
  expect(data.animeProvider).not.toBeNull();
  await wait(RATE_LIMIT_MS);
});

test('fetch current season anime', async () => {
  const data = await jikan.fetchCurrentSeason(1, 20);
  expect(data.data.length).toBeGreaterThan(0);
  await wait(RATE_LIMIT_MS);
});

test('fetch AnimeProvider episodes', async () => {
  const data = await jikan.fetchAnimeProviderEpisodes(52299, AnimeProvider.HiAnime);
  expect(data.data).not.toBeNull();
  expect(Array.isArray(data.providerEpisodes)).toBe(true);
  expect(data.providerEpisodes.length).toBeGreaterThan(0);
  await wait(RATE_LIMIT_MS);
});

test('fetch anime characters', async () => {
  const data = await jikan.fetchAnimeCharacters(56784);
  expect(Array.isArray(data.data)).toBe(true);
  expect(data.data.length).toBeGreaterThan(0);
  await wait(RATE_LIMIT_MS);
});
