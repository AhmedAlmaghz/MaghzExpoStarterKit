/**
 * Button Component
 *
 * Reusable button with multiple variants, sizes, and loading state.
 * Theme-aware with proper color transitions.
 *
 * @module components/ui/Button
 */
import React from 'react';
import {
    TouchableOpacity,
    Text,
    ActivityIndicator,
    StyleSheet,
    type ViewStyle,
    type TextStyle,
} from 'react-native';
import { useTheme } from '@/theme/hooks/useTheme';

/**
 * Button variant types
 */
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

/**
 * Button size types
 */
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
    /** Button label */
    title: string;
    /** Press handler */
    onPress: () => void;
    /** Button variant */
    variant?: ButtonVariant;
    /** Button size */
    size?: ButtonSize;
    /** Whether button is disabled */
    disabled?: boolean;
    /** Whether button is loading */
    loading?: boolean;
    /** Whether button takes full width */
    fullWidth?: boolean;
    /** Left icon */
    leftIcon?: React.ReactNode;
    /** Right icon */
    rightIcon?: React.ReactNode;
    /** Custom container style */
    style?: ViewStyle;
    /** Custom text style */
    textStyle?: TextStyle;
    /** Accessibility label */
    accessibilityLabel?: string;
}

/**
 * Button component
 */
export function Button({
    title,
    onPress,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    fullWidth = false,
    leftIcon,
    rightIcon,
    style,
    textStyle,
    accessibilityLabel,
}: ButtonProps): React.ReactElement {
    const { colors } = useTheme();

    const getBackgroundColor = (): string => {
        if (disabled) return colors.textTertiary;
        switch (variant) {
            case 'primary': return colors.primary[500];
            case 'secondary': return colors.secondary[500];
            case 'outline': return 'transparent';
            case 'ghost': return 'transparent';
            case 'danger': return colors.error[500];
            default: return colors.primary[500];
        }
    };

    const getTextColor = (): string => {
        if (disabled) return colors.textInverse;
        switch (variant) {
            case 'primary': return colors.textInverse;
            case 'secondary': return colors.textInverse;
            case 'outline': return colors.primary[500];
            case 'ghost': return colors.primary[500];
            case 'danger': return colors.textInverse;
            default: return colors.textInverse;
        }
    };

    const getBorderColor = (): string => {
        if (disabled) return colors.textTertiary;
        switch (variant) {
            case 'outline': return colors.primary[500];
            case 'ghost': return 'transparent';
            default: return 'transparent';
        }
    };

    const getPadding = (): { vertical: number; horizontal: number } => {
        switch (size) {
            case 'sm': return { vertical: 8, horizontal: 16 };
            case 'md': return { vertical: 12, horizontal: 24 };
            case 'lg': return { vertical: 16, horizontal: 32 };
        }
    };

    const getFontSize = (): number => {
        switch (size) {
            case 'sm': return 14;
            case 'md': return 16;
            case 'lg': return 18;
        }
    };

    const padding = getPadding();

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
            style={[
                styles.button,
                {
                    backgroundColor: getBackgroundColor(),
                    borderColor: getBorderColor(),
                    paddingVertical: padding.vertical,
                    paddingHorizontal: padding.horizontal,
                },
                variant === 'outline' && styles.outlineButton,
                fullWidth && styles.fullWidth,
                style,
            ]}
            accessibilityLabel={accessibilityLabel || title}
            accessibilityRole="button"
            accessibilityState={{ disabled }}
        >
            {loading ? (
                <ActivityIndicator color={getTextColor()} size="small" />
            ) : (
                <>
                    {leftIcon}
                    <Text
                        style={[
                            styles.text,
                            {
                                color: getTextColor(),
                                fontSize: getFontSize(),
                            },
                            textStyle,
                        ]}
                    >
                        {title}
                    </Text>
                    {rightIcon}
                </>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        gap: 8,
        minHeight: 44,
    },
    outlineButton: {
        borderWidth: 1.5,
    },
    fullWidth: {
        width: '100%',
    },
    text: {
        fontWeight: '600',
        textAlign: 'center',
    },
});
