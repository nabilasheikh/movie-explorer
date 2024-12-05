import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions 
} from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { IconSymbol } from './ui/IconSymbol';
import { addToFavorites, removeFromFavorites } from '../store/favoritesSlice';
import Constants from 'expo-constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_MARGIN = 10;
const CARD_WIDTH = SCREEN_WIDTH - (CARD_MARGIN * 2);

const TMDB_IMAGE_BASE_URL = Constants.expoConfig?.extra?.TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p/w500';

interface MovieCardProps {
  movie: {
    id: number;
    title: string;
    poster_path: string | null;
    vote_average?: number;
    release_date?: string;
    overview?: string;
    backdrop_path?: string | null;
    vote_count?: number;
    genre_ids?: number[];
  };
  genres?: { [key: number]: string };
  onFavoritePress?: (e: React.TouchEvent) => void;
}

export default function MovieCard({ 
  movie,
  genres,
  onFavoritePress 
}: MovieCardProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.favorites.movies);
  const isFavorite = favorites.some(fav => fav.id === movie.id);

  const handlePress = () => {
    router.push(`/movie/${movie.id}`);
  };

  const renderRating = () => {
    if (typeof movie.vote_average === 'number') {
      return (
        <View style={styles.ratingContainer}>
          <IconSymbol 
            name="star.fill"
            size={18}
            color="#FFD700"
          />
          <Text style={styles.rating}> {movie.vote_average.toFixed(1)}</Text>
        </View>
      );
    }
    return null;
  };

  const posterUri = movie.poster_path 
    ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` 
    : 'https://via.placeholder.com/300x450.png?text=No+Image';

  const handleFavoriteToggle = (e: React.TouchEvent) => {
    e.stopPropagation();
    console.log('MovieCard Favorite toggle:', {
      movieId: movie.id,
      isFavorite,
      favorites: favorites.map(f => f.id)
    });
    
    if (onFavoritePress) {
      onFavoritePress(e);
    } else {
      if (isFavorite) {
        dispatch(removeFromFavorites(movie.id));
      } else {
        dispatch(addToFavorites(movie));
      }
    }
  };

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={styles.cardContent}>
        <Image 
          source={{ uri: posterUri }}
          style={styles.poster}
          resizeMode="cover"
        />
        <View style={styles.infoContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={2}>
              {movie.title}
            </Text>
            <View style={styles.favoriteContainer}>
              <TouchableOpacity 
                style={styles.favoriteButton} 
                onPress={handleFavoriteToggle}
                hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
              >
                <IconSymbol 
                  name={isFavorite ? "heart.fill" : "heart"} 
                  size={24} 
                  color={isFavorite ? "#ff3b30" : "#666"}
                />
              </TouchableOpacity>
            </View>
          </View>
          {movie.genre_ids && genres && movie.genre_ids.length > 0 && (
            <Text style={styles.genres} numberOfLines={1}>
              {movie.genre_ids
                .slice(0, 2)
                .map(id => genres[id])
                .filter(Boolean)
                .join(' • ')}
            </Text>
          )}
          <View style={styles.detailsContainer}>
            {renderRating()}
            <Text style={styles.releaseDate}>
              {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: 'white',
    borderRadius: 10,
    marginHorizontal: CARD_MARGIN,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
  },
  poster: {
    width: 120,
    height: 180,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  infoContainer: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  favoriteContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
  releaseDate: {
    fontSize: 18,
    color: '#666',
  },
  favoriteButton: {
    padding: 5,
    backgroundColor: 'transparent', 
  },
  genres: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontStyle: 'italic',
  },
});
