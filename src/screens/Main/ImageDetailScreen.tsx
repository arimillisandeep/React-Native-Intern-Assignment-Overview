import { useState } from 'react';
import { Alert, Image, Platform, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Sharing from 'expo-sharing';
import { AppButton } from '../../components/AppButton';
import type { AppStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<AppStackParamList, 'ImageDetail'>;

export function ImageDetailScreen({ route }: Props) {
  const { image } = route.params;
  const [downloading, setDownloading] = useState(false);
  const download = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Device feature', 'Saving to the photo gallery is available on Android and iOS devices.');
      return;
    }
    setDownloading(true);
    try {
      const [MediaLibrary, { File, Paths }] = await Promise.all([
        import('expo-media-library'),
        import('expo-file-system'),
      ]);
      const permission = await MediaLibrary.requestPermissionsAsync();
      if (!permission.granted) throw new Error('Photo permission is required to save this image.');
      const destination = new File(Paths.cache, `fotoowl-${image.id}.jpg`);
      if (destination.exists) destination.delete();
      const downloaded = await File.downloadFileAsync(image.download_url, destination);
      if (!downloaded) throw new Error('Download was interrupted.');
      await MediaLibrary.saveToLibraryAsync(downloaded.uri);
      Alert.alert('Saved to gallery', 'The photo is now available in your device gallery.');
    } catch (error) {
      Alert.alert('Unable to save image', error instanceof Error ? error.message : 'Please try again.');
    } finally { setDownloading(false); }
  };
  const share = async () => {
    if (!(await Sharing.isAvailableAsync())) return Alert.alert('Sharing unavailable', 'Sharing is not available on this device.');
    await Sharing.shareAsync(image.download_url, { dialogTitle: `Share photo by ${image.author}` });
  };
  return <View style={styles.screen}><Image source={{ uri: image.download_url }} style={styles.image} resizeMode="contain" /><View style={styles.info}><Text style={styles.label}>PHOTOGRAPHER</Text><Text style={styles.author}>{image.author}</Text><Text style={styles.meta}>PHOTO #{image.id} · {image.width} × {image.height}</Text><View style={styles.actions}><AppButton title="Save to gallery" onPress={() => void download()} loading={downloading} /><AppButton title="Share link" variant="outline" onPress={() => void share()} /></View><Text style={styles.note}>{Platform.OS === 'web' ? 'Gallery downloads require an Android or iOS device.' : 'Saved photos are added to your device gallery.'}</Text></View></View>;
}

const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: '#101528', justifyContent: 'space-between' }, image: { width: '100%', flex: 1, minHeight: 280 }, info: { backgroundColor: '#fff', padding: 22, borderTopLeftRadius: 26, borderTopRightRadius: 26 }, label: { color: '#234AD8', fontSize: 11, fontWeight: '900', letterSpacing: 1.2 }, author: { color: '#20273D', fontSize: 26, fontWeight: '900', marginTop: 6 }, meta: { color: '#68738B', marginTop: 6, fontWeight: '600' }, actions: { gap: 11, marginTop: 24 }, note: { color: '#8790A6', fontSize: 12, textAlign: 'center', marginTop: 15 }, });
