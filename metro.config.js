/**
 * Metro Configuration
 *
 * Configured with NativeWind v4 support for TailwindCSS 4
 * in React Native via Expo Router.
 *
 * @see https://www.nativewind.dev/getting-started/expo-router
 */
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: './src/global.css' });