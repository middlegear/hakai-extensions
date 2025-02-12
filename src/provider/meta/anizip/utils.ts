interface Title {
  en?: string;
  ja?: string;
  de?: string;
  'x-jat'?: string;
}

interface Mappings {
  animeplanet_id: string;
  kitsu_id: number;
  mal_id: number;
  type: string;
  anilist_id: number;
  anisearch_id: number;
  anidb_id: number;
  notifymoe_id: string;
  livechart_id: number;
  thetvdb_id: number;
  imdb_id: string;
  themoviedb_id: number;
}

interface Episode {
  episode: number;
  tvdbId: number;
  tvdbShowId: number;
  seasonNumber: number;
  episodeNumber: number;
  absoluteEpisodeNumber: number;
  title: { en?: string; ja?: string; de?: string; 'x-jat'?: string };
  airDate: string;
  airDateUtc: string;
  runtime: number;
  overview?: string;
  image?: string;
  rating?: string;
}

interface ApiResponse {
  images: any;
  titles: Title;
  mappings: Mappings;
  episodes: { [key: string]: Episode };
}

export function transformData(data: ApiResponse) {
  // if (!data) {
  //   return { animeTitles: {}, mappings: {}, episodes: [] };
  // }
  const titles = {
    english: data.titles?.en || data.titles?.['x-jat'],
    japanese: data.titles?.ja,
    german: data.titles?.de,
    romanizedJapanese: data.titles?.['x-jat'],
  };

  const mappings = {
    animePlanetId: data.mappings?.animeplanet_id || null,
    kitsuId: data.mappings?.kitsu_id || null,
    malId: data.mappings?.mal_id || null,
    anilistId: data.mappings?.anilist_id || null,
    anisearchId: data.mappings?.anisearch_id || null,
    anidbId: data.mappings?.anidb_id || null,
    notifymoeId: data.mappings?.notifymoe_id || null,
    livechartId: data.mappings?.livechart_id || null,
    thetvdbId: data.mappings?.thetvdb_id || null,
    imdbId: data.mappings?.imdb_id || null,
    themoviedbId: data.mappings?.themoviedb_id || null,
  };
  const now = new Date();

  const transformedEpisodes = Object.values(data.episodes)
    .filter(episode => {
      const airDateTime = new Date(episode.airDateUtc);
      airDateTime.setMinutes(airDateTime.getMinutes() + 0); // Add 30 minutes buffer idk for now its 0
      return airDateTime <= now;
    })
    .map(episode => ({
      tvdbId: episode.tvdbId,
      tvdbShowId: episode.tvdbShowId || null,
      seasonNumber: episode.seasonNumber || null,
      episodeAnimeNumber: Number(episode.episode) || null,
      absoluteEpisode: episode.absoluteEpisodeNumber || null,
      title: {
        english: episode.title?.en || episode.title?.['x-jat'] || null,
        japanese: episode.title?.ja || null,
        german: episode.title?.de || null,
        romanizedJapanese: episode.title?.['x-jat'] || null,
      },
      airDate: episode.airDate || null,
      runtime: episode.runtime || null,
      overview: episode.overview || 'No overview available' || null,
      image: episode.image || 'No image available' || null,
      rating: episode.rating ? parseFloat(episode.rating) : null,
      aired: true,
    }));
  const images = data.images;
  return {
    images: images,
    animeTitles: titles,
    mappings: mappings,
    episodes: transformedEpisodes,
  };
}
