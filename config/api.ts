import axios from 'axios';
import Constants from 'expo-constants';

const TMDB_API_KEY = Constants.expoConfig?.extra?.TMDB_API_KEY;
const TMDB_BASE_URL = Constants.expoConfig?.extra?.TMDB_BASE_URL || 'https://api.themoviedb.org/3';

export const api = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
});

export const getMovies = async (page = 1) => {
  const response = await api.get('/movie/popular', {
    params: { page },
  });
  return response.data;
};

export const searchMovies = async (query: string, page = 1) => {
  const response = await api.get('/search/movie', {
    params: { query, page },
  });
  return response.data;
};

export const getMovieDetails = async (movieId: number) => {
  const response = await api.get(`/movie/${movieId}`);
  return response.data;
};

export const getSimilarMovies = async (movieId: number) => {
  const response = await api.get(`/movie/${movieId}/similar`);
  return response.data;
};
