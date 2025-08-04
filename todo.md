//  "prepare": "pnpm run build",
'
// import { _getsources } from './provider/movies/flixhq/flixhq.js';

// const data = await _getsources('movie-109831', 'akcloud');
// const data = await _getsources('episode-1019968', 'vidcloud');
// const flixhq = new FlixHQ();
//movie/final-destination-bloodlines-124888'
// const data = await flixhq.fetchMediaInfo('tv-watch-the-boys-33895');
// const data = await flixhq.fetchMediaInfo('movie-watch-bad-boys-ride-or-die-109831');
// const data = await flixhq.fetchMediaServers('movie-109831');
// const data = await flixhq.fetchMediaServers('episode-1019968');
// const hianime = new HiAnime();
// const data = await hianime.fetchSources('solo-leveling-18718-episode-119497', HiAnimeServers.HD2, SubOrDub.DUB);

// console.log(JSON.stringify(data));
// console.log(data.data?.sources);

1. Threshold score for the providerId result 
2. map episodes using string similairty. If the id provider result is an exact match take for example the rookie whats the most viable solution?
3. Scrape vidsrc
4. what are the referer headers for streamwish