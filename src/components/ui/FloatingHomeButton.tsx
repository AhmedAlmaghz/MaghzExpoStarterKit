import React from 'react';
import { TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme/hooks/useTheme';

/**
 * Floating Home Button
 * 
 * Appears ONLY on internal pages where the bottom navigation bar is NOT visible.
 * This ensures no UI duplication and a cleaner interface.
 */
export function FloatingHomeButton() {
    const { colors } = useTheme();
    const router = useRouter();
    const segments = useSegments();

    // The main app pages (Home, Pages, Dashboard, Profile) are inside the '(main)' segment.
    // These pages already have a Home button in the bottom tab bar.
    // We only show this FAB if we are NOT in the '(main)' segment.
    const isInMain = segments[0] === '(main)';
    
    // Also hide on the very root to avoid flickering during redirects
    if (isInMain || segments.length === 0) {
        return null;
    }

    return (
        <TouchableOpacity 
            style={[styles.fab, { backgroundColor: colors.primary[500] }]}
            onPress={() => router.push('/(main)')}
            activeOpacity={0.8}
        >
            <Ionicons name="home" size={24} color="white" />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 40 : 30, // Higher position since tab bar is hidden
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        zIndex: 999,
    },
});
