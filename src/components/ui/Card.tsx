/**
 * Card Component
 *
 * Reusable card container with optional header and footer.
 *
 * @module components/ui/Card
 */
import React from 'react';
import { View, Text, StyleSheet, type ViewStyle } from 'react-native';
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
    const { colors } = useTheme();

    const Wrapper = onPress ? View : View;

    return (
        <Wrapper
            style={[
                styles.card,
                {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    padding,
                },
                elevated && {
                    shadowColor: colors.shadow,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 4,
                },
                style,
            ]}
            onTouchEnd={onPress}
        >
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
        </Wrapper>
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