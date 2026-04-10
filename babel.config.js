/** @type {import('babel-core').ConfigFunction} */
module.exports = function (api) {
    api.cache(true);
    return {
        presets: [
            // NOTE: NativeWind v4 requires `withNativeWind` in metro.config.js to work properly.
            // On Windows, the ESM-only `nativewind/metro` module causes ERR_UNSUPPORTED_ESM_URL_SCHEME.
            // To re-enable NativeWind:
            //   1. Switch metro.config.js to use `withNativeWind` (requires non-Windows env or ESM fix)
            //   2. Uncomment the jsxImportSource and nativewind/babel lines below
            //   3. Uncomment `import '../global.css'` in src/app/_layout.tsx
            ['babel-preset-expo' /* , { jsxImportSource: 'nativewind' } */],
            // 'nativewind/babel',
        ],
        plugins: ['react-native-reanimated/plugin'],
    };
};