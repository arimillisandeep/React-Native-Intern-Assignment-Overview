import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthNavigator } from './AuthNavigator';
import { MainTabNavigator } from './MainTabNavigator';
import { ImageDetailScreen } from '../screens/Main/ImageDetailScreen';
import { useAuthStore } from '../store/useAuthStore';
import { useGalleryStore } from '../store/useGalleryStore';
import type { AppStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<AppStackParamList>();

export function RootNavigator() {
  const { user, hydrated, hydrate } = useAuthStore();
  const hydrateGallery = useGalleryStore((state) => state.hydrate);
  useEffect(() => { void Promise.all([hydrate(), hydrateGallery()]); }, [hydrate, hydrateGallery]);
  if (!hydrated) return <View style={styles.loader}><ActivityIndicator size="large" color="#234AD8" /></View>;
  return <NavigationContainer>{user ? <Stack.Navigator><Stack.Screen name="Tabs" component={MainTabNavigator} options={{ headerShown: false }} /><Stack.Screen name="ImageDetail" component={ImageDetailScreen} options={{ title: 'Photo details', headerBackTitle: 'Back' }} /></Stack.Navigator> : <AuthNavigator />}</NavigationContainer>;
}

const styles = StyleSheet.create({ loader: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F7F8FC' } });
