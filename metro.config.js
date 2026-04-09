/**
 * Metro Configuration (CommonJS)
 *
 * Use a CommonJS config on Windows to avoid ESM loader issues when Metro
 * attempts to load ESM-only modules. NativeWind will continue to work via
 * the Babel plugin in `babel.config.js`.
 */
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

module.exports = config;
