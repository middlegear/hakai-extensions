import { searchShows, searchTmdbMovie } from './tmdb';

class TheMovieDb {
  private apiKey: string = 'b29bfe548cc2a3e4225effbd54ef0fda';
  /**
   * Searches for tv shows based on the provided query.
   *
   * @param {string} query - The search query string (required).
   * @param {number} [page=1] - Page number for pagination (optional, defaults to 1).
   *
   * @returns Array of related tv shows
   */
  async searchTvShows(query: string, page: number = 1) {
    return searchShows(query, page, this.apiKey);
  }
  /**
   * Searches for Movies based on the provided query.
   *
   * @param {string} query - The search query string (required).
   * @param {number} [page=1] - Page number for pagination (optional, defaults to 1).
   *
   * @returns Array of related movies
   */
  async searchMovies(query: string, page: number = 1) {
    return searchTmdbMovie(query, page, this.apiKey);
  }
}
export { TheMovieDb };
