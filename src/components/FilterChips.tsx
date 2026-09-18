import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { AuthorFilter } from '../types/gallery';

const filters: { label: string; value: AuthorFilter }[] = [{ label: 'All', value: 'ALL' }, { label: 'A - M', value: 'A-M' }, { label: 'N - Z', value: 'N-Z' }];

export function FilterChips({ value, onChange }: { value: AuthorFilter; onChange: (value: AuthorFilter) => void }) {
  return <View style={styles.row}>{filters.map((filter) => <Pressable key={filter.value} onPress={() => onChange(filter.value)} style={[styles.chip, value === filter.value && styles.active]}><Text style={[styles.text, value === filter.value && styles.activeText]}>{filter.label}</Text></Pressable>)}</View>;
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  chip: { paddingVertical: 9, paddingHorizontal: 15, borderRadius: 20, backgroundColor: '#E9EDFA' },
  active: { backgroundColor: '#234AD8' },
  text: { color: '#53607C', fontWeight: '700', fontSize: 13 },
  activeText: { color: '#fff' },
});
