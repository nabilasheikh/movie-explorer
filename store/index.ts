import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import movieReducer from './movieSlice';
import favoritesReducer, { initializeFavorites } from './favoritesSlice';

export const store = configureStore({
  reducer: {
    movies: movieReducer,
    favorites: favoritesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['movies/fetchMovies/fulfilled', 'movies/searchMovies/fulfilled'],
      },
    }),
});

// Initialize favorites after store creation
store.dispatch(initializeFavorites());

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
