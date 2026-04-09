/**
 * Notification Store
 *
 * Zustand state management for notifications.
 *
 * @module notifications/notificationStore
 */
import { create } from 'zustand';
import { notificationService } from './services/notificationService';
import type {
    NotificationItem,
    NotificationSettings,
} from './types/notification.types';

/**
 * Default notification settings
 */
const defaultSettings: NotificationSettings = {
    pushEnabled: true,
    emailEnabled: true,
    inAppEnabled: true,
    soundEnabled: true,
    vibrationEnabled: true,
    quietHoursEnabled: false,
    channels: [
        { id: 'default', name: 'General', enabled: true, pushEnabled: true, emailEnabled: true },
        { id: 'alerts', name: 'Alerts', enabled: true, pushEnabled: true, emailEnabled: true },
        { id: 'messages', name: 'Messages', enabled: true, pushEnabled: true, emailEnabled: true },
    ],
};

/**
 * Notification store with Zustand
 */
export const useNotificationStore = create<{
    notifications: NotificationItem[];
    unreadCount: number;
    isLoading: boolean;
    error: string | null;
    fcmToken: string | null;
    settings: NotificationSettings;

    fetchNotifications: (userId: string) => Promise<void>;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: (userId: string) => Promise<void>;
    deleteNotification: (id: string) => Promise<void>;
    registerForPushNotifications: () => Promise<void>;
    updateSettings: (settings: Partial<NotificationSettings>) => Promise<void>;
    clearError: () => void;
    addNotification: (notification: NotificationItem) => void;
}>((set, get) => ({
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    error: null,
    fcmToken: null,
    settings: defaultSettings,

    fetchNotifications: async (userId: string) => {
        set({ isLoading: true, error: null });
        try {
            const { notifications, total } = await notificationService.fetchNotifications(userId);
            const unreadCount = notifications.filter((n) => !n.read).length;
            set({ notifications, unreadCount, isLoading: false });
        } catch (error) {
            set({
                isLoading: false,
                error: error instanceof Error ? error.message : 'Failed to fetch notifications',
            });
        }
    },

    markAsRead: async (id: string) => {
        try {
            await notificationService.markAsRead(id);
            const notifications = get().notifications.map((n) =>
                n.id === id ? { ...n, read: true, readAt: new Date().toISOString() } : n
            );
            const unreadCount = notifications.filter((n) => !n.read).length;
            set({ notifications, unreadCount });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to mark as read' });
        }
    },

    markAllAsRead: async (userId: string) => {
        try {
            await notificationService.markAllAsRead(userId);
            const notifications = get().notifications.map((n) => ({
                ...n,
                read: true,
                readAt: new Date().toISOString(),
            }));
            set({ notifications, unreadCount: 0 });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to mark all as read' });
        }
    },

    deleteNotification: async (id: string) => {
        try {
            await notificationService.deleteNotification(id);
            const notifications = get().notifications.filter((n) => n.id !== id);
            const unreadCount = notifications.filter((n) => !n.read).length;
            set({ notifications, unreadCount });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to delete notification' });
        }
    },

    registerForPushNotifications: async () => {
        try {
            const token = await notificationService.registerForPushNotifications();
            set({ fcmToken: token });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to register for push notifications' });
        }
    },

    updateSettings: async (newSettings: Partial<NotificationSettings>) => {
        try {
            const settings = { ...get().settings, ...newSettings };
            set({ settings });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to update settings' });
        }
    },

    clearError: () => set({ error: null }),

    addNotification: (notification: NotificationItem) => {
        const notifications = [notification, ...get().notifications];
        const unreadCount = notifications.filter((n) => !n.read).length;
        set({ notifications, unreadCount });
    },
}));