/**
 * Modal Component
 * 
 * A professional, animated modal for displaying forms and information overlays.
 * 
 * @module components/ui/Modal
 */
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal as RNModal,
    TouchableOpacity,
    Animated,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme/hooks/useTheme';

interface ModalProps {
    visible: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ visible, onClose, title, children }) => {
    const { colors } = useTheme();
    const [animation] = React.useState(new Animated.Value(0));

    React.useEffect(() => {
        if (visible) {
            Animated.spring(animation, {
                toValue: 1,
                useNativeDriver: true,
                tension: 50,
                friction: 7,
            }).start();
        } else {
            Animated.timing(animation, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    const translateY = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [Dimensions.get('window').height, 0],
    });

    return (
        <RNModal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableOpacity 
                style={styles.overlay} 
                activeOpacity={1} 
                onPress={onClose}
            >
                <View style={[styles.backdrop, { backgroundColor: 'rgba(0,0,0,0.5)' }]} />
            </TouchableOpacity>

            <Animated.View 
                style={[
                    styles.content, 
                    { 
                        backgroundColor: colors.background,
                        transform: [{ translateY }]
                    }
                ]}
            >
                <View style={[styles.header, { borderBottomColor: colors.border }]}>
                    <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                        <Ionicons name="close" size={24} color={colors.textSecondary} />
                    </TouchableOpacity>
                </View>
                <View style={styles.body}>
                    {children}
                </View>
            </Animated.View>
        </RNModal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
    },
    content: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        minHeight: '40%',
        maxHeight: '90%',
        paddingBottom: 40,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -5 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
    },
    closeBtn: {
        padding: 5,
    },
    body: {
        padding: 20,
    },
});
