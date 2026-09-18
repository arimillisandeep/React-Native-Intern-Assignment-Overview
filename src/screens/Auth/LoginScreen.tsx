import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppButton } from '../../components/AppButton';
import { InputField } from '../../components/InputField';
import { useAuthStore } from '../../store/useAuthStore';
import type { AuthStackParamList } from '../../types/navigation';
import { validateEmail } from '../../utils/validation';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const submit = async () => {
    if (!validateEmail(email)) return setError('Enter a valid email address.');
    if (!password) return setError('Password is required.');
    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);
    setError(result ?? '');
  };
  return <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}><View style={styles.top}><Text style={styles.logo}>foto<Text style={styles.logoAccent}>owl</Text></Text><Text style={styles.eyebrow}>WELCOME BACK</Text><Text style={styles.title}>Your gallery awaits.</Text><Text style={styles.copy}>Sign in to revisit your favorite visual discoveries.</Text></View><View style={styles.panel}><InputField label="Email address" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholder="you@example.com" /><InputField label="Password" value={password} onChangeText={setPassword} secureTextEntry placeholder="Your password" /><Text style={styles.error}>{error}</Text><AppButton title="Log in" onPress={() => void submit()} loading={submitting} /><Pressable onPress={() => navigation.navigate('Register')} style={styles.link}><Text style={styles.linkText}>New to FotoOwl? <Text style={styles.linkStrong}>Create an account</Text></Text></Pressable></View></KeyboardAvoidingView>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: 'flex-end', backgroundColor: '#E8EDFF' },
  top: { flex: 1, justifyContent: 'center', padding: 28 },
  logo: { fontSize: 30, fontWeight: '900', color: '#20273D', letterSpacing: -1 },
  logoAccent: { color: '#234AD8' },
  eyebrow: { color: '#234AD8', fontSize: 12, fontWeight: '800', letterSpacing: 1.3, marginTop: 40 },
  title: { color: '#20273D', fontSize: 34, fontWeight: '900', letterSpacing: -1, marginTop: 7 },
  copy: { color: '#5E6880', fontSize: 16, lineHeight: 23, marginTop: 10, maxWidth: 290 },
  panel: { backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 34 },
  error: { color: '#C73A4A', fontSize: 13, minHeight: 20, marginBottom: 7 },
  link: { alignSelf: 'center', padding: 16 },
  linkText: { color: '#66718B', fontSize: 14 },
  linkStrong: { color: '#234AD8', fontWeight: '800' },
});
