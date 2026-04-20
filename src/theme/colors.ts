/**
 * Color System
 *
 * Unified color definitions for light, dark, and system themes.
 * Compatible with TailwindCSS 4 dark mode.
 *
 * @module theme/colors
 */

/**
 * Light theme colors - Warm, inviting palette
 */
export const lightColors = {
    // Primary - Vibrant blue with warm undertones
    primary: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
        950: '#172554',
    },
    // Secondary - Slate gray with neutral tones
    secondary: {
        50: '#f8fafc',
        100: '#f1f5f9',
        200: '#e2e8f0',
        300: '#cbd5e1',
        400: '#94a3b8',
        500: '#64748b',
        600: '#475569',
        700: '#334155',
        800: '#1e293b',
        900: '#0f172a',
        950: '#020617',
    },
    // Success - Fresh green
    success: {
        50: '#f0fdf4',
        100: '#dcfce7',
        200: '#bbf7d0',
        300: '#86efac',
        400: '#4ade80',
        500: '#22c55e',
        600: '#16a34a',
        700: '#15803d',
        800: '#166534',
        900: '#14532d',
        950: '#052e16',
    },
    // Warning - Warm amber
    warning: {
        50: '#fffbeb',
        100: '#fef3c7',
        200: '#fde68a',
        300: '#fcd34d',
        400: '#fbbf24',
        500: '#f59e0b',
        600: '#d97706',
        700: '#b45309',
        800: '#92400e',
        900: '#78350f',
        950: '#451a03',
    },
    // Error / Danger - Coral red
    error: {
        50: '#fef2f2',
        100: '#fee2e2',
        200: '#fecaca',
        300: '#fca5a5',
        400: '#f87171',
        500: '#ef4444',
        600: '#dc2626',
        700: '#b91c1c',
        800: '#991b1b',
        900: '#7f1d1d',
        950: '#450a0a',
    },
    // Info - Sky blue
    info: {
        50: '#f0f9ff',
        100: '#e0f2fe',
        200: '#bae6fd',
        300: '#7dd3fc',
        400: '#38bdf8',
        500: '#0ea5e9',
        600: '#0284c7',
        700: '#0369a1',
        800: '#075985',
        900: '#0c4a6e',
        950: '#082f49',
    },
    // Semantic colors
    background: '#fafafa',
    surface: '#ffffff',
    surfaceVariant: '#f4f4f5',
    card: '#ffffff',
    cardElevated: '#ffffff',
    text: '#18181b',
    textSecondary: '#52525b',
    textTertiary: '#a1a1aa',
    textInverse: '#ffffff',
    border: '#e4e4e7',
    borderLight: '#f4f4f5',
    divider: '#e4e4e7',
    shadow: 'rgba(0, 0, 0, 0.08)',
    shadowMedium: 'rgba(0, 0, 0, 0.12)',
    shadowStrong: 'rgba(0, 0, 0, 0.16)',
    overlay: 'rgba(0, 0, 0, 0.4)',
    overlayLight: 'rgba(0, 0, 0, 0.2)',
    inputBackground: '#f4f4f5',
    inputBorder: '#d4d4d8',
    inputFocusBorder: '#3b82f6',
    inputFocusBackground: '#ffffff',
    headerBackground: '#ffffff',
    tabBackground: '#ffffff',
    tabActive: '#3b82f6',
    tabInactive: '#a1a1aa',
    statusBar: 'dark' as const,
    // Accent colors for light theme
    accent: {
        primary: '#3b82f6',
        secondary: '#8b5cf6',
        tertiary: '#ec4899',
    },
    // Gradient colors
    gradient: {
        start: '#3b82f6',
        end: '#8b5cf6',
    },
    // Chat bubble colors
    chatBubbleSent: '#3b82f6',
    chatBubbleReceived: '#f4f4f5',
    chatBubbleSentText: '#ffffff',
    chatBubbleReceivedText: '#18181b',
    // Skeleton loading
    skeleton: {
        base: '#f4f4f5',
        highlight: '#e4e4e7',
    },
} as const;

/**
 * Dark theme colors - Deep, comfortable palette
 */
