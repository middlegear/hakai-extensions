import { test, expect } from 'vitest';
import { AnimeProvider, Seasons } from '../src/types/types.js';
import { Jikan } from '../src/provider/index.js';
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const jikan = new Jikan();
test('search anime ', async () => {
  const data = await jikan.search('one piece');

  expect(data.data).not.toEqual([]);
  await wait(800);
});
test('fetch top upcoming anime', async () => {
  const data = await jikan.fetchTopUpcoming(1, 25);
  expect(data.data).not.toEqual([]);

  await wait(800);
});
test('fetch top airing anime', async () => {
  const data = await jikan.fetchTopAiring(1, 25);
  expect(data.data).not.toEqual([]);

  await wait(800);
});
test('fetch most popular anime', async () => {
  const data = await jikan.fetchMostPopular(1, 20, 'MOVIE', 'airing');
  expect(data.data).not.toEqual([]);

  await wait(800);
});

test('fetch top movies category', async () => {
  const data = await jikan.fetchTopMovies(1, 20, 'bypopularity', 'OVA');
  expect(data.data).not.toEqual([]);

  await wait(800);
});

test('fetch anime by season', async () => {
  const data = await jikan.fetchSeason(Seasons.FALL, 2022, 'MOVIE');
  expect(data.data).not.toEqual([]);
  await wait(800);
});

test('fetch next season anime', async () => {
  const data = await jikan.fetchNextSeason();
  expect(data.data).not.toEqual([]);

  await wait(800);
});

test('fetch animeinfo by id', async () => {
  const data = await jikan.fetchInfo(56784);
  expect(data.data).not.toEqual(null);

  await wait(800);
});

test('fetch Mal anime episodes', async () => {
  const data = await jikan.fetchMalEpisodes(56784);
  expect(data.data).not.toEqual([]);
  await wait(800);
});

test('fetch detailed mal info about an episode', async () => {
  const data = await jikan.fetchMalEpisodeInfo(58567, 3);
  expect(data.data).not.toEqual(null);
  await wait(800);
});

test('fetch provider animeId', async () => {
  const data = await jikan.fetchProviderAnimeId(52299, AnimeProvider.HiAnime);
  expect(data.data).not.toEqual(null);
  expect(data.animeProvider).not.toEqual(null);
  await wait(800);
});

test('fetch anime current season', async () => {
  const data = await jikan.fetchCurrentSeason(1, 20);

  expect(data.data).not.toEqual([]);
  await wait(800);
});

test('fetch AnimeProvider episodes', async () => {
  const data = await jikan.fetchAnimeProviderEpisodes(52299, AnimeProvider.HiAnime);
  expect(data?.data).not.toEqual(null);
  expect(data.providerEpisodes).not.toEqual([]);

  await wait(400);
});

test('fetch anime characters', async () => {
  const data = await jikan.fetchAnimeCharacters(56784);

  expect(data.data).not.toEqual([]);
  await wait(800);
});
