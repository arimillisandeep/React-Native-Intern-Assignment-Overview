import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FilterChips } from '../../components/FilterChips';
import { ImageCard } from '../../components/ImageCard';
import { useDebounce } from '../../hooks/useDebounce';
import { useFetchImages } from '../../hooks/useFetchImages';
import { useGalleryStore } from '../../store/useGalleryStore';
import type { AuthorFilter } from '../../types/gallery';
import type { AppStackParamList, MainTabParamList } from '../../types/navigation';

type Props = CompositeScreenProps<BottomTabScreenProps<MainTabParamList, 'Home'>, NativeStackScreenProps<AppStackParamList>>;

export function HomeScreen({ navigation }: Props) {
  const { images, loading, refreshing, error, loadMore, refresh, retry } = useFetchImages();
  const favorites = useGalleryStore((state) => state.favorites);
  const toggleFavorite = useGalleryStore((state) => state.toggleFavorite);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<AuthorFilter>('ALL');
  const debouncedQuery = useDebounce(query);
  const filteredImages = useMemo(() => images.filter((image) => {
    const author = image.author.trim();
    const firstCharacter = author.charAt(0).toUpperCase();
    const matchesQuery = author.toLowerCase().includes(debouncedQuery.trim().toLowerCase());
    const matchesFilter = filter === 'ALL' || (filter === 'A-M' ? firstCharacter >= 'A' && firstCharacter <= 'M' : firstCharacter >= 'N' && firstCharacter <= 'Z');
    return matchesQuery && matchesFilter;
  }), [images, debouncedQuery, filter]);
  return <View style={styles.screen}><View style={styles.header}><Text style={styles.logo}>foto<Text style={styles.logoAccent}>owl</Text></Text><Text style={styles.heading}>Explore photos</Text><Text style={styles.subheading}>A changing collection from photographers worldwide.</Text></View><View style={styles.controls}><View style={styles.search}><Text style={styles.searchIcon}>⌕</Text><TextInput value={query} onChangeText={setQuery} placeholder="Search authors" placeholderTextColor="#8490A8" style={styles.searchInput} /></View><FilterChips value={filter} onChange={setFilter} /></View>{loading ? <View style={styles.center}><ActivityIndicator size="large" color="#234AD8" /><Text style={styles.loadingCopy}>Curating your feed...</Text></View> : error && images.length === 0 ? <View style={styles.center}><Text style={styles.error}>{error}</Text><Pressable onPress={retry} style={styles.retry}><Text style={styles.retryText}>Try again</Text></Pressable></View> : <FlatList data={filteredImages} keyExtractor={(item) => item.id} contentContainerStyle={styles.list} renderItem={({ item }) => <ImageCard image={item} isFavorite={favorites.some((favorite) => favorite.id === item.id)} onPress={() => navigation.navigate('ImageDetail', { image: item })} onToggleFavorite={() => void toggleFavorite(item)} />} onEndReached={loadMore} onEndReachedThreshold={0.6} refreshing={refreshing} onRefresh={refresh} ListEmptyComponent={<Text style={styles.empty}>No authors match your search.</Text>} ListFooterComponent={error ? <Pressable onPress={retry} style={styles.footerRetry}><Text style={styles.retryText}>{error} Tap to retry.</Text></Pressable> : <View style={styles.footer}><ActivityIndicator color="#234AD8" /></View>} />}</View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F7F8FC' }, header: { paddingHorizontal: 20, paddingTop: 20 }, logo: { color: '#20273D', fontSize: 26, fontWeight: '900' }, logoAccent: { color: '#234AD8' }, heading: { color: '#20273D', fontSize: 28, fontWeight: '900', letterSpacing: -0.8, marginTop: 20 }, subheading: { color: '#68738B', fontSize: 14, marginTop: 5 }, controls: { paddingHorizontal: 20, paddingTop: 18 }, search: { height: 48, flexDirection: 'row', alignItems: 'center', borderRadius: 13, backgroundColor: '#fff', borderWidth: 1, borderColor: '#D8DDEA', paddingHorizontal: 13, marginBottom: 12 }, searchIcon: { color: '#66718B', fontSize: 25, marginRight: 7, marginTop: -4 }, searchInput: { flex: 1, color: '#20273D', fontSize: 16 }, list: { paddingHorizontal: 20, paddingTop: 2, paddingBottom: 20 }, center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 }, loadingCopy: { color: '#68738B', marginTop: 12 }, error: { color: '#C73A4A', textAlign: 'center', fontSize: 15 }, retry: { marginTop: 16, padding: 12 }, retryText: { color: '#234AD8', fontWeight: '800' }, empty: { color: '#68738B', textAlign: 'center', padding: 35 }, footer: { height: 52, justifyContent: 'center' }, footerRetry: { alignItems: 'center', padding: 15 },
});
