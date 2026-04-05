// Home / intro screen for the app.
// Shows usage steps, sample UI, and includes image picker permissions logic.
import { useState } from 'react';
import { Alert, Button, Image, View, StyleSheet, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Link } from 'expo-router';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { HelloWave } from '@/components/hello-wave';

export default function ImagePickerExample() {
  const [image, setImage] = useState<string | null>(null);

  // Prompt for media library permissions and allow the user to pick an image or video.
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library.
    // Manually request permissions for videos on iOS when `allowsEditing` is set to `false`
    // and `videoExportPreset` is `'Passthrough'` (the default), ideally before launching the picker
    // so the app users aren't surprised by a system dialog after picking a video.
    // See "Invoke permissions for videos" sub section for more details.
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Permission to access the media library is required.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    // Home page UI starts here
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#c0dca1', dark: '#1d4724' }}
      headerImage={
        <Image
          source={require('@/assets/UIQAimages/bkg2.jpg')}
          style={{ height: 300, width: 400}}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />

      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText>The future of waste sorting is here. Follow the steps below, and let Future Fusion AI decide where your garbage belongs. </ThemedText>
        <ThemedView style={[styles.stepContainer, { marginBottom: 10 }]}>
        </ThemedView>
        <ThemedText type="subtitle">Step 1: Upload or Take an Image</ThemedText>
        <ThemedText>
          Upload an image from your gallery, or take a photo directly through your camera.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
            <ThemedText type="subtitle">Step 2: Wait for the AI to Process</ThemedText>
        <ThemedText>
          This may take up to 15 seconds. Click the settings tab to troubleshoot.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Accurately Sort Your Trash</ThemedText>
        <ThemedText>
          Follow the prediction results to help keep our environment clean!
        </ThemedText>
      </ThemedView>
      <ThemedText style={{ fontSize: 12, paddingTop: 16}}>*Results are not 100% reliable</ThemedText>
    </ParallaxScrollView>
  );
}

// Home style sheet css
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
});

