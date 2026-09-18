import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { FavoritesScreen } from '../screens/Main/FavoritesScreen';
import { HomeScreen } from '../screens/Main/HomeScreen';
import { ProfileScreen } from '../screens/Main/ProfileScreen';
import type { MainTabParamList } from '../types/navigation';

const Tab = createBottomTabNavigator<MainTabParamList>();
const icons: Record<keyof MainTabParamList, string> = { Home: '▦', Favorites: '♥', Profile: '◉' };

export function MainTabNavigator() {
  return <Tab.Navigator screenOptions={({ route }) => ({ headerShown: false, tabBarActiveTintColor: '#234AD8', tabBarInactiveTintColor: '#8490A8', tabBarStyle: { height: 64, paddingTop: 7 }, tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>{icons[route.name]}</Text> })}>
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Favorites" component={FavoritesScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>;
}
