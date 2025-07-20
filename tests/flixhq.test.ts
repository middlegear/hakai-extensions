import { expect, test } from 'vitest';
import { FlixHQ } from '../src/provider/index.js';

const flixhq = new FlixHQ();

test('returns search results for movie and TV shows', async () => {
  const data = await flixhq.search('bad boys');

  expect(Array.isArray(data.data)).toBe(true);
  expect(data.data.length).toBeGreaterThan(0);
});

test('returns media information on movie / TV show', async () => {
  const data = await flixhq.fetchMediaInfo('tv/watch-the-boys-33895');

  expect(data.data).not.toBeNull();
  expect(Array.isArray(data.episodes)).toBe(true);
  expect(data.episodes.length).toBeGreaterThan(0);
});

test('return media servers', async () => {
  const data = await flixhq.fetchMediaServers('episode-1019968');

  expect(Array.isArray(data.data)).toBe(true);
  expect(data.data.length).toBeGreaterThan(0);
});

test('return media sources', async () => {
  const data = await flixhq.fetchSources('episode-1019968');

  expect(data).not.toBeNull();
  expect(data.data?.sources.length).toBeGreaterThan(0);
});
