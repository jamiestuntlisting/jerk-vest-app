/**
 * "Power" toggle for the VCR — flips the whole site to greyscale (powered off)
 * and back to colour (powered on). Web applies a CSS filter to the document so
 * every screen is affected; native is a no-op for now.
 */
import { Platform } from 'react-native';

let poweredOn = true;

export function isPoweredOn() {
  return poweredOn;
}

export function togglePower(): boolean {
  poweredOn = !poweredOn;
  if (Platform.OS === 'web' && typeof document !== 'undefined') {
    const root = document.documentElement;
    root.style.transition = 'filter 0.5s ease';
    root.style.filter = poweredOn ? '' : 'grayscale(1) brightness(0.9)';
  }
  return poweredOn;
}
