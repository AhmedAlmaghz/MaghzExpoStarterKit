/**
 * Theme Provider
 *
 * Provides theme context to the application.
 * Handles system color scheme detection and theme persistence.
 *
 * @module theme/ThemeProvider
 */
import React, { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { useThemeStore } from './themeStore';

interface ThemeProviderProps {
  children: React.ReactNode;
}

/**
 * Theme provider component
 * Wraps the app and provides theme context
 */
export function ThemeProvider({ children }: ThemeProviderProps): React.ReactElement {
  const systemColorScheme = useColorScheme();
  const setSystemColorScheme = useThemeStore((state) => state.setSystemColorScheme);
  const initialize = useThemeStore((state) => state.initialize);
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  // Initialize theme from storage on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Update system color scheme when it changes
  useEffect(() => {
    setSystemColorScheme(systemColorScheme === 'dark');
  }, [systemColorScheme, setSystemColorScheme]);

  return (
    <React.Fragment key={isDarkMode ? 'dark' : 'light'}>
      {children}
    </React.Fragment>
  );
}