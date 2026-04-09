/**
 * Metro Configuration
 *
 * Configured with NativeWind v4 support for TailwindCSS 4
 * in React Native via Expo Router.
 *
 * Uses .mjs extension to enable ESM imports, which is required
 * on Windows to avoid ERR_UNSUPPORTED_ESM_URL_SCHEME errors
 * when loading ESM-only packages like nativewind/metro.
 *
 * @see https://www.nativewind.dev/getting-started/expo-router
 */
import { getDefaultConfig } from 'expo/metro-config';
import { withNativeWind } from 'nativewind/metro';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

export default withNativeWind(config, { input: './src/global.css' });