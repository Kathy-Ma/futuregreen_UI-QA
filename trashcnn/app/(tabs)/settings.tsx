// Settings screen for recycling tips and app support.
import { Image } from 'expo-image';
import { Platform, View, StyleSheet } from 'react-native';

import { Collapsible } from '@/components/ui/collapsible';
import { ExternalLink } from '@/components/external-link';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Fonts } from '@/constants/theme';

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A6D3A2', dark: '#1E4F2F' }}
      headerImage={
        <View style={styles.headerBadge}>
          <ThemedText type="title" style={styles.headerBadgeText}>♻️</ThemedText>
        </View>
      }
    >
      <ThemedView style={styles.pageWrapper}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title" style={styles.titleText}>
            Settings
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.card}>
          <ThemedText type="subtitle" style={styles.cardTitle}>
            Recycling tips
          </ThemedText>
          <ThemedText style={styles.cardText}>
            Keep items clean and dry before recycling, remove lids when possible, and avoid mixing materials in the same bin.
          </ThemedText>
        </ThemedView>

        <View style={styles.sectionMargin}>
          <Collapsible title="Troubleshooting">
            <ThemedText style={styles.cardText}>
              If predictions fail, try using a bright, simple background and center one object in the frame.
            </ThemedText>
          </Collapsible>
        </View>

        <View style={styles.sectionMargin}>
          <Collapsible title="Platform support">
            <ThemedText style={styles.cardText}>
              This app supports Android, iOS, and web. For web, run the project and press{' '}
              <ThemedText type="defaultSemiBold">w</ThemedText> in your terminal.
            </ThemedText>
          </Collapsible>
        </View>

        <ThemedView style={styles.card}>
          <ThemedText type="subtitle" style={styles.cardTitle}>
            Learn more
          </ThemedText>
          <ThemedText style={styles.cardText}>
            Find more info about images, theming, and performance in Expo documentation.
          </ThemedText>
          <ExternalLink href="https://docs.expo.dev">
            <ThemedText type="link">Visit Expo docs</ThemedText>
          </ExternalLink>
        </ThemedView>

        <ThemedView style={styles.helpSection}>
          <Image
            source={require('@/assets/images/react-logo.png')}
            style={styles.helpImage}
          />
          <ThemedText style={styles.helpNote}>
            Tip: use a solid background and a single item to get the best recycling suggestions from the AI.
          </ThemedText>
        </ThemedView>

        <View style={styles.sectionMargin}>
          <Collapsible title="About the interface">
            <ThemedText style={styles.cardText}>
              This screen uses a clean green palette and collapsible cards to keep settings focused and easy to scan.
            </ThemedText>
            {Platform.select({
              ios: (
                <ThemedText style={styles.cardText}>
                  On iOS, the parallax header gives a fresh, modern feel to the settings page.
                </ThemedText>
              ),
            })}
          </Collapsible>
        </View>
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
  pageContainer: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  headerBadge: {
    width: 100,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E6F3E4',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  headerBadgeText: {
    fontSize: 44,
  },
  titleContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  titleText: {
    color: '#214E30',
  },
  card: {
    backgroundColor: '#F5FBF4',
    borderRadius: 20,
    padding: 18,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    width: '100%',
  },
  cardTitle: {
    marginBottom: 10,
    color: '#2E6E3B',
  },
  cardText: {
    color: '#3E6E4B',
    lineHeight: 22,
  },
  collapsible: {
    marginVertical: 8,
  },
  helpSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
    padding: 16,
    borderRadius: 20,
    backgroundColor: '#EFF8EF',
    width: '100%',
  },
  sectionMargin: {
    marginVertical: 10,
    width: '100%',
  },
  helpImage: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  helpNote: {
    textAlign: 'center',
    color: '#3D6A47',
    lineHeight: 20,
  },
});
