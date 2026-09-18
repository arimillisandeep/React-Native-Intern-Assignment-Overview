import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
  registeredUser: '@fotoowl/registered-user',
  session: '@fotoowl/session',
  favorites: '@fotoowl/favorites',
} as const;

export async function readStorage<T>(key: string): Promise<T | null> {
  const value = await AsyncStorage.getItem(key);
  return value ? (JSON.parse(value) as T) : null;
}

export function writeStorage<T>(key: string, value: T) {
  return AsyncStorage.setItem(key, JSON.stringify(value));
}
