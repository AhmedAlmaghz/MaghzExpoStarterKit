/**
 * Card Component
 *
 * Reusable card container with optional header and footer.
 * Uses theme-aware colors with proper shadows and borders.
 *
 * @module components/ui/Card
 */
import React from 'react';
import { View, Text, StyleSheet, type ViewStyle, TouchableOpacity } from 'react-native';
import { useTheme } from '@/theme/hooks/useTheme';

interface CardProps {
    /** Card title */
    title?: string;
    /** Card subtitle */
    subtitle?: string;
    /** Card content */
    children: React.ReactNode;
    /** Footer content */
    footer?: React.ReactNode;
    /** Whether card has elevated shadow */
    elevated?: boolean;
    /** Custom container style */
    style?: ViewStyle;
    /** Callback when card is pressed */
    onPress?: () => void;
    /** Padding */
    padding?: number;
}

/**
 * Card component
 */
export function Card({
    title,
    subtitle,
    children,
    footer,
    elevated = false,
    style,
    onPress,
    padding = 16,
}: CardProps): React.ReactElement {
    const { colors, isDarkMode } = useTheme();

    const cardContent = (
        <>
            {(title || subtitle) && (
                <View style={styles.header}>
                    {title && (
                        <Text style={[styles.title, { color: colors.text }]}>
                            {title}
                        </Text>
                    )}
                    {subtitle && (
                        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                            {subtitle}
                        </Text>
                    )}
                </View>
            )}
            <View style={styles.content}>{children}</View>
            {footer && (
                <View style={[styles.footer, { borderTopColor: colors.divider }]}>
                    {footer}
                </View>
            )}
        </>
    );

    if (onPress) {
        return (
            <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.7}
                style={[
                    styles.card,
                    {
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                        padding,
                    },
                    elevated && !isDarkMode && {
                        shadowColor: colors.shadow,
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.08,
                        shadowRadius: 12,
                        elevation: 3,
                    },
                    elevated && isDarkMode && {
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 12,
                        elevation: 3,
                    },
                    style,
                ]}
            >
                {cardContent}
            </TouchableOpacity>
        );
    }

    return (
        <View
            style={[
                styles.card,
                {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    padding,
                },
                elevated && !isDarkMode && {
                    shadowColor: colors.shadow,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.08,
                    shadowRadius: 12,
                    elevation: 3,
                },
                elevated && isDarkMode && {
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 12,
                    elevation: 3,
                },
                style,
            ]}
        >
            {cardContent}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        borderWidth: 1,
        overflow: 'hidden',
    },
    header: {
        marginBottom: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
    },
    subtitle: {
        fontSize: 14,
        marginTop: 2,
    },
    content: {
        // Content area
    },
    footer: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
    },
});
