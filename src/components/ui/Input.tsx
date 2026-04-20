/**
 * Input Component
 *
 * Reusable text input with label, error, and icon support.
 * Theme-aware with proper focus states and colors.
 *
 * @module components/ui/Input
 */
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    type ViewStyle,
    type TextStyle,
    type KeyboardType,
} from 'react-native';
import { useTheme } from '@/theme/hooks/useTheme';

interface InputProps {
    /** Input label */
    label?: string;
    /** Input value */
    value: string;
    /** Change handler */
    onChangeText: (text: string) => void;
    /** Placeholder text */
    placeholder?: string;
    /** Whether input is secure (password) */
    secureTextEntry?: boolean;
    /** Whether input is disabled */
    disabled?: boolean;
    /** Whether input has error */
    error?: string;
    /** Keyboard type */
    keyboardType?: KeyboardType;
    /** Auto capitalize */
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    /** Auto complete type */
    autoComplete?: 'email' | 'password' | 'name' | 'username' | 'tel' | 'off';
    /** Left icon */
    leftIcon?: React.ReactNode;
    /** Right icon/action */
    rightIcon?: React.ReactNode;
    /** On right icon press */
    onRightIconPress?: () => void;
    /** Multiline input */
    multiline?: boolean;
    /** Number of lines for multiline */
    numberOfLines?: number;
    /** Maximum length of input */
    maxLength?: number;
    /** Custom container style */
    containerStyle?: ViewStyle;
    /** Custom input style */
    inputStyle?: TextStyle;
    /** Focus handler */
    onFocus?: () => void;
    /** Blur handler */
    onBlur?: () => void;
}

/**
 * Input component
 */
export function Input({
    label,
    value,
    onChangeText,
    placeholder,
    secureTextEntry = false,
    disabled = false,
    error,
    keyboardType = 'default',
    autoCapitalize = 'sentences',
    autoComplete = 'off',
    leftIcon,
    rightIcon,
    onRightIconPress,
    multiline = false,
    numberOfLines = 1,
    maxLength,
    containerStyle,
    inputStyle,
    onFocus,
    onBlur,
}: InputProps): React.ReactElement {
    const { colors, isDarkMode } = useTheme();
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => {
        setIsFocused(true);
        onFocus?.();
    };

    const handleBlur = () => {
        setIsFocused(false);
        onBlur?.();
    };

    const getBorderColor = (): string => {
        if (error) return colors.error[500];
        if (isFocused) return colors.inputFocusBorder;
        return colors.inputBorder;
    };

    const getBackgroundColor = (): string => {
        if (isFocused) return colors.inputFocusBackground;
        if (disabled) return colors.surfaceVariant;
        return colors.inputBackground;
    };

    return (
        <View style={[styles.container, containerStyle]}>
            {label && (
                <Text style={[styles.label, { color: colors.text }]}>
                    {label}
                </Text>
            )}
            <View
                style={[
                    styles.inputWrapper,
                    {
                        backgroundColor: getBackgroundColor(),
                        borderColor: getBorderColor(),
                    },
                    isFocused && styles.inputFocused,
                    error && styles.inputError,
                ]}
            >
                {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={colors.textTertiary}
                    secureTextEntry={!!secureTextEntry}
                    editable={!disabled}
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                    autoComplete={autoComplete}
                    multiline={!!multiline}
                    numberOfLines={numberOfLines}
                    maxLength={maxLength}
                    style={[
                        styles.input,
                        { color: colors.text },
                        leftIcon ? styles.inputWithLeftIcon : undefined,
                        rightIcon ? styles.inputWithRightIcon : undefined,
                        multiline ? styles.multilineInput : undefined,
                        inputStyle,
                    ]}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />
                {rightIcon && (
                    <TouchableOpacity
                        onPress={onRightIconPress}
                        style={styles.rightIcon}
                        disabled={!onRightIconPress}
                    >
                        {rightIcon}
                    </TouchableOpacity>
                )}
            </View>
            {error && (
                <Text style={[styles.errorText, { color: colors.error[500] }]}>
                    {error}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 6,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderRadius: 12,
        minHeight: 48,
    },
    inputFocused: {
        borderWidth: 2,
    },
    inputError: {
        borderWidth: 2,
    },
    leftIcon: {
        paddingLeft: 12,
        justifyContent: 'center',
    },
    input: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
    },
    inputWithLeftIcon: {
        paddingLeft: 8,
    },
    inputWithRightIcon: {
        paddingRight: 8,
    },
    multilineInput: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
    rightIcon: {
        paddingRight: 12,
        justifyContent: 'center',
    },
    errorText: {
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
});