export const darkColors = {
    // Primary - Bright blue for dark backgrounds
    primary: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
        950: '#172554',
    },
    // Secondary - Slate with adjusted brightness
    secondary: {
        50: '#f8fafc',
        100: '#f1f5f9',
        200: '#e2e8f0',
        300: '#cbd5e1',
        400: '#94a3b8',
        500: '#64748b',
        600: '#475569',
        700: '#334155',
        800: '#1e293b',
        900: '#0f172a',
        950: '#020617',
    },
    // Success - Vibrant green
    success: {
        50: '#f0fdf4',
        100: '#dcfce7',
        200: '#bbf7d0',
        300: '#86efac',
        400: '#4ade80',
        500: '#22c55e',
        600: '#16a34a',
        700: '#15803d',
        800: '#166534',
        900: '#14532d',
        950: '#052e16',
    },
    // Warning - Bright amber
    warning: {
        50: '#fffbeb',
        100: '#fef3c7',
        200: '#fde68a',
        300: '#fcd34d',
        400: '#fbbf24',
        500: '#f59e0b',
        600: '#d97706',
        700: '#b45309',
        800: '#92400e',
        900: '#78350f',
        950: '#451a03',
    },
    // Error / Danger - Soft red
    error: {
        50: '#fef2f2',
        100: '#fee2e2',
        200: '#fecaca',
        300: '#fca5a5',
        400: '#f87171',
        500: '#ef4444',
        600: '#dc2626',
        700: '#b91c1c',
        800: '#991b1b',
        900: '#7f1d1d',
        950: '#450a0a',
    },
    // Info - Light sky blue
    info: {
        50: '#f0f9ff',
        100: '#e0f2fe',
        200: '#bae6fd',
        300: '#7dd3fc',
        400: '#38bdf8',
        500: '#0ea5e9',
        600: '#0284c7',
        700: '#0369a1',
        800: '#075985',
        900: '#0c4a6e',
        950: '#082f49',
    },
    // Semantic colors - Dark theme
    background: '#09090b',
    surface: '#18181b',
    surfaceVariant: '#27272a',
    card: '#18181b',
    cardElevated: '#27272a',
    text: '#fafafa',
    textSecondary: '#a1a1aa',
    textTertiary: '#71717a',
    textInverse: '#18181b',
    border: '#27272a',
    borderLight: '#1f1f23',
    divider: '#27272a',
    shadow: 'rgba(0, 0, 0, 0.4)',
    shadowMedium: 'rgba(0, 0, 0, 0.5)',
    shadowStrong: 'rgba(0, 0, 0, 0.6)',
    overlay: 'rgba(0, 0, 0, 0.7)',
    overlayLight: 'rgba(0, 0, 0, 0.5)',
    inputBackground: '#27272a',
    inputBorder: '#3f3f46',
    inputFocusBorder: '#3b82f6',
    inputFocusBackground: '#1f1f23',
    headerBackground: '#18181b',
    tabBackground: '#18181b',
    tabActive: '#3b82f6',
    tabInactive: '#71717a',
    statusBar: 'light' as const,
    // Accent colors for dark theme
    accent: {
        primary: '#60a5fa',
        secondary: '#a78bfa',
        tertiary: '#f472b6',
    },
    // Gradient colors
    gradient: {
        start: '#3b82f6',
        end: '#8b5cf6',
    },
    // Chat bubble colors
    chatBubbleSent: '#3b82f6',
    chatBubbleReceived: '#27272a',
    chatBubbleSentText: '#ffffff',
    chatBubbleReceivedText: '#fafafa',
    // Skeleton loading
    skeleton: {
        base: '#27272a',
        highlight: '#3f3f46',
    },
} as const;

/**
 * Color palette structure
 */
export interface ColorPalette {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    950?: string;
}

/**
 * Accent colors structure
 */
export interface AccentColors {
    primary: string;
    secondary: string;
    tertiary: string;
}

/**
 * Gradient colors structure
 */
export interface GradientColors {
    start: string;
    end: string;
}

/**
 * Skeleton colors structure
 */
export interface SkeletonColors {
    base: string;
    highlight: string;
}

/**
 * Type for color values
 */
export interface Colors {
    primary: ColorPalette;
    secondary: ColorPalette;
    success: ColorPalette;
    warning: ColorPalette;
    error: ColorPalette;
    info: ColorPalette;
    background: string;
    surface: string;
    surfaceVariant: string;
    card: string;
    cardElevated: string;
    text: string;
    textSecondary: string;
    textTertiary: string;
    textInverse: string;
    border: string;
    borderLight: string;
    divider: string;
    shadow: string;
    shadowMedium: string;
    shadowStrong: string;
    overlay: string;
    overlayLight: string;
    inputBackground: string;
    inputBorder: string;
    inputFocusBorder: string;
    inputFocusBackground: string;
    headerBackground: string;
    tabBackground: string;
    tabActive: string;
    tabInactive: string;
    statusBar: 'light' | 'dark';
    accent: AccentColors;
    gradient: GradientColors;
    chatBubbleSent: string;
    chatBubbleReceived: string;
    chatBubbleSentText: string;
    chatBubbleReceivedText: string;
    skeleton: SkeletonColors;
}

/**
 * Get colors based on theme mode
 * @param isDark - Whether dark mode is active
 * @returns Color palette for the theme
 */
export function getColors(isDark: boolean): Colors {
    return isDark ? darkColors : lightColors;
}

/**
 * Predefined theme presets
 */
export const themePresets = {
    light: lightColors,
    dark: darkColors,
} as const;

/**
 * Animation durations
 */
export const animationDurations = {
    fast: 150,
    normal: 250,
    slow: 400,
} as const;

/**
 * Animation easings
 */
export const animationEasings = {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
} as const;

export type AnimationDuration = keyof typeof animationDurations;
export type AnimationEasing = keyof typeof animationEasings;
