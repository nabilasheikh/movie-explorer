import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getMovies, searchMovies, getMovieDetails } from '../config/api';

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average?: number;
  release_date?: string;
  overview?: string;
  genre_ids?: number[];
}

interface MovieState {
  movies: Movie[];
  searchResults: Movie[];
  selectedMovie: Movie | null;
  favorites: number[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  searchQuery: string;
  searchPage: number;
  searchTotalPages: number;
}

const initialState: MovieState = {
  movies: [],
  searchResults: [],
  selectedMovie: null,
  favorites: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  searchQuery: '',
  searchPage: 1,
  searchTotalPages: 1,
};

export const fetchMovies = createAsyncThunk(
  'movies/fetchMovies',
  async ({ page, isLoadMore = false }: { page: number; isLoadMore?: boolean }) => {
    const response = await getMovies(page);
    return { ...response, isLoadMore };
  }
);

export const searchMoviesThunk = createAsyncThunk(
  'movies/searchMovies',
  async ({ query, page, isLoadMore = false }: { query: string; page: number; isLoadMore?: boolean }) => {
    const response = await searchMovies(query, page);
    return { ...response, isLoadMore };
  }
);

export const fetchMovieDetails = createAsyncThunk(
  'movies/fetchMovieDetails',
  async (movieId: number) => {
    const response = await getMovieDetails(movieId);
    return response;
  }
);

const movieSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<number>) => {
      const movieId = action.payload;
      const index = state.favorites.indexOf(movieId);
      if (index === -1) {
        state.favorites.push(movieId);
      } else {
        state.favorites.splice(index, 1);
      }
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      if (!action.payload) {
        state.searchResults = [];
        state.searchPage = 1;
      }
    },
    addToFavorites: (state, action: PayloadAction<Movie>) => {
      const movieId = action.payload.id;
      if (!state.favorites.includes(movieId)) {
        state.favorites.push(movieId);
      }
    },
    removeFromFavorites: (state, action: PayloadAction<number>) => {
      const movieId = action.payload;
      const index = state.favorites.indexOf(movieId);
      if (index !== -1) {
        state.favorites.splice(index, 1);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.isLoadMore) {
          state.movies = [...state.movies, ...action.payload.results];
        } else {
          state.movies = action.payload.results;
        }
        state.currentPage = action.payload.page;
        state.totalPages = action.payload.total_pages;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch movies';
      })
      .addCase(searchMoviesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchMoviesThunk.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.isLoadMore) {
          state.searchResults = [...state.searchResults, ...action.payload.results];
        } else {
          state.searchResults = action.payload.results;
        }
        state.searchPage = action.payload.page;
        state.searchTotalPages = action.payload.total_pages;
      })
      .addCase(searchMoviesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to search movies';
      })
      .addCase(fetchMovieDetails.fulfilled, (state, action) => {
        state.selectedMovie = action.payload;
      });
  },
});

export const { toggleFavorite, setSearchQuery, addToFavorites, removeFromFavorites } = movieSlice.actions;
export default movieSlice.reducer;
