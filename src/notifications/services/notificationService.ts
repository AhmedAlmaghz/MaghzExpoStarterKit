/**
 * Notification Service
 *
 * Handles local and push notifications using Expo Notifications.
 *
 * Gracefully degrades in Expo Go where push notifications are not
 * supported (SDK 53+). All methods check for availability before
 * calling native APIs.
 *
 * @module notifications/services/notificationService
 */
import { Platform } from 'react-native';
import { storage } from '@/lib/storage';
import { STORAGE_KEYS, NOTIFICATION_CHANNELS } from '@/lib/constants';
import { supabase } from '@/lib/supabase';
import type { NotificationItem, FCMTokenData } from '../types/notification.types';

/**
 * Dynamically import expo-notifications to avoid crashes in Expo Go
 * where the native module is not available (SDK 53+).
 */
let Notifications: typeof import('expo-notifications') | null = null;

async function ensureNotifications(): Promise<typeof import('expo-notifications') | null> {
    if (Notifications !== null) return Notifications;
    try {
        Notifications = await import('expo-notifications');
        // Configure handler only after successful import
        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowBanner: true,
                shouldShowList: true,
                shouldPlaySound: true,
                shouldSetBadge: true,
            }),
        });
        return Notifications;
    } catch (error) {
        console.warn(
            '[NotificationService] expo-notifications is not available. ' +
            'Push notifications require a development build. Running in limited mode.'
        );
        return null;
    }
}

/**
 * Check if push notifications are available
 */
async function isAvailable(): Promise<boolean> {
    const notif = await ensureNotifications();
    return notif !== null;
}

/**
 * Notification service class
 */
class NotificationService {
    /** Track initialization to avoid repeated warnings */
    private initialized = false;

    /**
     * Request notification permissions
     * @returns Whether permissions were granted
     */
    async requestPermissions(): Promise<boolean> {
        const notif = await ensureNotifications();
        if (!notif) return false;

        try {
            const { status } = await notif.requestPermissionsAsync();
            return status === 'granted';
        } catch (error) {
            console.warn('[NotificationService] requestPermissions failed:', error);
            return false;
        }
    }

