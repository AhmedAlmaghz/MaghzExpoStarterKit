/**
 * Theme Store
 *
 * Zustand state management for theme/appearance settings.
 * Persists theme preference to local storage.
 * Supports light, dark, and system theme modes.
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
 * Available theme modes configuration
 */
export interface ThemeModeConfig {
    mode: ThemeMode;
    label: string;
    icon: string;
}

export const THEME_MODES: ThemeModeConfig[] = [
    { mode: 'light', label: 'settings.lightMode', icon: 'sunny-outline' },
    { mode: 'dark', label: 'settings.darkMode', icon: 'moon-outline' },
    { mode: 'system', label: 'settings.systemMode', icon: 'phone-portrait-outline' },
];

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
    /** System color scheme preference */
    systemIsDark: boolean;
}

/**
 * Theme actions interface
 */
interface ThemeActions {
    /** Set theme mode */
    setMode: (mode: ThemeMode) => void;
    /** Toggle between light and dark */
    toggleMode: () => void;
    /** Toggle to next theme mode (cycles through light -> dark -> system) */
    cycleMode: () => void;
    /** Update system color scheme */
    setSystemColorScheme: (isDark: boolean) => void;
    /** Initialize theme from storage */
    initialize: () => Promise<void>;
    /** Get next theme mode in cycle */
    getNextMode: () => ThemeMode;
}

/**
 * Resolve isDarkMode from mode and system preference
 */
function resolveIsDarkMode(mode: ThemeMode, systemIsDark: boolean): boolean {
    if (mode === 'system') return !!systemIsDark;
    return mode === 'dark';
}

/**
 * Theme store with Zustand
 */
export const useThemeStore = create<ThemeState & ThemeActions>((set, get) => ({
    mode: 'system',
    isDarkMode: false,
    colors: getColors(false),
    systemIsDark: false,

    setMode: (mode: ThemeMode) => {
        const { systemIsDark } = get();
        const isDarkMode = resolveIsDarkMode(mode, systemIsDark);
        set({ mode, isDarkMode, colors: getColors(isDarkMode) });
        storage.setItem(STORAGE_KEYS.THEME_MODE, mode);
    },

    toggleMode: () => {
        const { mode, systemIsDark } = get();

        // If system mode, toggle to explicit light/dark based on current resolved state
        if (mode === 'system') {
            const newMode = systemIsDark ? 'light' : 'dark';
            get().setMode(newMode);
        } else {
            // Toggle between light and dark
            const newMode = mode === 'dark' ? 'light' : 'dark';
            get().setMode(newMode);
        }
    },

    cycleMode: () => {
        const { mode } = get();
        const modeOrder: ThemeMode[] = ['light', 'dark', 'system'];
        const currentIndex = modeOrder.indexOf(mode);
        const nextIndex = (currentIndex + 1) % modeOrder.length;
        get().setMode(modeOrder[nextIndex]);
    },

    setSystemColorScheme: (isDark: boolean) => {
        const { mode } = get();
        const isDarkMode = resolveIsDarkMode(mode, isDark);
        set({ systemIsDark: isDark, isDarkMode, colors: getColors(isDarkMode) });
    },

    getNextMode: () => {
        const { mode } = get();
        const modeOrder: ThemeMode[] = ['light', 'dark', 'system'];
        const currentIndex = modeOrder.indexOf(mode);
        const nextIndex = (currentIndex + 1) % modeOrder.length;
        return modeOrder[nextIndex];
    },

    initialize: async () => {
        const savedMode = await storage.getItem<ThemeMode>(STORAGE_KEYS.THEME_MODE);
        if (savedMode) {
            const { systemIsDark } = get();
            const isDarkMode = resolveIsDarkMode(savedMode, systemIsDark);
            set({ mode: savedMode, isDarkMode, colors: getColors(isDarkMode) });
        }
    },
}));
