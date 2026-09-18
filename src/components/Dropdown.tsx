import { Picker } from '@react-native-picker/picker';
import { StyleSheet, Text, View } from 'react-native';

type Props = { label: string; value: string; options: string[]; onChange: (value: string) => void; error?: string };

export function Dropdown({ label, value, options, onChange, error }: Props) {
  return <View style={styles.wrapper}><Text style={styles.label}>{label}</Text><View style={[styles.picker, error && styles.pickerError]}><Picker selectedValue={value} onValueChange={onChange} style={styles.control}><Picker.Item label="Select a city" value="" color="#8790A6" />{options.map((option) => <Picker.Item key={option} label={option} value={option} />)}</Picker></View>{error ? <Text style={styles.error}>{error}</Text> : null}</View>;
}

const styles = StyleSheet.create({ wrapper: { marginBottom: 16 }, label: { fontSize: 14, fontWeight: '700', color: '#20273D', marginBottom: 7 }, picker: { height: 50, borderWidth: 1, borderColor: '#D8DDEA', borderRadius: 12, justifyContent: 'center', overflow: 'hidden', backgroundColor: '#fff' }, pickerError: { borderColor: '#C73A4A' }, control: { height: 50, color: '#20273D' }, error: { color: '#C73A4A', marginTop: 5, fontSize: 12 }, });
