import axios from 'axios';

const tmdbUrl = 'https://api.themoviedb.org/3';

export async function searchShows(query: string, page: number) {
  if (!query) {
    return {
      data: [],
      error: 'Missing required parameter. Query',
    };
  }
  try {
    const response = await axios.get(
      `${tmdbUrl}/search/tv?include_adult=false&language=en-US&page=${page}&api_key=b29bfe548cc2a3e4225effbd54ef0fda&query=${query}`,
    );
    if (!response.data)
      return {
        data: [],
        error: response.statusText,
      };
    const pagination = {
      currentPage: response.data.page,
      hasNextPage: response.data.total_pages > 1 ? true : false,
      totalPages: response.data.total_pages,
      totalResults: response.data.total_results,
    };
    const data = response.data.results.map((item: any) => ({
      tmdbId: item.id,
      name: item.name,
      originalName: item.original_name,
      posterImage: `https://image.tmdb.org/t/p/original${item.poster_path}`,
      coverImage: `https://image.tmdb.org/t/p/original${item.backdrop_path}`,
      country: item.origin_country,
      language: item.original_language,
      startDate: item.first_air_date,
      summary: item.overview,
      genreIds: item.genre_ids,
      rating: item.vote_average,
    }));
    return {
      currentPage: pagination.currentPage,
      hasNextPage: pagination.hasNextPage,
      totalPages: pagination.totalPages,
      totalResults: pagination.totalResults,
      data: data,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
