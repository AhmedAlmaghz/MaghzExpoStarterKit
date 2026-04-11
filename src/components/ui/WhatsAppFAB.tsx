import React from 'react';
import { TouchableOpacity, StyleSheet, Platform, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme/hooks/useTheme';

/**
 * WhatsApp Floating Action Button
 * 
 * Provides a quick way to message support or the service owner via WhatsApp.
 * Positioned on the bottom-left to avoid conflict with the Home FAB or system UI.
 */
export function WhatsAppFAB() {
    const { colors } = useTheme();
    const WHATSAPP_NUMBER = '967777777777'; // Yemen placeholder

    const handlePress = () => {
        const url = `https://wa.me/${WHATSAPP_NUMBER}`;
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                console.log("Don't know how to open URI: " + url);
            }
        });
    };

    return (
        <TouchableOpacity 
            style={[styles.fab, { backgroundColor: '#25D366' }]} // WhatsApp Green
            onPress={handlePress}
            activeOpacity={0.8}
        >
            <Ionicons name="logo-whatsapp" size={28} color="white" />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 100 : 85, // Above the tab bar area if visible, or safe bottom
        left: 20,
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
        zIndex: 1000,
    },
});
