/**
 * useTheme Hook
 *
 * Custom hook for accessing theme state and actions.
 *
 * @module theme/hooks/useTheme
 */
import { useThemeStore } from '../themeStore';
import type { ThemeMode } from '../themeStore';
import type { Colors } from '../colors';

/**
 * Hook return type
 */
interface UseThemeReturn {
    /** Current theme mode setting */
    mode: ThemeMode;
    /** Whether dark mode is currently active */
    isDarkMode: boolean;
    /** Current color palette */
    colors: Colors;
    /** Set theme mode */
    setMode: (mode: ThemeMode) => void;
    /** Toggle between light and dark */
    toggleMode: () => void;
}

/**
 * Hook for accessing theme state and actions
 * @returns Theme state and action functions
 */
export function useTheme(): UseThemeReturn {
    const mode = useThemeStore((state) => state.mode);
    const isDarkMode = useThemeStore((state) => state.isDarkMode);
    const colors = useThemeStore((state) => state.colors);
    const setMode = useThemeStore((state) => state.setMode);
    const toggleMode = useThemeStore((state) => state.toggleMode);

    return {
        mode,
        isDarkMode,
        colors,
        setMode,
        toggleMode,
    };
}