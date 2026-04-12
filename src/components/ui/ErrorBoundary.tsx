/**
 * Error Boundary Component
 *
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI.
 *
 * @module components/ui/ErrorBoundary
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

interface Props {
    children: React.ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('[ErrorBoundary] Caught an error:', error, errorInfo);
        this.setState({ error, errorInfo });

        // Log to console for debugging
        console.log('Error details:', {
            message: error.message,
            stack: error.stack,
            componentStack: errorInfo.componentStack,
        });
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <View style={styles.container}>
                    <ScrollView contentContainerStyle={styles.content}>
                        <Text style={styles.title}>Something went wrong</Text>
                        <Text style={styles.subtitle}>
                            The app encountered an unexpected error.
                        </Text>

                        <View style={styles.errorBox}>
                            <Text style={styles.errorTitle}>Error:</Text>
                            <Text style={styles.errorText}>
                                {this.state.error?.message || 'Unknown error'}
                            </Text>
                        </View>

                        {this.state.errorInfo && (
                            <View style={styles.errorBox}>
                                <Text style={styles.errorTitle}>Component Stack:</Text>
                                <Text style={styles.stackText}>
                                    {this.state.errorInfo.componentStack}
                                </Text>
                            </View>
                        )}

                        <TouchableOpacity style={styles.button} onPress={this.handleReset}>
                            <Text style={styles.buttonText}>Try Again</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
    },
    content: {
        padding: 20,
        paddingTop: 60,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#f8fafc',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#94a3b8',
        marginBottom: 30,
        textAlign: 'center',
    },
    errorBox: {
        backgroundColor: '#1e293b',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#ef4444',
    },
    errorTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#ef4444',
        marginBottom: 8,
    },
    errorText: {
        fontSize: 14,
        color: '#f8fafc',
        fontFamily: 'monospace',
    },
    stackText: {
        fontSize: 12,
        color: '#94a3b8',
        fontFamily: 'monospace',
    },
    button: {
        backgroundColor: '#3b82f6',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
