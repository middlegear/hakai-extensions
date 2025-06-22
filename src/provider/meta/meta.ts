import { Anilist } from './anilist/index.js';
import { Jikan } from './jikan/index.js';
import { TheMovieDatabase } from './tmdb/index.js';
import { TvMaze } from './tvmaze/index.js';

class Meta {
  static Anilist = Anilist;
  static Jikan = Jikan;
  static TheMovieDatabase = TheMovieDatabase;
  static TvMaze = TvMaze;
}

export { Meta };
