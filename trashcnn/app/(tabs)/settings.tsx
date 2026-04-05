// Settings screen showing troubleshooting notes, platform hints, and UI documentation links.
import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';

import { Collapsible } from '@/components/ui/collapsible';
import { ExternalLink } from '@/components/external-link';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';

export default function TabTwoScreen() {
  return (
    // Setting page UI starts here
    <ParallaxScrollView
      // Settings page uses a parallax header image and collapsible content panels
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#1d4724' }}
      headerImage={
         <Image
           source={require('@/assets/UIQAimages/bkg2.jpg')}
           style={{ height: 300, width: 400}}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
          }}>
          Settings
        </ThemedText>
      </ThemedView>
      <Collapsible title="Troubleshooting">
        <ThemedText>
        Ensure there is only one object, fully in frame. Ensure that your image is at least an appropriate resolution. Finally, make sure the background is solid with no visible distractions.
        </ThemedText>
      </Collapsible>
    </ParallaxScrollView>
  );
}

// Settings style sheet css
const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
