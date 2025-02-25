// import { Anilist } from './provider/meta/anilist/index.js';
import { RakuzanAnime } from './provider/index.js';
import { Jikan } from './provider/meta/jikan/index.js';
import {
  getEpisodeswithInfo,
  getEpisodeswithInfoKai,
  //   getKaiProviderId,
  //   getZoroProviderId,
} from './provider/meta/jikan/jikan.js';
import { AnimeProvider } from './types/types.js';
// import { HiAnime } from './provider/index.js';
// import { Meta } from './provider/meta/meta.js';
// import { Anime } from './provider/anime/anime.js';
// export { Anilist, Jikan, HiAnime, Anime, Meta };

// import { getEpisodeServers, getEpisodeSources } from './provider/anime/kagamianime/kagamiAnime.js';
// import { Servers, SubOrDub } from './provider/anime/kagamianime/types.js';
// const data = await getEpisodeSources(
//   'solo-leveling-season-2-arise-from-the-shadow-x7rq$ep=1$token=nlDUzxikR-FjjoaHrd1v',
//   SubOrDub.SUB,
// );
// console.log(data);

// const anilist = new Anili
/// so the megaupclass uses serverurl to do its thing basically its an embeded iframe url
// const jikan = new RakuzanAnime();
// const data = await jikan.fetchSources('bleach-thousand-year-blood-war-the-conflict-19322-episode-128578');
// console.log(JSON.stringify(data)); 169755
const jikan = new Jikan();
const data = await jikan.fetchProviderAnimeId(56784, AnimeProvider.KagamiAnime);
console.log(data);
