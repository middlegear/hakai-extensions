import { searchShows } from './tmdb';

class TheMovieDb {
  /**
   * Searches for tv shows based on the provided query.
   *
   * @param {string} query - The search query string (required).
   * @param {number} [page=1] - Page number for pagination (optional, defaults to 1).
   *
   * @returns Array of related tv shows
   */
  async searchTvShows(query: string, page: number = 1) {
    return searchShows(query, page);
  }
  /**
   * Searches for Movies based on the provided query.
   *
   * @param {string} query - The search query string (required).
   * @param {number} [page=1] - Page number for pagination (optional, defaults to 1).
   *
   * @returns Array of related tv shows
   */
  async searchMovies(query: string, page: number) {}
}
export { TheMovieDb };
