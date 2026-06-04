import '@/global.css';

import { useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Stack, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { Anton_400Regular } from '@expo-google-fonts/anton';
import { BebasNeue_400Regular } from '@expo-google-fonts/bebas-neue';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { PermanentMarker_400Regular } from '@expo-google-fonts/permanent-marker';

import BackgroundFX from '@/components/BackgroundFX';
import DvdFrame from '@/components/DvdFrame';
import AudioToggle from '@/components/AudioToggle';
import { track } from '@/lib/analytics';
import { APP_MAX_WIDTH, colors } from '@/lib/theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

/** Logs a page_view whenever the route changes. */
function AnalyticsTracker() {
  const pathname = usePathname();
  useEffect(() => {
    track('page_view', { path: pathname });
  }, [pathname]);
  return null;
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Anton_400Regular,
    BebasNeue_400Regular,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    PermanentMarker_400Regular,
  });

  // Render once fonts load — or if they fail, so a font CDN hiccup can never
  // leave the menu stuck on a blank screen (system fonts degrade gracefully).
  const ready = fontsLoaded || !!fontError;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  if (!ready) return <View style={styles.root} />;

  return (
    <SafeAreaProvider>
      <View style={styles.root}>
        <BackgroundFX />
        <View style={styles.column}>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: 'fade',
              contentStyle: { backgroundColor: 'transparent' },
            }}
          />
          <DvdFrame />
          <View style={styles.audio} pointerEvents="box-none">
            <AudioToggle />
          </View>
          <AnalyticsTracker />
        </View>
        <StatusBar style="light" />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.black },
  column: {
    flex: 1,
    width: '100%',
    maxWidth: APP_MAX_WIDTH,
    alignSelf: 'center',
  },
  audio: {
    position: 'absolute',
    top: Platform.select({ web: 16, default: 50 }),
    right: 16,
    zIndex: 50,
  },
});
