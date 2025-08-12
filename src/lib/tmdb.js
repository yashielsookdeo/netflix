import axios from 'axios';

const API_KEY = '20aed25855723af6f6a4dcdad0f17b86';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// TMDB API service
export const tmdbApi = {
  // Get popular movies
  getPopularMovies: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
      return response.data.results.map(movie => ({
        id: movie.id.toString(),
        title: movie.title,
        description: movie.overview,
        genre: 'popular',
        maturity: movie.adult ? '18' : '12',
        slug: movie.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        docId: movie.id.toString(),
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        tmdb_id: movie.id
      }));
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      return [];
    }
  },

  // Get top rated movies
  getTopRatedMovies: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}`);
      return response.data.results.map(movie => ({
        id: movie.id.toString(),
        title: movie.title,
        description: movie.overview,
        genre: 'top-rated',
        maturity: movie.adult ? '18' : '12',
        slug: movie.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        docId: movie.id.toString(),
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        tmdb_id: movie.id
      }));
    } catch (error) {
      console.error('Error fetching top rated movies:', error);
      return [];
    }
  },

  // Get action movies
  getActionMovies: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=28`);
      return response.data.results.map(movie => ({
        id: movie.id.toString(),
        title: movie.title,
        description: movie.overview,
        genre: 'action',
        maturity: movie.adult ? '18' : '12',
        slug: movie.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        docId: movie.id.toString(),
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        tmdb_id: movie.id
      }));
    } catch (error) {
      console.error('Error fetching action movies:', error);
      return [];
    }
  },

  // Get comedy movies
  getComedyMovies: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=35`);
      return response.data.results.map(movie => ({
        id: movie.id.toString(),
        title: movie.title,
        description: movie.overview,
        genre: 'comedy',
        maturity: movie.adult ? '18' : '12',
        slug: movie.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        docId: movie.id.toString(),
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        tmdb_id: movie.id
      }));
    } catch (error) {
      console.error('Error fetching comedy movies:', error);
      return [];
    }
  },

  // Get horror movies
  getHorrorMovies: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=27`);
      return response.data.results.map(movie => ({
        id: movie.id.toString(),
        title: movie.title,
        description: movie.overview,
        genre: 'horror',
        maturity: '18',
        slug: movie.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        docId: movie.id.toString(),
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        tmdb_id: movie.id
      }));
    } catch (error) {
      console.error('Error fetching horror movies:', error);
      return [];
    }
  },

  // Get popular TV shows
  getPopularTVShows: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/tv/popular?api_key=${API_KEY}`);
      return response.data.results.map(show => ({
        id: show.id.toString(),
        title: show.name,
        description: show.overview,
        genre: 'popular',
        maturity: '12',
        slug: show.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        docId: show.id.toString(),
        poster_path: show.poster_path,
        backdrop_path: show.backdrop_path,
        first_air_date: show.first_air_date,
        vote_average: show.vote_average,
        tmdb_id: show.id
      }));
    } catch (error) {
      console.error('Error fetching popular TV shows:', error);
      return [];
    }
  },

  // Get top rated TV shows
  getTopRatedTVShows: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/tv/top_rated?api_key=${API_KEY}`);
      return response.data.results.map(show => ({
        id: show.id.toString(),
        title: show.name,
        description: show.overview,
        genre: 'top-rated',
        maturity: '12',
        slug: show.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        docId: show.id.toString(),
        poster_path: show.poster_path,
        backdrop_path: show.backdrop_path,
        first_air_date: show.first_air_date,
        vote_average: show.vote_average,
        tmdb_id: show.id
      }));
    } catch (error) {
      console.error('Error fetching top rated TV shows:', error);
      return [];
    }
  },

  // Get drama TV shows
  getDramaTVShows: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=18`);
      return response.data.results.map(show => ({
        id: show.id.toString(),
        title: show.name,
        description: show.overview,
        genre: 'drama',
        maturity: '12',
        slug: show.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        docId: show.id.toString(),
        poster_path: show.poster_path,
        backdrop_path: show.backdrop_path,
        first_air_date: show.first_air_date,
        vote_average: show.vote_average,
        tmdb_id: show.id
      }));
    } catch (error) {
      console.error('Error fetching drama TV shows:', error);
      return [];
    }
  },

  // Get comedy TV shows
  getComedyTVShows: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=35`);
      return response.data.results.map(show => ({
        id: show.id.toString(),
        title: show.name,
        description: show.overview,
        genre: 'comedy',
        maturity: '12',
        slug: show.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        docId: show.id.toString(),
        poster_path: show.poster_path,
        backdrop_path: show.backdrop_path,
        first_air_date: show.first_air_date,
        vote_average: show.vote_average,
        tmdb_id: show.id
      }));
    } catch (error) {
      console.error('Error fetching comedy TV shows:', error);
      return [];
    }
  },

  // Get documentary TV shows
  getDocumentaryTVShows: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=99`);
      return response.data.results.map(show => ({
        id: show.id.toString(),
        title: show.name,
        description: show.overview,
        genre: 'documentaries',
        maturity: '12',
        slug: show.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        docId: show.id.toString(),
        poster_path: show.poster_path,
        backdrop_path: show.backdrop_path,
        first_air_date: show.first_air_date,
        vote_average: show.vote_average,
        tmdb_id: show.id
      }));
    } catch (error) {
      console.error('Error fetching documentary TV shows:', error);
      return [];
    }
  },

  // Get all movies by category
  getAllMovies: async () => {
    const [popular, topRated, action, comedy, horror] = await Promise.all([
      tmdbApi.getPopularMovies(),
      tmdbApi.getTopRatedMovies(),
      tmdbApi.getActionMovies(),
      tmdbApi.getComedyMovies(),
      tmdbApi.getHorrorMovies()
    ]);

    return [...popular, ...topRated, ...action, ...comedy, ...horror];
  },

  // Get all TV shows by category
  getAllTVShows: async () => {
    const [popular, topRated, drama, comedy, documentaries] = await Promise.all([
      tmdbApi.getPopularTVShows(),
      tmdbApi.getTopRatedTVShows(),
      tmdbApi.getDramaTVShows(),
      tmdbApi.getComedyTVShows(),
      tmdbApi.getDocumentaryTVShows()
    ]);

    return [...popular, ...topRated, ...drama, ...comedy, ...documentaries];
  },

  // Search movies and TV shows
  searchMulti: async (query) => {
    try {
      const response = await axios.get(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
      return response.data.results.map(item => {
        const isMovie = item.media_type === 'movie';
        return {
          id: item.id.toString(),
          title: isMovie ? item.title : item.name,
          description: item.overview,
          genre: 'search-result',
          maturity: item.adult ? '18' : '12',
          slug: (isMovie ? item.title : item.name).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          docId: item.id.toString(),
          poster_path: item.poster_path,
          backdrop_path: item.backdrop_path,
          release_date: item.release_date || item.first_air_date,
          vote_average: item.vote_average,
          tmdb_id: item.id,
          media_type: item.media_type,
          first_air_date: item.first_air_date
        };
      });
    } catch (error) {
      console.error('Error searching TMDB:', error);
      return [];
    }
  },

  // Search movies only
  searchMovies: async (query) => {
    try {
      const response = await axios.get(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
      return response.data.results.map(movie => ({
        id: movie.id.toString(),
        title: movie.title,
        description: movie.overview,
        genre: 'search-result',
        maturity: movie.adult ? '18' : '12',
        slug: movie.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        docId: movie.id.toString(),
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        tmdb_id: movie.id
      }));
    } catch (error) {
      console.error('Error searching movies:', error);
      return [];
    }
  },

  // Search TV shows only
  searchTVShows: async (query) => {
    try {
      const response = await axios.get(`${BASE_URL}/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
      return response.data.results.map(show => ({
        id: show.id.toString(),
        title: show.name,
        description: show.overview,
        genre: 'search-result',
        maturity: '12',
        slug: show.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        docId: show.id.toString(),
        poster_path: show.poster_path,
        backdrop_path: show.backdrop_path,
        first_air_date: show.first_air_date,
        vote_average: show.vote_average,
        tmdb_id: show.id
      }));
    } catch (error) {
      console.error('Error searching TV shows:', error);
      return [];
    }
  },

  // Helper function to get full image URL
  getImageUrl: (path) => {
    return path ? `${IMAGE_BASE_URL}${path}` : null;
  }
};
