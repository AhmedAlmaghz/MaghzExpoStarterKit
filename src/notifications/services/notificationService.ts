/**
 * Notification Service
 *
 * Handles local and push notifications using Expo Notifications.
 *
 * @module notifications/services/notificationService
 */
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { storage } from '@/lib/storage';
import { STORAGE_KEYS, NOTIFICATION_CHANNELS } from '@/lib/constants';
import { supabase } from '@/lib/supabase';
import type { NotificationItem, FCMTokenData } from '../types/notification.types';

/**
 * Configure notification handler
 */
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

/**
 * Notification service class
 */
class NotificationService {
    /**
     * Request notification permissions
     * @returns Whether permissions were granted
     */
    async requestPermissions(): Promise<boolean> {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();

        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        return finalStatus === 'granted';
    }

    /**
     * Register for push notifications and get FCM token
     * @returns Push notification token or null
     */
    async registerForPushNotifications(): Promise<string | null> {
        try {
            const hasPermission = await this.requestPermissions();

            if (!hasPermission) {
                return null;
            }

            const { data: tokenData } = await Notifications.getExpoPushTokenAsync({
                projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
            });

            if (tokenData) {
                // Store token locally
                await storage.setItem(STORAGE_KEYS.FCM_TOKEN, tokenData);

                // Store token on server
                const tokenRecord: FCMTokenData = {
                    token: tokenData,
                    platform: Platform.OS,
                    updatedAt: new Date().toISOString(),
                };

                await supabase
                    .from('user_devices')
                    .upsert({
                        token: tokenData,
                        platform: Platform.OS,
                        updated_at: tokenRecord.updatedAt,
                    });

                return tokenData;
            }

            return null;
        } catch {
            return null;
        }
    }

    /**
     * Schedule a local notification
     * @param title - Notification title
     * @param body - Notification body
     * @param data - Additional data
     * @param trigger - When to show the notification
     */
    async scheduleLocalNotification(
        title: string,
        body: string,
        data?: Record<string, unknown>,
        trigger?: Notifications.NotificationTriggerInput
    ): Promise<string> {
        return await Notifications.scheduleNotificationAsync({
            content: {
                title,
                body,
                data,
                sound: true,
            },
            trigger: trigger || null,
        });
    }

    /**
     * Send immediate local notification
     * @param title - Notification title
     * @param body - Notification body
     * @param data - Additional data
     */
    async sendLocalNotification(
        title: string,
        body: string,
        data?: Record<string, unknown>
    ): Promise<string> {
        return await Notifications.scheduleNotificationAsync({
            content: {
                title,
                body,
                data,
                sound: true,
            },
            trigger: null,
        });
    }

    /**
     * Cancel a scheduled notification
     * @param id - Notification identifier
     */
    async cancelNotification(id: string): Promise<void> {
        await Notifications.cancelScheduledNotificationAsync(id);
    }

    /**
     * Cancel all scheduled notifications
     */
    async cancelAllNotifications(): Promise<void> {
        await Notifications.cancelAllScheduledNotificationsAsync();
    }

    /**
     * Get all scheduled notifications
     */
    async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
        return await Notifications.getAllScheduledNotificationsAsync();
    }

    /**
     * Set badge count (iOS only)
     * @param count - Badge count
     */
    async setBadgeCount(count: number): Promise<void> {
        await Notifications.setBadgeCountAsync(count);
    }

    /**
     * Get badge count
     */
    async getBadgeCount(): Promise<number> {
        return await Notifications.getBadgeCountAsync();
    }

    /**
     * Fetch notifications from server
     * @param userId - User ID
     * @param page - Page number
     * @param pageSize - Items per page
     */
    async fetchNotifications(
        userId: string,
        page: number = 1,
        pageSize: number = 20
    ): Promise<{ notifications: NotificationItem[]; total: number }> {
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;

        const { data, error, count } = await supabase
            .from('notifications')
            .select('*', { count: 'exact' })
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .range(from, to);

        if (error) {
            throw new Error('Failed to fetch notifications');
        }

        return {
            notifications: (data || []) as unknown as NotificationItem[],
            total: count || 0,
        };
    }

    /**
     * Mark notification as read
     * @param id - Notification ID
     */
    async markAsRead(id: string): Promise<void> {
        const { error } = await supabase
            .from('notifications')
            .update({ read: true, read_at: new Date().toISOString() })
            .eq('id', id);

        if (error) {
            throw new Error('Failed to mark notification as read');
        }
    }

    /**
     * Mark all notifications as read for a user
     * @param userId - User ID
     */
    async markAllAsRead(userId: string): Promise<void> {
        const { error } = await supabase
            .from('notifications')
            .update({ read: true, read_at: new Date().toISOString() })
            .eq('user_id', userId)
            .eq('read', false);

        if (error) {
            throw new Error('Failed to mark all notifications as read');
        }
    }

    /**
     * Delete a notification
     * @param id - Notification ID
     */
    async deleteNotification(id: string): Promise<void> {
        const { error } = await supabase
            .from('notifications')
            .delete()
            .eq('id', id);

        if (error) {
            throw new Error('Failed to delete notification');
        }
    }

    /**
     * Get unread notification count
     * @param userId - User ID
     */
    async getUnreadCount(userId: string): Promise<number> {
        const { count, error } = await supabase
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('read', false);

        if (error) {
            return 0;
        }

        return count || 0;
    }

    /**
     * Subscribe to push notification received listener
     * @param listener - Callback when notification is received
     * @returns Subscription object
     */
    addNotificationReceivedListener(
        listener: (notification: Notifications.Notification) => void
    ) {
        return Notifications.addNotificationReceivedListener(listener);
    }

    /**
     * Subscribe to notification response listener (when user taps notification)
     * @param listener - Callback when notification is tapped
     * @returns Subscription object
     */
    addNotificationResponseReceivedListener(
        listener: (response: Notifications.NotificationResponse) => void
    ) {
        return Notifications.addNotificationResponseReceivedListener(listener);
    }
}

export const notificationService = new NotificationService();