    /**
     * Register for push notifications and get FCM token
     * @returns FCM token data or null
     */
    async registerForPushNotifications(): Promise<FCMTokenData | null> {
        const notif = await ensureNotifications();
        if (!notif || Platform.OS === 'web') return null;

        try {
            const hasPermission = await this.requestPermissions();
            if (!hasPermission) return null;

            const tokenData = await notif.getExpoPushTokenAsync({
                projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
            });

            const fcmToken: FCMTokenData = {
                token: tokenData.data,
                platform: Platform.OS as 'ios' | 'android',
                updatedAt: new Date().toISOString(),
            };

            // Store token locally
            await storage.setItem(STORAGE_KEYS.FCM_TOKEN, fcmToken);

            // Update token on server
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                await supabase.from('user_devices').upsert({
                    user_id: user.id,
                    token: fcmToken.token,
                    platform: fcmToken.platform,
                    updated_at: fcmToken.updatedAt,
                });
            }

            return fcmToken;
        } catch (error) {
            console.warn('[NotificationService] registerForPushNotifications failed:', error);
            return null;
        }
    }

    /**
     * Schedule a local notification
     * @param title - Notification title
     * @param body - Notification body
     * @param data - Additional data
     * @param seconds - Delay in seconds
     */
    async scheduleLocalNotification(
        title: string,
        body: string,
        data?: Record<string, unknown>,
        seconds: number = 1
    ): Promise<string | null> {
        const notif = await ensureNotifications();
        if (!notif) return null;

        try {
            const id = await notif.scheduleNotificationAsync({
                content: { title, body, data },
                trigger: { type: 'timeInterval' as const, seconds },
            });
            return id;
        } catch (error) {
            console.warn('[NotificationService] scheduleLocalNotification failed:', error);
            return null;
        }
    }

    /**
     * Send a local notification immediately
     */
    async sendLocalNotification(
        title: string,
        body: string,
        data?: Record<string, unknown>
    ): Promise<string | null> {
        return this.scheduleLocalNotification(title, body, data, 1);
    }

    /**
     * Cancel a scheduled notification
     * @param id - Notification ID
     */
    async cancelNotification(id: string): Promise<void> {
        const notif = await ensureNotifications();
        if (!notif) return;

        try {
            await notif.cancelScheduledNotificationAsync(id);
        } catch (error) {
            console.warn('[NotificationService] cancelNotification failed:', error);
        }
    }

    /**
     * Cancel all scheduled notifications
     */
    async cancelAllNotifications(): Promise<void> {
        const notif = await ensureNotifications();
        if (!notif) return;

        try {
            await notif.cancelAllScheduledNotificationsAsync();
        } catch (error) {
            console.warn('[NotificationService] cancelAllNotifications failed:', error);
        }
    }

    /**
     * Set the app badge count (iOS only)
     * @param count - Badge count
     */
    async setBadgeCount(count: number): Promise<void> {
        const notif = await ensureNotifications();
        if (!notif) return;

        try {
            await notif.setBadgeCountAsync(count);
        } catch (error) {
            console.warn('[NotificationService] setBadgeCount failed:', error);
        }
    }

    /**
     * Fetch notifications from the server
     * @param limit - Maximum number of notifications to fetch
     * @param offset - Offset for pagination
     */
    async fetchNotifications(limit: number = 20, offset: number = 0): Promise<NotificationItem[]> {
        try {
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .order('created_at', { ascending: false })
                .range(offset, offset + limit - 1);

            if (error) throw error;
            return (data || []) as NotificationItem[];
        } catch (error) {
            console.warn('[NotificationService] fetchNotifications failed:', error);
            return [];
        }
    }

    /**
     * Mark a notification as read
     * @param id - Notification ID
     */
    async markAsRead(id: string): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('notifications')
                .update({ read: true })
                .eq('id', id);

            if (error) throw error;
            return true;
        } catch (error) {
            console.warn('[NotificationService] markAsRead failed:', error);
            return false;
        }
    }

    /**
     * Mark all notifications as read
     */
    async markAllAsRead(): Promise<boolean> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return false;

            const { error } = await supabase
                .from('notifications')
                .update({ read: true })
                .eq('user_id', user.id)
                .eq('read', false);

            if (error) throw error;
            return true;
        } catch (error) {
            console.warn('[NotificationService] markAllAsRead failed:', error);
            return false;
        }
    }

    /**
     * Delete a notification
     * @param id - Notification ID
     */
    async deleteNotification(id: string): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('notifications')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return true;
        } catch (error) {
            console.warn('[NotificationService] deleteNotification failed:', error);
            return false;
        }
    }

    /**
     * Get unread notification count
     */
    async getUnreadCount(): Promise<number> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return 0;

            const { count, error } = await supabase
                .from('notifications')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id)
                .eq('read', false);

            if (error) throw error;
            return count || 0;
        } catch (error) {
            console.warn('[NotificationService] getUnreadCount failed:', error);
            return 0;
        }
    }

    /**
     * Add a listener for received notifications
     * @param listener - Callback function
     * @returns Subscription object or null
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async addNotificationReceivedListener(listener: (notification: any) => void): Promise<any> {
        const notif = await ensureNotifications();
        if (!notif) return null;

        try {
            return notif.addNotificationReceivedListener(listener);
        } catch (error) {
            console.warn('[NotificationService] addNotificationReceivedListener failed:', error);
            return null;
        }
    }

    /**
     * Add a listener for notification responses (when user taps notification)
     * @param listener - Callback function
     * @returns Subscription object or null
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async addNotificationResponseReceivedListener(listener: (response: any) => void): Promise<any> {
        const notif = await ensureNotifications();
        if (!notif) return null;

        try {
            return notif.addNotificationResponseReceivedListener(listener);
        } catch (error) {
            console.warn('[NotificationService] addNotificationResponseReceivedListener failed:', error);
            return null;
        }
    }
}

export const notificationService = new NotificationService();
