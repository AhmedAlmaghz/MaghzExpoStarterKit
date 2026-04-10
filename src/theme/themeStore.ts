/**
 * Theme Store
 *
 * Zustand state management for theme/appearance settings.
 * Persists theme preference to local storage.
 *
 * @module theme/themeStore
 */
import { create } from 'zustand';
import { storage } from '@/lib/storage';
import { STORAGE_KEYS } from '@/lib/constants';
import { getColors } from './colors';
import type { Colors } from './colors';

/**
 * Theme mode options
 */
export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * Theme state interface
 */
interface ThemeState {
    /** Current theme mode setting */
    mode: ThemeMode;
    /** Whether dark mode is currently active (resolved from mode + system) */
    isDarkMode: boolean;
    /** Current color palette */
    colors: Colors;
}

/**
 * Theme actions interface
 */
interface ThemeActions {
    /** Set theme mode */
    setMode: (mode: ThemeMode) => void;
    /** Toggle between light and dark */
    toggleMode: () => void;
    /** Update system color scheme */
    setSystemColorScheme: (isDark: boolean) => void;
    /** Initialize theme from storage */
    initialize: () => Promise<void>;
}

/**
 * Resolve isDarkMode from mode and system preference
 */
function resolveIsDarkMode(mode: ThemeMode, systemIsDark: boolean): boolean {
    if (mode === 'system') return !!systemIsDark;
    return mode === 'dark';
}

/**
 * Track system color scheme separately
 */
let systemIsDark = false;

/**
 * Theme store with Zustand
 */
export const useThemeStore = create<ThemeState & ThemeActions>((set, get) => ({
    mode: 'system',
    isDarkMode: false,
    colors: getColors(false),

    setMode: (mode: ThemeMode) => {
        const isDarkMode = resolveIsDarkMode(mode, systemIsDark);
        set({ mode, isDarkMode, colors: getColors(isDarkMode) });
        storage.setItem(STORAGE_KEYS.THEME_MODE, mode);
    },

    toggleMode: () => {
        const currentMode = get().mode;
        const currentIsDark = get().isDarkMode;

        // If system mode, toggle to explicit light/dark
        if (currentMode === 'system') {
            const newMode = currentIsDark ? 'light' : 'dark';
            get().setMode(newMode);
        } else {
            // Toggle between light and dark
            const newMode = currentIsDark ? 'light' : 'dark';
            get().setMode(newMode);
        }
    },

    setSystemColorScheme: (isDark: boolean) => {
        systemIsDark = isDark;
        const { mode } = get();
        const isDarkMode = resolveIsDarkMode(mode, isDark);
        set({ isDarkMode, colors: getColors(isDarkMode) });
    },

    initialize: async () => {
        const savedMode = await storage.getItem<ThemeMode>(STORAGE_KEYS.THEME_MODE);
        if (savedMode) {
            const isDarkMode = resolveIsDarkMode(savedMode, systemIsDark);
            set({ mode: savedMode, isDarkMode, colors: getColors(isDarkMode) });
        }
    },
}));