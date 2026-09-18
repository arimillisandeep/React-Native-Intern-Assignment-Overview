import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppButton } from '../../components/AppButton';
import { Dropdown } from '../../components/Dropdown';
import { InputField } from '../../components/InputField';
import { useAuthStore } from '../../store/useAuthStore';
import type { Gender, RegisterForm } from '../../types/auth';
import type { AuthStackParamList } from '../../types/navigation';
import { validateRegisterForm } from '../../utils/validation';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;
const cities = ['Bengaluru', 'Chennai', 'Delhi', 'Hyderabad', 'Mumbai', 'Pune'];
const emptyForm: RegisterForm = { fullName: '', email: '', gender: 'Male', mobile: '', address: '', city: '', password: '', confirmPassword: '' };

export function RegisterScreen({ navigation }: Props) {
  const register = useAuthStore((state) => state.register);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterForm, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const update = <K extends keyof RegisterForm>(key: K, value: RegisterForm[K]) => setForm((current) => ({ ...current, [key]: value }));
  const submit = async () => {
    const nextErrors = validateRegisterForm(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setSubmitting(true);
    const { confirmPassword: _confirmPassword, ...registeredUser } = form;
    await register(registeredUser);
    setSubmitting(false);
  };
  return <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}><ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled"><Pressable onPress={() => navigation.goBack()}><Text style={styles.back}>‹ Back to login</Text></Pressable><Text style={styles.logo}>foto<Text style={styles.logoAccent}>owl</Text></Text><Text style={styles.title}>Create your account</Text><Text style={styles.subtitle}>Your personal collection starts here.</Text><View style={styles.form}><InputField label="Full name" value={form.fullName} onChangeText={(value) => update('fullName', value)} error={errors.fullName} placeholder="Enter your name" /><InputField label="Email address" value={form.email} onChangeText={(value) => update('email', value)} error={errors.email} keyboardType="email-address" autoCapitalize="none" placeholder="you@example.com" /><Text style={styles.label}>Gender</Text><View style={styles.options}>{(['Male', 'Female', 'Other'] as Gender[]).map((gender) => <Pressable key={gender} onPress={() => update('gender', gender)} style={[styles.option, form.gender === gender && styles.selected]}><Text style={[styles.optionText, form.gender === gender && styles.selectedText]}>{gender}</Text></Pressable>)}</View><InputField label="Mobile number" value={form.mobile} onChangeText={(value) => update('mobile', value.replace(/\D/g, '').slice(0, 10))} error={errors.mobile} keyboardType="number-pad" placeholder="10-digit mobile number" /><InputField label="Address" value={form.address} onChangeText={(value) => update('address', value)} error={errors.address} multiline placeholder="Your address" style={styles.address} /><Dropdown label="City" value={form.city} options={cities} onChange={(value) => update('city', value)} error={errors.city} /><InputField label="Password" value={form.password} onChangeText={(value) => update('password', value)} error={errors.password} secureTextEntry placeholder="Minimum 6 characters" /><InputField label="Confirm password" value={form.confirmPassword} onChangeText={(value) => update('confirmPassword', value)} error={errors.confirmPassword} secureTextEntry placeholder="Re-enter your password" /><AppButton title="Create account" onPress={() => void submit()} loading={submitting} /></View></ScrollView></KeyboardAvoidingView>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F7F8FC' }, content: { padding: 22, paddingBottom: 40 }, back: { color: '#234AD8', fontWeight: '700', marginBottom: 25 }, logo: { fontSize: 27, fontWeight: '900', color: '#20273D' }, logoAccent: { color: '#234AD8' }, title: { color: '#20273D', fontSize: 28, fontWeight: '900', letterSpacing: -0.6, marginTop: 28 }, subtitle: { color: '#6B758C', marginTop: 6, fontSize: 15 }, form: { marginTop: 28 }, label: { color: '#20273D', fontSize: 14, fontWeight: '700', marginBottom: 8 }, options: { flexDirection: 'row', gap: 8, marginBottom: 16 }, option: { flex: 1, paddingVertical: 13, borderRadius: 11, alignItems: 'center', backgroundColor: '#E9EDFA' }, selected: { backgroundColor: '#234AD8' }, optionText: { color: '#53607C', fontWeight: '700' }, selectedText: { color: '#fff' }, address: { height: 78, textAlignVertical: 'top', paddingTop: 12 }, cityOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 }, city: { paddingVertical: 9, paddingHorizontal: 12, borderRadius: 18, backgroundColor: '#E9EDFA' }, cityText: { color: '#53607C', fontWeight: '700', fontSize: 13 }, fieldError: { color: '#C73A4A', marginBottom: 10, fontSize: 12 },
});
