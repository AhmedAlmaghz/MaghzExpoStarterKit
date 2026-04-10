/**
 * Loading Component
 *
 * Reusable loading spinner with optional message.
 *
 * @module components/ui/Loading
 */
import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/hooks/useTheme';

interface LoadingProps {
    /** Loading message */
    message?: string;
    /** Spinner size */
    size?: 'small' | 'large';
    /** Whether to show full screen overlay */
    fullScreen?: boolean;
}

/**
 * Loading component
 */
export function Loading({
    message,
    size = 'large',
    fullScreen = false,
}: LoadingProps): React.ReactElement {
    const { colors } = useTheme();

    if (!!fullScreen) {
        return (
            <View style={[styles.fullScreen, { backgroundColor: colors.overlay }]}>
                <View style={[styles.container, { backgroundColor: colors.card, borderRadius: 16 }]}>
                    <ActivityIndicator size={size} color={colors.primary[500]} />
                    {message && (
                        <Text style={[styles.message, { color: colors.text }]}>{message}</Text>
                    )}
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ActivityIndicator size={size} color={colors.primary[500]} />
            {message && (
                <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    fullScreen: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
    },
    container: {
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    message: {
        fontSize: 14,
        textAlign: 'center',
    },
});