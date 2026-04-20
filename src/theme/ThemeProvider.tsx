/**
 * Theme Provider
 *
 * Provides theme context to the application.
 * Handles system color scheme detection, theme persistence, and smooth transitions.
 *
 * @module theme/ThemeProvider
 */
import React, { useEffect, useRef } from 'react';
import { useColorScheme, StatusBar } from 'react-native';
import { useThemeStore } from './themeStore';
import { useI18nStore } from '@/i18n/i18nStore';
import { I18nManager } from 'react-native';

interface ThemeProviderProps {
  children: React.ReactNode;
}

/**
 * Theme provider component
 * Wraps the app and provides theme context with smooth transitions
 */
export function ThemeProvider({ children }: ThemeProviderProps): React.ReactElement {
  const systemColorScheme = useColorScheme();
  const setSystemColorScheme = useThemeStore((state) => state.setSystemColorScheme);
  const initialize = useThemeStore((state) => state.initialize);
  const initializeI18n = useI18nStore((state) => state.initialize);
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const isRTL = useI18nStore((state) => state.isRTL);

  const isInitialized = useRef(false);

  // Initialize theme and i18n from storage on mount
  useEffect(() => {
    const init = async () => {
      if (isInitialized.current) return;
      isInitialized.current = true;

      try {
        await initializeI18n();
        console.log('[ThemeProvider] i18n initialized');
      } catch (e) {
        console.warn('[ThemeProvider] i18n init failed:', e);
      }

      try {
        await initialize();
        console.log('[ThemeProvider] theme initialized');
      } catch (e) {
        console.warn('[ThemeProvider] theme init failed:', e);
      }
    };

    init();
  }, [initialize, initializeI18n]);

  // Update system color scheme when it changes
  useEffect(() => {
    setSystemColorScheme(systemColorScheme === 'dark');
  }, [systemColorScheme, setSystemColorScheme]);

  // Update native RTL setting when locale direction changes
  useEffect(() => {
    if (I18nManager.isRTL !== isRTL) {
      I18nManager.allowRTL(isRTL);
      I18nManager.forceRTL(isRTL);
    }
  }, [isRTL]);

  // Determine status bar style based on theme
  const barStyle: 'light-content' | 'dark-content' = isDarkMode ? 'light-content' : 'dark-content';

  return (
    <>
      <StatusBar
        barStyle={barStyle}
        translucent={true}
        backgroundColor="transparent"
      />
      {children}
    </>
  );
}
