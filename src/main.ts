// import { Anime } from './provider/anime/anime';
// import { Anilist, Jikan, Meta } from './provider';
// import { HiAnime } from './provider/anime/hianime';
// import { AnimeKai } from './provider/anime/animekai';

import { Anilist, Jikan } from './provider';
import { TheMovieDb } from './provider/meta/tmdb';
import { getTvEpisodes, getTvShowInfo } from './provider/meta/tmdb/tmdb';

// import {
//   AnimeKaiServers,
//   type Seasons,
//   type SubOrDub,
//   type Sort,
//   type JikanStatus,
//   type AnilistStatus,
//   type Format,
//   type Charactersort,
//   type HiAnimeServers,
//   type AnimeProvider,
// } from './types/index';

// export {
//   type Seasons,
//   type SubOrDub,
//   type Sort,
//   type JikanStatus,
//   type AnilistStatus,
//   type Format,
//   type Charactersort,
//   type AnimeKaiServers,
//   type HiAnimeServers,
//   type AnimeProvider,
// };
// export { Anime, Meta, Anilist, Jikan, HiAnime, AnimeKai };
// // const anime = new Anilist();
// // const data = await anime.fetchAnimeInfo('solo-leveling-season-2-arise-from-the-shadow-x7rq$ep=4$token=KYXkrP3loU3k2nVMz4fV');
// // console.log(data);
// // const data = await anime.fetchAnimeProviderEpisodes(5114, 'animekai');

// // console.log(data);

import {
  searchImdb,
  getInfoDetailed,
  getShowEpisodes,
  searchShows,
  getExternal,
  //   getEmbed,
} from './provider/meta/tvmaze/tvmaze';
const Movie = new TheMovieDb();
const anilist = new Jikan();

const data = await getTvEpisodes(100088, 1, 'b29bfe548cc2a3e4225effbd54ef0fda');
// const data = await searchShows('under the dome');
// const data = await getEmbed(46562, 1, 1);
// const data = await anilist.fetchProviderAnimeId(56784, 'animekai');
console.log(JSON.stringify(data));
