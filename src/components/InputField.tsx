import type { TextInputProps } from 'react-native';
import { StyleSheet, Text, TextInput, View } from 'react-native';

type Props = TextInputProps & { label: string; error?: string };

export function InputField({ label, error, style, ...inputProps }: Props) {
  return <View style={styles.wrapper}>
    <Text style={styles.label}>{label}</Text>
    <TextInput placeholderTextColor="#8790A6" style={[styles.input, error && styles.inputError, style]} {...inputProps} />
    {error ? <Text style={styles.error}>{error}</Text> : null}
  </View>;
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '700', color: '#20273D', marginBottom: 7 },
  input: { minHeight: 50, borderWidth: 1, borderColor: '#D8DDEA', borderRadius: 12, paddingHorizontal: 14, color: '#20273D', backgroundColor: '#fff', fontSize: 16 },
  inputError: { borderColor: '#C73A4A' },
  error: { color: '#C73A4A', marginTop: 5, fontSize: 12 },
});
