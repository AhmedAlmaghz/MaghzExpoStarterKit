/**
 * Notification Types
 *
 * TypeScript type definitions for the notifications module.
 *
 * @module notifications/types
 */

/**
 * Notification type enum
 */
export type NotificationType = 'info' | 'warning' | 'error' | 'success';

/**
 * Notification priority
 */
export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

/**
 * Notification item
 */
export interface NotificationItem {
    id: string;
    userId: string;
    type: NotificationType;
    priority: NotificationPriority;
    title: string;
    message: string;
    data?: Record<string, unknown>;
    read: boolean;
    readAt?: string;
    actionUrl?: string;
    actionText?: string;
    scheduledFor?: string;
    sentAt?: string;
    createdAt: string;
}

/**
 * Notification settings per channel
 */
export interface NotificationSettings {
    pushEnabled: boolean;
    emailEnabled: boolean;
    inAppEnabled: boolean;
    soundEnabled: boolean;
    vibrationEnabled: boolean;
    quietHoursEnabled: boolean;
    quietHoursStart?: string;
    quietHoursEnd?: string;
    channels: NotificationChannel[];
}

/**
 * Notification channel settings
 */
export interface NotificationChannel {
    id: string;
    name: string;
    enabled: boolean;
    pushEnabled: boolean;
    emailEnabled: boolean;
}

/**
 * FCM token data
 */
export interface FCMTokenData {
    token: string;
    deviceId?: string;
    platform?: string;
    updatedAt: string;
}

/**
 * Notification state
 */
export interface NotificationState {
    notifications: NotificationItem[];
    unreadCount: number;
    isLoading: boolean;
    error: string | null;
    fcmToken: string | null;
    settings: NotificationSettings;
}

/**
 * Notification actions
 */
export interface NotificationActions {
    fetchNotifications: () => Promise<void>;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    deleteNotification: (id: string) => Promise<void>;
    registerForPushNotifications: () => Promise<void>;
    updateSettings: (settings: Partial<NotificationSettings>) => Promise<void>;
    clearError: () => void;
}

/**
 * Notification store type
 */
export type NotificationStore = NotificationState & NotificationActions;