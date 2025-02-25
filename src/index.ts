import { AnimeKai } from './provider/anime/animekai/index.js';
import { Servers, SubOrDub } from './provider/anime/hianime/types.js';
import { HiAnime } from './provider/index.js';
import { Anilist } from './provider/meta/anilist/index.js';
// import { Jikan } from './provider/meta/jikan/index.js';
// import { HiAnime } from './provider/index.js';
// import { Meta } from './provider/meta/meta.js';
// import { Anime } from './provider/anime/anime.js';
// export { Anilist, Jikan, HiAnime, Anime, Meta };

// import { getAnimeInfo, getEpisodeServers } from './provider/anime/animekai/animekai';
// import { SubOrDub } from './provider/anime/animekai/types';
// const data = await getEpisodeServers(
//   'solo-leveling-season-2-arise-from-the-shadow-x7rq$ep=1$token=nlDUzxikR-FjjoaHrd1v',
//   SubOrDub.SUB,
// );
// console.log(data);

// const anilist = new Anilist();
// const data = await anilist.search('akame ga kill');
// console.log(data);
const zoro = new HiAnime();
const data = await zoro.fetchSources('boruto-naruto-next-generations-8143-episode-47182', Servers.HD1, SubOrDub.SUB);
console.log(data);
