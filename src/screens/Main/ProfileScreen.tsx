import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../../components/AppButton';
import { Dropdown } from '../../components/Dropdown';
import { InputField } from '../../components/InputField';
import { useAuthStore } from '../../store/useAuthStore';
import type { Gender, UserProfile } from '../../types/auth';
import { validateEmail, validateMobile } from '../../utils/validation';

const cities = ['Bengaluru', 'Chennai', 'Delhi', 'Hyderabad', 'Mumbai', 'Pune'];

export function ProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const logout = useAuthStore((state) => state.logout);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<UserProfile | null>(user);
  const [error, setError] = useState('');
  useEffect(() => setForm(user), [user]);
  if (!form) return null;
  const update = <K extends keyof UserProfile>(key: K, value: UserProfile[K]) => setForm((current) => current ? { ...current, [key]: value } : current);
  const save = async () => {
    if (!form.fullName.trim() || !form.address.trim() || !form.city) return setError('Please complete all profile fields.');
    if (!validateEmail(form.email)) return setError('Enter a valid email address.');
    if (!validateMobile(form.mobile)) return setError('Enter a 10-digit mobile number.');
    await updateProfile(form);
    setError('');
    setEditing(false);
  };
  const confirmLogout = () => Alert.alert('Log out?', 'You can log in again with your saved credentials.', [{ text: 'Cancel', style: 'cancel' }, { text: 'Log out', style: 'destructive', onPress: () => void logout() }]);
  return <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
    <View style={styles.top}><View style={styles.avatar}><Text style={styles.avatarText}>{form.fullName.charAt(0).toUpperCase()}</Text></View><View><Text style={styles.name}>{form.fullName}</Text><Text style={styles.email}>{form.email}</Text></View></View>
    <View style={styles.headingRow}><View><Text style={styles.title}>Your profile</Text><Text style={styles.subtitle}>Keep your details up to date.</Text></View><Pressable onPress={() => { setEditing((value) => !value); setError(''); }}><Text style={styles.edit}>{editing ? 'Cancel' : 'Edit'}</Text></Pressable></View>
    <View style={styles.card}>
      {editing ? <>
        <InputField label="Full name" value={form.fullName} onChangeText={(value) => update('fullName', value)} />
        <InputField label="Email address" value={form.email} onChangeText={(value) => update('email', value)} autoCapitalize="none" keyboardType="email-address" />
        <Text style={styles.label}>Gender</Text><View style={styles.options}>{(['Male', 'Female', 'Other'] as Gender[]).map((gender) => <Pressable key={gender} onPress={() => update('gender', gender)} style={[styles.option, form.gender === gender && styles.selected]}><Text style={[styles.optionText, form.gender === gender && styles.selectedText]}>{gender}</Text></Pressable>)}</View>
        <InputField label="Mobile number" value={form.mobile} onChangeText={(value) => update('mobile', value.replace(/\D/g, '').slice(0, 10))} keyboardType="number-pad" />
        <InputField label="Address" value={form.address} onChangeText={(value) => update('address', value)} multiline style={styles.address} />
        <Dropdown label="City" value={form.city} options={cities} onChange={(value) => update('city', value)} />
        <Text style={styles.error}>{error}</Text><AppButton title="Save changes" onPress={() => void save()} />
      </> : <View>{[['Mobile', form.mobile], ['Gender', form.gender], ['Address', form.address], ['City', form.city]].map(([label, value]) => <View key={label} style={styles.infoRow}><Text style={styles.infoLabel}>{label}</Text><Text style={styles.infoValue}>{value}</Text></View>)}</View>}
    </View>
    <AppButton title="Log out" variant="danger" onPress={confirmLogout} />
  </ScrollView>;
}

const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: '#F7F8FC' }, content: { padding: 20, paddingTop: 28, paddingBottom: 30 }, top: { flexDirection: 'row', alignItems: 'center', gap: 14 }, avatar: { width: 62, height: 62, borderRadius: 31, alignItems: 'center', justifyContent: 'center', backgroundColor: '#234AD8' }, avatarText: { color: '#fff', fontWeight: '900', fontSize: 26 }, name: { color: '#20273D', fontSize: 20, fontWeight: '900' }, email: { color: '#68738B', marginTop: 3 }, headingRow: { marginTop: 30, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, title: { color: '#20273D', fontSize: 25, fontWeight: '900', letterSpacing: -0.6 }, subtitle: { color: '#68738B', marginTop: 4 }, edit: { color: '#234AD8', fontWeight: '800', padding: 8 }, card: { marginTop: 18, marginBottom: 20, padding: 18, borderRadius: 18, backgroundColor: '#fff', elevation: 1, shadowColor: '#162045', shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 3 } }, infoRow: { paddingVertical: 14, borderBottomColor: '#E8EBF2', borderBottomWidth: 1 }, infoLabel: { color: '#8790A6', textTransform: 'uppercase', fontSize: 10, fontWeight: '900', letterSpacing: 0.8 }, infoValue: { color: '#20273D', fontSize: 16, marginTop: 5, fontWeight: '600' }, label: { color: '#20273D', fontSize: 14, fontWeight: '700', marginBottom: 8 }, options: { flexDirection: 'row', gap: 8, marginBottom: 16 }, option: { flex: 1, paddingVertical: 12, borderRadius: 11, alignItems: 'center', backgroundColor: '#E9EDFA' }, selected: { backgroundColor: '#234AD8' }, optionText: { color: '#53607C', fontWeight: '700' }, selectedText: { color: '#fff' }, address: { height: 75, textAlignVertical: 'top', paddingTop: 12 }, cities: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 }, city: { paddingVertical: 9, paddingHorizontal: 11, borderRadius: 18, backgroundColor: '#E9EDFA' }, cityText: { color: '#53607C', fontWeight: '700', fontSize: 12 }, error: { color: '#C73A4A', minHeight: 20, marginBottom: 8, fontSize: 13 }, });
