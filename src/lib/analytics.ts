/**
 * Analytics Service
 * Tracks user interactions and app events
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AnalyticsEvent {
  name: string;
  properties?: Record<string, unknown>;
  timestamp: number;
}

interface UserProperties {
  [key: string]: unknown;
}

class AnalyticsService {
  private isEnabled: boolean = __DEV__;
  private queue: AnalyticsEvent[] = [];
  private maxQueueSize: number = 100;
  private userId: string | null = null;
  private userProperties: UserProperties = {};

  /**
   * Initialize analytics service
   */
  async init(): Promise<void> {
    if (!this.isEnabled) return;

    try {
      // Load saved user ID if exists
      const savedUserId = await AsyncStorage.getItem('@analytics_user_id');
      if (savedUserId) {
        this.userId = savedUserId;
      }
    } catch (error) {
      console.error('Analytics init error:', error);
    }
  }

  /**
   * Enable or disable analytics
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  /**
   * Identify user
   */
  async identify(userId: string, properties?: UserProperties): Promise<void> {
    if (!this.isEnabled) return;

    this.userId = userId;
    this.userProperties = { ...this.userProperties, ...properties };

    try {
      await AsyncStorage.setItem('@analytics_user_id', userId);
      await this.track('$identify', { userId, ...properties });
    } catch (error) {
      console.error('Analytics identify error:', error);
    }
  }

  /**
   * Track user properties
   */
  async people(props: UserProperties): Promise<void> {
    if (!this.isEnabled) return;

    this.userProperties = { ...this.userProperties, ...props };
    await this.track('$people', props);
  }

  /**
   * Track an event
   */
  async track(name: string, properties?: Record<string, unknown>): Promise<void> {
    if (!this.isEnabled) return;

    const event: AnalyticsEvent = {
      name,
      properties: {
        ...this.userProperties,
        ...properties,
        userId: this.userId,
      },
      timestamp: Date.now(),
    };

    // Add to queue
    this.queue.push(event);

    // Trim queue if needed
    if (this.queue.length > this.maxQueueSize) {
      this.queue.shift();
    }

    // Log in development
    if (__DEV__) {
      console.log('[Analytics]', name, properties);
    }
  }

  /**
   * Track screen view
   */
  async trackScreen(name: string, properties?: Record<string, unknown>): Promise<void> {
    await this.track('$screen_view', { screen: name, ...properties });
  }

  /**
   * Get queued events
   */
  getQueue(): AnalyticsEvent[] {
    return [...this.queue];
  }

  /**
   * Clear all analytics data
   */
  async reset(): Promise<void> {
    this.queue = [];
    this.userId = null;
    this.userProperties = {};
    await AsyncStorage.removeItem('@analytics_user_id');
  }
}

// Export singleton instance
export const analytics = new AnalyticsService();

// Export types
export type { AnalyticsEvent, UserProperties };