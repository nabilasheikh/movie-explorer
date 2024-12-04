import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (key: string, value: any) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.error('Error storing data', e);
  }
};

export const getData = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Error retrieving data', e);
    return null;
  }
};

export const clearData = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.error('Error clearing data', e);
  }
};

export const cacheMovies = async (movies: any[], isSearch: boolean = false) => {
  const key = isSearch ? 'cached_search_movies' : 'cached_popular_movies';
  await storeData(key, movies);
};

export const getCachedMovies = async (isSearch: boolean = false) => {
  const key = isSearch ? 'cached_search_movies' : 'cached_popular_movies';
  return await getData(key);
};
