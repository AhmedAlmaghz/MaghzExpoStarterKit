/**
 * Root Layout - MINIMAL VERSION FOR DEBUGGING
 */
import React, { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, Button } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

// Prevent auto hide
SplashScreen.preventAutoHideAsync().catch(() => { });

// Simple theme colors
const colors = {
    background: '#0f172a',
    text: '#f8fafc',
    primary: '#3b82f6'
};

export default function RootLayout(): React.ReactElement {
    const [isReady, setIsReady] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // Hide splash immediately and show app
    useEffect(() => {
        const init = async () => {
            try {
                await SplashScreen.hideAsync();
                console.log('[DEBUG] Splash hidden');
                setIsReady(true);
            } catch (e) {
                console.error('[DEBUG] Splash hide error:', e);
                setError(String(e));
                setIsReady(true);
            }
        };

        // Small delay to ensure native splash is rendered
        setTimeout(init, 500);
    }, []);

    if (!isReady) {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Loading...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Error Starting App</Text>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <Text style={styles.title}>App Started Successfully!</Text>
            <Text style={styles.text}>If you see this, the app is working.</Text>
            <View style={styles.buttonContainer}>
                <Button
                    title="Go to Main"
                    onPress={() => router.push('/(main)')}
                    color={colors.primary}
                />
            </View>
            <View style={styles.buttonContainer}>
                <Button
                    title="Go to Home"
                    onPress={() => router.push('/')}
                    color={colors.primary}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 20,
    },
    text: {
        fontSize: 16,
        color: colors.text,
        textAlign: 'center',
        marginBottom: 20,
    },
    errorText: {
        fontSize: 14,
        color: '#ef4444',
        textAlign: 'center',
        marginTop: 10,
    },
    buttonContainer: {
        marginVertical: 10,
        width: 200,
    },
});
