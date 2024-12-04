import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Animated } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface RatingProps {
  movieId: number;
  onRatingChange?: (rating: number) => void;
}

export default function RatingComponent({ movieId, onRatingChange }: RatingProps) {
  const [rating, setRating] = useState(0);
  const [animated] = useState(new Animated.Value(1));

  useEffect(() => {
    loadRating();
  }, [movieId]);

  const loadRating = async () => {
    try {
      const storedRating = await AsyncStorage.getItem(`movie_rating_${movieId}`);
      if (storedRating) {
        setRating(Number(storedRating));
      }
    } catch (error) {
      console.error('Error loading rating:', error);
    }
  };

  const handleRating = async (value: number) => {
    try {
      const newRating = rating === value ? 0 : value;
      setRating(newRating);
      await AsyncStorage.setItem(`movie_rating_${movieId}`, String(newRating));
      onRatingChange?.(newRating);

      // Animate the stars
      Animated.sequence([
        Animated.timing(animated, {
          toValue: 1.2,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(animated, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    } catch (error) {
      console.error('Error saving rating:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rate this movie</Text>
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => handleRating(star)}
            style={styles.starButton}
          >
            <Animated.View style={{ transform: [{ scale: animated }] }}>
              <IconSymbol
                name="star.fill"
                size={30}
                color={star <= rating ? '#FFD700' : '#D3D3D3'}
              />
            </Animated.View>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.ratingText}>
        {rating > 0 ? `Your rating: ${rating}/5` : 'Tap to rate'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#000',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  starButton: {
    padding: 4,
  },
  ratingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
});