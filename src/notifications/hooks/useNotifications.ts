/**
 * useNotifications Hook
 *
 * Custom hook for accessing notification state and actions.
 *
 * @module notifications/hooks/useNotifications
 */
import { useEffect } from 'react';
import { useNotificationStore } from '../notificationStore';
import { notificationService } from '../services/notificationService';
import type { NotificationItem } from '../types/notification.types';

/**
 * Hook for notification state and actions
 */
export function useNotifications(userId?: string) {
    const notifications = useNotificationStore((s) => s.notifications);
    const unreadCount = useNotificationStore((s) => s.unreadCount);
    const isLoading = useNotificationStore((s) => s.isLoading);
    const error = useNotificationStore((s) => s.error);
    const settings = useNotificationStore((s) => s.settings);
    const fetchNotifications = useNotificationStore((s) => s.fetchNotifications);
    const markAsRead = useNotificationStore((s) => s.markAsRead);
    const markAllAsRead = useNotificationStore((s) => s.markAllAsRead);
    const deleteNotification = useNotificationStore((s) => s.deleteNotification);
    const registerForPushNotifications = useNotificationStore((s) => s.registerForPushNotifications);
    const updateSettings = useNotificationStore((s) => s.updateSettings);
    const clearError = useNotificationStore((s) => s.clearError);
    const addNotification = useNotificationStore((s) => s.addNotification);

    /**
     * Fetch notifications on mount if userId provided
     */
    useEffect(() => {
        if (userId) {
            fetchNotifications(userId);
        }
    }, [userId, fetchNotifications]);

    /**
     * Listen for push notifications
     */
    useEffect(() => {
        const receivedSubscription = notificationService.addNotificationReceivedListener(
            (notification) => {
                const item: NotificationItem = {
                    id: notification.request.identifier,
                    userId: userId || '',
                    type: 'info',
                    priority: 'normal',
                    title: notification.request.content.title || '',
                    message: notification.request.content.body || '',
                    data: notification.request.content.data as Record<string, unknown>,
                    read: false,
                    createdAt: new Date().toISOString(),
                };
                addNotification(item);
            }
        );

        return () => {
            receivedSubscription.remove();
        };
    }, [userId, addNotification]);

    return {
        notifications,
        unreadCount,
        isLoading,
        error,
        settings,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        registerForPushNotifications,
        updateSettings,
        clearError,
    };
}