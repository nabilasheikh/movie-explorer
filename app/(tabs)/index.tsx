import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { 
  View, 
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet, 
  TextInput,
  RefreshControl,
  Dimensions
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovies, searchMoviesThunk, setSearchQuery } from '../../store/movieSlice';
import { addToFavorites, removeFromFavorites } from '../../store/favoritesSlice';
import { RootState, AppDispatch } from '../../store';
import MovieCard from '../../components/MovieCard';
import { debounce } from 'lodash';
import { useRouter } from 'expo-router';
import { FlashList } from "@shopify/flash-list";
import { Link } from 'expo-router';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function MoviesScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { 
    movies, 
    searchResults, 
    loading,
    currentPage,
    totalPages,
    searchPage,
    searchTotalPages,
    searchQuery: storeSearchQuery,
  } = useSelector((state: RootState) => ({
    movies: state.movies.movies,
    searchResults: state.movies.searchResults,
    loading: state.movies.loading,
    currentPage: state.movies.currentPage,
    totalPages: state.movies.totalPages,
    searchPage: state.movies.searchPage,
    searchTotalPages: state.movies.searchTotalPages,
    searchQuery: state.movies.searchQuery,
    storeSearchQuery: state.movies.searchQuery,
  }));
  
  const favorites = useSelector((state: RootState) => state.favorites.movies);

  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [reachedEnd, setReachedEnd] = useState(false);

  useEffect(() => {
    dispatch(fetchMovies({ page: 1 }));
  }, [dispatch]);

  const debouncedSearch = useMemo(
    () =>
      debounce(async (query: string) => {
        if (query.trim().length >= 2) {
          dispatch(setSearchQuery(query));
          dispatch(searchMoviesThunk({ query, page: 1 }));
        } else if (!query.trim()) {
          dispatch(setSearchQuery(''));
          dispatch(fetchMovies({ page: 1 }));
        }
      }, 500),
    [dispatch]
  );

  const handleSearchChange = useCallback((text: string) => {
    setLocalSearchQuery(text);
    debouncedSearch(text);
  }, [debouncedSearch]);

  const loadMoreMovies = useCallback(async () => {
    if (loadingMore || loading) return;

    const nextPage = localSearchQuery ? searchPage + 1 : currentPage + 1;
    const maxPages = localSearchQuery ? searchTotalPages : totalPages;

    if (nextPage <= maxPages) {
      setLoadingMore(true);
      try {
        if (localSearchQuery.trim().length >= 2) {
          await dispatch(searchMoviesThunk({ 
            query: localSearchQuery, 
            page: nextPage,
            isLoadMore: true 
          })).unwrap();
        } else {
          await dispatch(fetchMovies({ 
            page: nextPage,
            isLoadMore: true 
          })).unwrap();
        }
      } catch (error) {
        console.error('Error loading more movies:', error);
      } finally {
        setLoadingMore(false);
      }
    } else {
      setReachedEnd(true);
    }
  }, [dispatch, localSearchQuery, searchPage, searchTotalPages, currentPage, totalPages, loading, loadingMore]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      if (localSearchQuery.trim().length >= 2) {
        await dispatch(searchMoviesThunk({ query: localSearchQuery, page: 1 })).unwrap();
      } else {
        await dispatch(fetchMovies({ page: 1 })).unwrap();
      }
    } catch (error) {
      console.error('Error refreshing movies:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const displayedMovies = localSearchQuery.trim().length >= 2 ? searchResults : movies;
  const hasMorePages = localSearchQuery ? searchPage < searchTotalPages : currentPage < totalPages;

  const renderMovieCard = useCallback(({ item }) => {
    // Determine if the movie is a favorite, prioritizing the current list
    const isFavorite = favorites.some(fav => fav.id === item.id);

    return (
      <TouchableOpacity 
        onPress={() => router.push(`/movie/${item.id}`)}
        activeOpacity={0.8}
      >
        <MovieCard 
          movie={item} 
          onFavoritePress={(e) => {
            e.stopPropagation();
            console.log('Favorite toggle:', {
              movieId: item.id,
              isFavorite,
              favorites: favorites.map(f => f.id)
            });
            
            if (isFavorite) {
              dispatch(removeFromFavorites(item.id));
            } else {
              dispatch(addToFavorites(item));
            }
          }} 
        />
      </TouchableOpacity>
    );
  }, [favorites, dispatch, router]);

  const listData = useMemo(() => 
    storeSearchQuery ? searchResults : movies, 
    [storeSearchQuery, searchResults, movies]
  );

  const renderFooter = useCallback(() => {
    if (reachedEnd) {
      return (
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>No more movies to load</Text>
        </View>
      );
    }
    return null;
  }, [reachedEnd]);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Movie Explorer</Text>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search movies..."
          placeholderTextColor="#999"
          value={localSearchQuery}
          onChangeText={handleSearchChange}
          style={styles.searchInput}
          clearButtonMode="while-editing"
          returnKeyType="search"
        />
        <TouchableOpacity 
          style={styles.favoriteButton} 
          onPress={() => router.push('/favorites')}
        >
          <Text>Favorite</Text>
        </TouchableOpacity>
      </View>

      {loading && listData.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <FlashList
          data={listData}
          renderItem={renderMovieCard}
          keyExtractor={(item) => item.id.toString()}
          estimatedItemSize={220}
          contentContainerStyle={styles.listContainer}
          onEndReached={() => {
            if (!loading && hasMorePages) {
              loadMoreMovies();
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListFooterComponentStyle={{ marginBottom: 20 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 10,
    paddingTop: 30,
    paddingBottom: 10,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 10,
  },
  contentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    '@media (min-width: 768)': {
      paddingHorizontal: 20,
    }
  },
  cardContainer: {
    width: '100%',
    '@media (min-width: 600)': {
      width: '48%',
    },
    '@media (min-width: 1024)': {
      width: '32%',
    },
    marginBottom: 15,
  },
  listContainer: {
    paddingVertical: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    height: 50,
  },
  searchInput: {
    flex: 1,
    height: 45,
    fontSize: 16,
    backgroundColor: 'transparent',
    paddingLeft: 10,
    alignSelf: 'center',
  },
  favoriteButton: {
    marginLeft: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 50,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerContainer: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 16,
    color: '#666',
  },
});
