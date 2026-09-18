import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ImageCard } from '../../components/ImageCard';
import { useDebounce } from '../../hooks/useDebounce';
import { useGalleryStore } from '../../store/useGalleryStore';
import type { AppStackParamList, MainTabParamList } from '../../types/navigation';

type Props = CompositeScreenProps<BottomTabScreenProps<MainTabParamList, 'Favorites'>, NativeStackScreenProps<AppStackParamList>>;

export function FavoritesScreen({ navigation }: Props) {
  const favorites = useGalleryStore((state) => state.favorites);
  const toggleFavorite = useGalleryStore((state) => state.toggleFavorite);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query);
  const visibleFavorites = useMemo(() => favorites.filter((image) => image.author.toLowerCase().includes(debouncedQuery.trim().toLowerCase())), [favorites, debouncedQuery]);
  return <View style={styles.screen}><View style={styles.header}><Text style={styles.title}>Saved moments</Text><Text style={styles.subtitle}>{favorites.length} {favorites.length === 1 ? 'photo' : 'photos'} in your collection</Text><View style={styles.search}><Text style={styles.searchIcon}>⌕</Text><TextInput value={query} onChangeText={setQuery} placeholder="Search saved authors" placeholderTextColor="#8490A8" style={styles.searchInput} /></View></View><FlatList data={visibleFavorites} keyExtractor={(item) => item.id} contentContainerStyle={styles.list} renderItem={({ item }) => <ImageCard image={item} isFavorite onPress={() => navigation.navigate('ImageDetail', { image: item })} onToggleFavorite={() => void toggleFavorite(item)} />} ListEmptyComponent={<View style={styles.empty}><Text style={styles.emptyIcon}>♡</Text><Text style={styles.emptyTitle}>{favorites.length ? 'No matching saved photos' : 'Your favorites live here'}</Text><Text style={styles.emptyCopy}>{favorites.length ? 'Try a different author name.' : 'Tap the heart on a photo to save it for later.'}</Text></View>} /></View>;
}

const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: '#F7F8FC' }, header: { padding: 20, paddingTop: 25 }, title: { color: '#20273D', fontSize: 28, fontWeight: '900', letterSpacing: -0.8 }, subtitle: { color: '#68738B', marginTop: 5, fontSize: 14 }, search: { marginTop: 18, height: 48, flexDirection: 'row', alignItems: 'center', borderRadius: 13, backgroundColor: '#fff', borderWidth: 1, borderColor: '#D8DDEA', paddingHorizontal: 13 }, searchIcon: { color: '#66718B', fontSize: 25, marginRight: 7, marginTop: -4 }, searchInput: { flex: 1, color: '#20273D', fontSize: 16 }, list: { paddingHorizontal: 20, paddingBottom: 20 }, empty: { alignItems: 'center', paddingTop: 100, paddingHorizontal: 35 }, emptyIcon: { color: '#D52E52', fontSize: 50 }, emptyTitle: { color: '#20273D', fontSize: 19, fontWeight: '800', marginTop: 12 }, emptyCopy: { color: '#68738B', textAlign: 'center', lineHeight: 21, marginTop: 8 }, });
