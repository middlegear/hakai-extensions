import axios from 'axios';
import { fetchAnimeById } from './anilist.js';

enum animeProvider {
  Anitaku,
  HiAnime,
  AnimeZ,
}

export async function fetchEpisodesMeta(id: number, provider: animeProvider) {
  try {
    const anilist = await fetchAnimeById(id);
    const romajititle = anilist.data?.title.romaji;
    const englishTitle = anilist.data?.title.english;
    let data;
    switch (provider) {
      case animeProvider.AnimeZ:
        break;

      default:
        break;
    }
  } catch (error) {}
}
