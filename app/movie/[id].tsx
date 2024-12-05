import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  Image, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Dimensions,
  Share,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { addToFavorites, removeFromFavorites } from '../../store/favoritesSlice';
import { RootState, AppDispatch } from '../../store';
import { IconSymbol } from '@/components/ui/IconSymbol';
import Constants from 'expo-constants';
import RatingComponent from '../../components/RatingComponent';

const TMDB_IMAGE_BASE_URL = Constants.expoConfig?.extra?.TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p/w500';
const { width } = Dimensions.get('window');
const SIMILAR_MOVIE_WIDTH = width * 0.4;

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genres: Array<{ id: number; name: string }>;
  genre_ids: number[];
}

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [key, setKey] = useState(0);
  const favorites = useSelector((state: RootState) => state.favorites?.movies ?? []);
  const isFavorite = favorites.some(fav => fav.id === Number(id));

  const fetchMovieData = useCallback(async () => {
    try {
      setLoading(true);
      const [movieResponse, similarResponse] = await Promise.all([
        fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=d26b33b824f383978b65b0e0faf868f1`),
        fetch(`https://api.themoviedb.org/3/movie/${id}/similar?api_key=d26b33b824f383978b65b0e0faf868f1`)
      ]);

      const movieData = await movieResponse.json();
      const similarData = await similarResponse.json();

      setMovie(movieData);
      setSimilarMovies(similarData.results);
    } catch (error) {
      console.error('Error fetching movie data:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchMovieData();
    setKey(prev => prev + 1);
  }, [fetchMovieData, id]);

  const handleBack = () => {
    router.back();
  };

  const handleFavoritePress = () => {
    if (movie) {
      if (isFavorite) {
        dispatch(removeFromFavorites(movie.id));
      } else {
        dispatch(addToFavorites(movie));
      }
    }
  };

  const handleSimilarMoviePress = (movieId: number) => {
    router.push(`/movie/${movieId}`);
  };

  if (loading || !movie) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const posterUrl = movie.poster_path
    ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
    : 'https://via.placeholder.com/300x450?text=No+Poster';

  const renderSimilarMovie = ({ item }: { item: Movie }) => {
    const similarPosterUrl = item.poster_path
      ? `${TMDB_IMAGE_BASE_URL}${item.poster_path}`
      : 'https://via.placeholder.com/300x450?text=No+Poster';

    return (
      <TouchableOpacity 
        style={styles.similarMovieCard}
        onPress={() => handleSimilarMoviePress(item.id)}
      >
        <Image
          source={{ uri: similarPosterUrl }}
          style={styles.similarMovieImage}
          resizeMode="cover"
        />
        <Text style={styles.similarMovieTitle} numberOfLines={2}>
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : movie ? (
          <>
            <View style={styles.headerContainer}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleBack}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <IconSymbol name="chevron.left" size={24} color="#000" />
              </TouchableOpacity>
              <View style={styles.headerActions}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={handleFavoritePress}
                >
                  <IconSymbol 
                    name={isFavorite ? "heart.fill" : "heart"}
                    size={24}
                    color={isFavorite ? "#ff3b30" : "#000"}
                  />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.actionButton, { marginLeft: 16 }]}
                  onPress={() => {
                    Share.share({
                      title: movie.title,
                      message: `Check out this movie: ${movie.title}`,
                      url: `https://www.themoviedb.org/movie/${movie.id}`
                    });
                  }}
                >
                  <IconSymbol 
                    name="square.and.arrow.up"
                    size={24}
                    color="#000"
                  />
                </TouchableOpacity>
              </View>
            </View>
            <Image
              source={{ uri: posterUrl }}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={styles.content}>
              <Text style={styles.title}>{movie.title}</Text>
              <View style={styles.infoContainer}>
                {movie.release_date && (
                  <Text style={styles.infoText}>
                    Released: {new Date(movie.release_date).toLocaleDateString()}
                  </Text>
                )}
                {movie.genres && movie.genres.length > 0 && (
                  <View style={styles.genresContainer}>
                    <Text style={styles.infoText}>Genres: </Text>
                    <View style={styles.genresList}>
                      {movie.genres.map((genre, index) => (
                        <View key={genre.id} style={styles.genreTag}>
                          <Text style={styles.genreText}>
                            {genre.name}
                            {index < movie.genres.length - 1 ? ', ' : ''}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </View>
              <Text style={styles.overview}>{movie.overview}</Text>
              <RatingComponent 
                key={key} 
                movieId={Number(id)} 
              />
              <View style={styles.similarMoviesSection}>
                <Text style={styles.sectionTitle}>Similar Movies</Text>
                <FlatList
                  data={similarMovies}
                  renderItem={renderSimilarMovie}
                  keyExtractor={(item) => item.id.toString()}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.similarMoviesList}
                />
              </View>
            </View>
          </>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  image: {
    width: width,
    height: width * 1.5, // 3:2 aspect ratio
    resizeMode: 'cover',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoContainer: {
    marginVertical: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: 5,
  },
  genresList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
  genreTag: {
    marginRight: 4,
  },
  genreText: {
    fontSize: 16,
    color: '#666',
  },
  overview: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
    color: '#333',
  },
  similarMoviesSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  similarMoviesList: {
    paddingRight: 16,
  },
  similarMovieCard: {
    marginRight: 10,
    width: SIMILAR_MOVIE_WIDTH,
  },
  similarMovieImage: {
    width: SIMILAR_MOVIE_WIDTH,
    height: SIMILAR_MOVIE_WIDTH * 1.5, // 2:3 aspect ratio
    borderRadius: 8,
  },
  similarMovieTitle: {
    marginTop: 5,
    fontSize: 14,
    textAlign: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
