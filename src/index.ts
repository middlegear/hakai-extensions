// import { Anilist } from './provider/meta/anilist/index.js';
// import { Jikan } from './provider/meta/jikan/index.js';
// import { HiAnime } from './provider/index.js';
// import { Meta } from './provider/meta/meta.js';
// import { Anime } from './provider/anime/anime.js';
// export { Anilist, Jikan, HiAnime, Anime, Meta };
import { searchanime } from './provider/anime/animekai/animekai';
const data = await searchanime('one');
console.log(data);
