import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import type { PicsumImage } from '../types/gallery';

type Props = { image: PicsumImage; isFavorite: boolean; onPress: () => void; onToggleFavorite: () => void };

export function ImageCard({ image, isFavorite, onPress, onToggleFavorite }: Props) {
  return <Pressable onPress={onPress} style={styles.card}>
    <Image source={{ uri: `https://picsum.photos/id/${image.id}/500/340` }} style={styles.image} />
    <Pressable onPress={(event) => { event.stopPropagation(); onToggleFavorite(); }} style={[styles.favorite, isFavorite && styles.favoriteActive]} hitSlop={8}>
      <Text style={styles.heart}>{isFavorite ? '♥' : '♡'}</Text>
    </Pressable>
    <View style={styles.details}>
      <Text numberOfLines={1} style={styles.author}>{image.author}</Text>
      <Text style={styles.id}>PHOTO #{image.id}</Text>
    </View>
  </Pressable>;
}

const styles = StyleSheet.create({
  card: { marginBottom: 16, borderRadius: 18, overflow: 'hidden', backgroundColor: '#fff', elevation: 2, shadowColor: '#162045', shadowOpacity: 0.1, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } },
  image: { width: '100%', height: 190, backgroundColor: '#E5E9F3' },
  favorite: { position: 'absolute', right: 12, top: 12, width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.94)', alignItems: 'center', justifyContent: 'center' },
  favoriteActive: { backgroundColor: '#FFF0F2' },
  heart: { color: '#D52E52', fontSize: 26, lineHeight: 29 },
  details: { padding: 14 },
  author: { color: '#20273D', fontSize: 16, fontWeight: '800' },
  id: { color: '#77819A', fontSize: 11, fontWeight: '700', marginTop: 4, letterSpacing: 0.5 },
});
