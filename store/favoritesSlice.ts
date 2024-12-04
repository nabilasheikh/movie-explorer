import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Movie } from '../types/movie';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FavoritesState {
  movies: Movie[];
}

const initialState: FavoritesState = {
  movies: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addToFavorites: (state, action: PayloadAction<Movie>) => {
      console.log('Adding to favorites:', action.payload.id);
      if (!state.movies.some(movie => movie.id === action.payload.id)) {
        state.movies.push(action.payload);
        // Persist to AsyncStorage
        AsyncStorage.setItem('favorites', JSON.stringify(state.movies));
      }
    },
    removeFromFavorites: (state, action: PayloadAction<number>) => {
      console.log('Removing from favorites:', action.payload);
      state.movies = state.movies.filter(movie => movie.id !== action.payload);
      // Persist to AsyncStorage
      AsyncStorage.setItem('favorites', JSON.stringify(state.movies));
    },
    // New action to load favorites from storage
    loadFavorites: (state, action: PayloadAction<Movie[]>) => {
      state.movies = action.payload;
    }
  },
});

export const { addToFavorites, removeFromFavorites, loadFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;

// Helper function to load favorites from AsyncStorage
export const initializeFavorites = () => async (dispatch: any) => {
  try {
    const favoritesJson = await AsyncStorage.getItem('favorites');
    if (favoritesJson) {
      const favorites = JSON.parse(favoritesJson);
      dispatch(loadFavorites(favorites));
    }
  } catch (error) {
    console.error('Error loading favorites:', error);
  }
};
