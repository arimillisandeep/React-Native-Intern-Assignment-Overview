import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

type Props = { title: string; onPress: () => void; loading?: boolean; variant?: 'primary' | 'outline' | 'danger'; icon?: ReactNode };

export function AppButton({ title, onPress, loading, variant = 'primary', icon }: Props) {
  return <Pressable disabled={loading} onPress={onPress} style={({ pressed }) => [styles.button, styles[variant], pressed && styles.pressed, loading && styles.disabled]}>
    {loading ? <ActivityIndicator color={variant === 'outline' ? '#234AD8' : '#fff'} /> : <>{icon}<Text style={[styles.label, variant === 'outline' && styles.outlineLabel]}>{title}</Text></>}
  </Pressable>;
}

const styles = StyleSheet.create({
  button: { minHeight: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8, paddingHorizontal: 18 },
  primary: { backgroundColor: '#234AD8' },
  outline: { borderWidth: 1, borderColor: '#234AD8', backgroundColor: '#fff' },
  danger: { backgroundColor: '#C73A4A' },
  label: { color: '#fff', fontSize: 16, fontWeight: '700' },
  outlineLabel: { color: '#234AD8' },
  pressed: { opacity: 0.82 },
  disabled: { opacity: 0.65 },
});
