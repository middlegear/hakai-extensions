import { getExternal, getInfo, getInfoDetailed, searchImdb, searchShows, searchTvdb } from './tvmaze';

class TvMaze {
  /**
   * Searches for tv shows based on the provided query.
   *
   * @param {string} query - The search query string (required).
   *
   * @returns Array of related tv shows
   */

  async search(query: string) {
    return searchShows(query);
  }
  /**
   * Look up tv shows using an IMDB Id
   * @param {string} imdbId - The imdb show Id (required)
   *
   * @returns An object containing tvshow metadata
   */
  async searchbyImDbId(imdbId: string) {
    return searchImdb(imdbId);
  }

  /**
   * Look up shows on tvMaze using tvdbId
   *
   * @param  {number} tvdbId - The tvdb id of the show(required)
   * @returns An object containing tvshow metadata
   */

  async searchbyTvDbId(tvdbId: number) {
    return searchTvdb(tvdbId);
  }

  /**
   * Look up infomation about a show using tvmazeId
   *
   * @param {number} tvMazeId - The tvMazeId of the show
   *
   * @returns An object containing show metadata
   */
  async fetchShowInfo(tvMazeId: number) {
    return getInfo(tvMazeId);
  }

  /**
   * Look up detailed infomation about a show using tvmazeId
   *
   * @param {number} tvMazeId - The tvMazeId of the show
   *
   * @returns An object containing show metadata including cast and episodes
   */
  async fetchDetailedInfo(tvMazeId: number) {
    return getInfoDetailed(tvMazeId);
  }
  /**
   * Look up external tvshow id to other databases
   * @param {number} tvMazeId The tvMazeId of the show
   *
   * @returns object containing id to other databases
   */
  async fetchExternal(tvMazeId: number) {
    return getExternal(tvMazeId);
  }
}
export { TvMaze };
