// Home / intro screen for the app.
// Shows usage steps and a refreshed eco-friendly landing experience.
import { useState } from 'react';
import { Alert, Image, View, StyleSheet, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Link, useRouter } from 'expo-router';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { setPendingImage } from '@/services/imageStore';

export default function ImagePickerExample() {
  const [image, setImage] = useState<string | null>(null);
  const router = useRouter();

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Permission to access the media library is required.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const asset = result.assets[0];
      if (!asset.base64) {
        Alert.alert('Upload failed', 'No base64 image data was available.');
        return;
      }

      setPendingImage({
        uri: asset.uri,
        base64: asset.base64,
        fileName: asset.fileName ?? 'image.jpg',
        width: asset.width ?? 0,
        height: asset.height ?? 0,
      });

      router.push('/action');
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#4E9F61', dark: '#1F472F' }}
      headerImage={
        <View style={styles.heroBadge}>
          <ThemedText type="title" style={styles.heroEmoji}>♻️</ThemedText>
        </View>
      }
    >
      <ThemedView style={styles.pageWrapper}>
        <ThemedView style={styles.heroSection}>
          <ThemedText type="title" style={styles.heroTitle}>
            Future Fusion AI
          </ThemedText>
          <ThemedText style={styles.heroSubtitle}>
            Smart recycling guidance to help you sort trash the right way.
          </ThemedText>
        </ThemedView>

        <TouchableOpacity style={styles.primaryButton} onPress={pickImage}>
          <ThemedText style={styles.buttonText}>Upload or Take Photo</ThemedText>
        </TouchableOpacity>

        <ThemedView style={styles.card}>
          <ThemedText type="subtitle" style={styles.cardTitle}>
            Step 1: Upload or Take an Image
          </ThemedText>
          <ThemedText style={styles.cardText}>
            Choose a photo of your item. Make sure the object is fully visible and the background is clear.
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.card}>
          <Link href="/modal">
            <ThemedText type="subtitle" style={styles.linkText}>
              Step 2: Wait for the AI to Process
            </ThemedText>
          </Link>
          <ThemedText style={styles.cardText}>
            Our model reviews the image and returns the best recycling category for your item.
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.card}>
          <ThemedText type="subtitle" style={styles.cardTitle}>
            Step 3: Sort with Confidence
          </ThemedText>
          <ThemedText style={styles.cardText}>
            Use the prediction to place your waste in the correct bin and keep the planet cleaner.
          </ThemedText>
        </ThemedView>

        {image ? (
          <View style={styles.previewCard}>
            <Image source={{ uri: image }} style={styles.previewImage} />
            <ThemedText style={styles.previewText}>Preview selected image</ThemedText>
          </View>
        ) : null}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  pageWrapper: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    width: '100%',
  },
  heroBadge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#DFF5E3',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    alignSelf: 'center',
    marginTop: 20,
  },
  heroEmoji: {
    fontSize: 42,
  },
  heroSection: {
    marginTop: 24,
    marginBottom: 18,
  },
  heroTitle: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '800',
    color: '#15472B',
  },
  heroSubtitle: {
    marginTop: 12,
    fontSize: 16,
    lineHeight: 24,
    color: '#3D6B45',
  },
  card: {
    backgroundColor: '#EFF8EF',
    borderRadius: 18,
    padding: 18,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    width: '100%',
  },
  cardTitle: {
    color: '#226B3E',
    marginBottom: 8,
  },
  cardText: {
    color: '#466B4D',
    lineHeight: 22,
  },
  linkText: {
    color: '#2F7D4D',
    marginBottom: 8,
  },
  primaryButton: {
    backgroundColor: '#3F7D4A',
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 14,
    width: '100%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  previewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
    width: '100%',
  },
  previewImage: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    marginBottom: 12,
  },
  previewText: {
    color: '#3D6B45',
    fontSize: 14,
    fontWeight: '600',
  },
});

