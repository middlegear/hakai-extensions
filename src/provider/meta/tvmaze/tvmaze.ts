import axios from 'axios';
import { TheMovieDb } from '../tmdb';
import { bestTVTitle } from '../../../utils/mapper';

const tvMazeApiUrl = 'https://api.tvmaze.com' as const;
type searchData = {
  tvMazeId: number;
  url: string;
  name: string;
  type: string;
  language: string;
  status: string;
  genres: string[];
  startDate: string;
  endDate: string;
  officialSite: string;
  airSchedule: { time: string; days: string[] };
  rating: number;
  image: string;
  network: { id: number; name: string; country: string; code: string; timezone: string };
  summary: string;
  previousEpisode: string;
  searchScore: number;
  weight: number;
  external: {
    tvrage: number;
    imdb: string;
    thetvdb: string;
  };
};
type castData = {
  castId: number;
  name: string;
  url: string;
  country: string | null;
  birthDate: string;
  gender: string;
  image: string;
  character: {
    characterId: string;
    name: string;
    url: string;
    image: string;
  };
};
type episodeData = {
  tvMazeEpisodeId: number;
  url: string;
  title: string;
  season: string;
  episodeNumber: string;
  type: string;
  rating: number;
  runtime: number;
  airdate: string;
  airstamp: string;
  image: {
    medium: string;
    original: string;
  };
  summary: string;
};
export async function searchShows(query: string) {
  if (!query) {
    return {
      data: [],
      error: 'Missing required parameter',
    };
  }
  try {
    const response = await axios.get(`${tvMazeApiUrl}/search/shows?q=${query}`);
    const data: searchData[] = response.data.map((item: any) => ({
      tvMazeId: item.show.id,
      url: item.show.url,
      name: item.show.name,
      type: item.show.type,
      language: item.show.language,
      status: item.show.status,
      genres: item.show.genres,
      startDate: item.show.premiered,
      endDate: item.show.ended,
      officialSite: item.show.officialSite,
      airSchedule: item.show.schedule,
      rating: item.show.rating.average,
      image: item.show.image,
      network: item.show.network,
      summary: item.show.summary,
      previousEpisode: item.show._links.previousepisode,
      searchScore: item.score,
      weight: item.show.weight,
      external: item.show.externals,
    }));

    if (!response.data)
      return {
        data: [],
        error: response.statusText,
      };
    return {
      data: data as searchData[],
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function searchTvdb(tvdbId: number) {
  if (!tvdbId) {
    return { data: null, error: 'Missing required params tvdb Id' };
  }
  try {
    const response = await axios.get(`${tvMazeApiUrl}/lookup/shows?thetvdb=${tvdbId}`);
    const data: searchData = {
      tvMazeId: response.data.id || null,
      url: response.data.url || null,
      name: response.data.name || null,
      type: response.data.type || null,
      language: response.data.language || null,
      status: response.data.status || null,
      genres: response.data.genres || [],
      startDate: response.data.premiered || null,
      endDate: response.data.ended || null,
      officialSite: response.data.officialSite || null,
      airSchedule: response.data.schedule || null,
      rating: response.data.rating.average || null,
      image: response.data.image || null,
      network: response.data.network || null,
      summary: response.data.summary || null,
      previousEpisode: response.data._links.previousepisode || null,
      searchScore: response.data.score || null,
      weight: response.data.weight || null,
      external: response.data.externals || null,
    };

    if (!response.data)
      return {
        data: null,
        error: response.statusText,
      };
    return {
      data: data as searchData,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
export async function searchImdb(imdbId: string) {
  if (!imdbId) {
    return { data: null, error: 'Missing required params imdb Id' };
  }
  try {
    const response = await axios.get(`${tvMazeApiUrl}/lookup/shows?imdb=${imdbId}`);
    const data: searchData = {
      tvMazeId: response.data.id || null,
      url: response.data.url || null,
      name: response.data.name || null,
      type: response.data.type || null,
      language: response.data.language || null,
      status: response.data.status || null,
      genres: response.data.genres || [],
      startDate: response.data.premiered || null,
      endDate: response.data.ended || null,
      officialSite: response.data.officialSite || null,
      airSchedule: response.data.schedule || null,
      rating: response.data.rating.average || null,
      image: response.data.image || null,
      network: response.data.network || null,
      summary: response.data.summary || null,
      previousEpisode: response.data._links.previousepisode || null,
      searchScore: response.data.score || null,
      weight: response.data.weight || null,
      external: response.data.externals || null,
    };

    if (!response.data)
      return {
        data: null,
        error: response.statusText,
      };
    return {
      data: data as searchData,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function getInfo(tvmazeId: number) {
  if (!tvmazeId) {
    return { data: null, error: 'Missing required params tvmaze Id' };
  }
  try {
    const response = await axios.get(`${tvMazeApiUrl}/shows/${tvmazeId}`);
    const data: searchData = {
      tvMazeId: response.data.id || null,
      url: response.data.url || null,
      name: response.data.name || null,
      type: response.data.type || null,
      language: response.data.language || null,
      status: response.data.status || null,
      genres: response.data.genres || [],
      startDate: response.data.premiered || null,
      endDate: response.data.ended || null,
      officialSite: response.data.officialSite || null,
      airSchedule: response.data.schedule || null,
      rating: response.data.rating.average || null,
      image: response.data.image || null,
      network: response.data.network || null,
      summary: response.data.summary || null,
      previousEpisode: response.data._links.previousepisode || null,
      searchScore: response.data.score || null,
      weight: response.data.weight || null,
      external: response.data.externals || null,
    };

    if (!response.data)
      return {
        data: null,
        error: response.statusText,
      };
    return {
      data: data as searchData,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
export async function getInfoDetailed(tvmazeId: number) {
  if (!tvmazeId) {
    return { data: null, error: 'Missing required params tvmaze Id' };
  }
  try {
    const response = await axios.get(`${tvMazeApiUrl}/shows/${tvmazeId}?embed[]=episodes&embed[]=cast`);
    const data = {
      tvMazeId: response.data.id || null,
      url: response.data.url || null,
      name: response.data.name || null,
      type: response.data.type || null,
      language: response.data.language || null,
      status: response.data.status || null,
      genres: response.data.genres || [],
      startDate: response.data.premiered || null,
      endDate: response.data.ended || null,
      officialSite: response.data.officialSite || null,
      airSchedule: response.data.schedule || null,
      rating: response.data.rating.average || null,
      image: response.data.image || null,
      network: response.data.network || null,
      summary: response.data.summary || null,
      previousEpisode: response.data._links.previousepisode || null,
      searchScore: response.data.score || null,
      weight: response.data.weight || null,
      external: response.data.externals || null,
      episodes: response.data._embedded.episodes.map((item: any) => ({
        tvMazeEpisodeId: item.id || null,
        url: item.url || null,
        title: item.name || null,
        season: item.season || null,
        episodeNumber: item.number || null,
        type: item.type || null,
        rating: item.rating.average || null,
        runtime: item.runtime || null,
        airdate: item.airdate || null,
        airstamp: item.airstamp || null,
        image: {
          medium: item.image.medium || null,
          original: item.image.original || null,
        },
        summary: item.summary || null,
      })),
      cast: response.data._embedded.cast.map((item: any) => ({
        castId: item.person.id || null,
        name: item.person.name || null,
        url: item.person.url || null,
        country: item.person.name || item.person.code || null,
        birthDate: item.person.birthday || null,
        gender: item.person.gender || null,
        image: item.person.image || null,
        character: {
          characterId: item.character.id || null,
          name: item.character.name || null,
          url: item.character.url || null,
          image: item.character.image || null,
        },
      })),
    };

    if (!response.data)
      return {
        data: null,
        error: response.statusText,
      };
    return {
      data: data,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function getShowEpisodes(tvmazeId: number) {
  if (!tvmazeId) {
    return { data: null, error: 'Missing required params tvmaze Id' };
  }
  try {
    const response = await axios.get(`${tvMazeApiUrl}/shows/${tvmazeId}/episodes`);
    const data = response.data.map((item: any) => ({
      tvMazeEpisodeId: item.id || null,
      url: item.url || null,
      title: item.name || null,
      season: item.season || null,
      episodeNumber: item.number || null,
      type: item.type || null,
      rating: item.rating.average || null,
      runtime: item.runtime || null,
      airdate: item.airdate || null,
      airstamp: item.airstamp || null,
      image: {
        medium: item.image.medium || null,
        original: item.image.original || null,
      },
      summary: item.summary || null,
    }));

    if (!response.data)
      return {
        data: null,
        error: response.statusText,
      };
    return {
      data: data,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function getExternal(tvMazeId: number) {
  if (!tvMazeId) {
    return { data: null, error: 'Missing required params tvmaze Id' };
  }
  try {
    const response = await axios.get(`${tvMazeApiUrl}/shows/${tvMazeId}`);
    const data = {
      tvMazeId: response.data.id || null,
      name: response.data.name || null,
      tvRageId: response.data.externals.tvrage || null,
      theTvDb: response.data.externals.thetvdb || null,
      imdb: response.data.externals.imdb || null,
    };

    if (!response.data)
      return {
        data: null,
        error: response.statusText,
      };
    //search tmdb
    const tmdb = new TheMovieDb();
    const res = await tmdb.searchShows(data.name);
    const title = bestTVTitle(data.name, res.data);

    const resp = { TheMovieDb: title?.tmdbId, ...data };
    return {
      data: resp,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function getProviderIdMapping(tvmazeId: number) {
  try {
  } catch (error) {}
}
