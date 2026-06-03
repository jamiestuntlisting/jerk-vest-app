/** Open an external URL: a new tab on web, the in-app browser on native. */
import { Linking, Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { track } from './analytics';

export async function openExternal(url: string, label?: string) {
  track('outbound_click', { label: label ?? url, meta: { url } });
  try {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined') window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }
    await WebBrowser.openBrowserAsync(url);
  } catch {
    try {
      await Linking.openURL(url);
    } catch {
      /* give up silently */
    }
  }
}
