/**
 * Statistics Service
 * Tracks app usage metrics and performance
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppStats {
  totalSessions: number;
  lastSessionDate: string;
  totalScreenViews: number;
  screenViewsPerSession: Record<string, number>;
  averageSessionDuration: number;
  totalSessionDuration: number;
  deviceInfo: {
    platform: string;
    osVersion?: string;
    appVersion: string;
    buildNumber?: string;
  };
  firstLaunchDate: string;
  lastUpdateDate: string;
}

interface SessionData {
  sessionId: string;
  startTime: number;
  endTime?: number;
  screenViews: string[];
}

class StatsService {
  private stats: AppStats | null = null;
  private currentSession: SessionData | null = null;
  private storageKey = '@app_stats';
  private sessionStorageKey = '@current_session';

  /**
   * Initialize stats service
   */
  async init(): Promise<void> {
    try {
      // Load existing stats
      const savedStats = await AsyncStorage.getItem(this.storageKey);
      if (savedStats) {
        this.stats = JSON.parse(savedStats);
      } else {
        this.stats = this.getDefaultStats();
      }

      // Check for ongoing session
      const savedSession = await AsyncStorage.getItem(this.sessionStorageKey);
      if (savedSession) {
        this.currentSession = JSON.parse(savedSession);
      }

      // Track new session if needed
      await this.startNewSessionIfNeeded();
    } catch (error) {
      console.error('Stats init error:', error);
      this.stats = this.getDefaultStats();
    }
  }

  /**
   * Get default stats
   */
  private getDefaultStats(): AppStats {
    return {
      totalSessions: 0,
      lastSessionDate: new Date().toISOString(),
      totalScreenViews: 0,
      screenViewsPerSession: {},
      averageSessionDuration: 0,
      totalSessionDuration: 0,
      deviceInfo: {
        platform: 'unknown',
        appVersion: '1.0.0',
      },
      firstLaunchDate: new Date().toISOString(),
      lastUpdateDate: new Date().toISOString(),
    };
  }

  /**
   * Start new session if needed
   */
  async startNewSessionIfNeeded(): Promise<void> {
    if (!this.stats) return;

    const lastSession = new Date(this.stats.lastSessionDate);
    const now = new Date();
    const hoursSinceLastSession = (now.getTime() - lastSession.getTime()) / (1000 * 60 * 60);

    // Start new session if last session was more than 30 minutes ago
    if (hoursSinceLastSession > 0.5 || !this.currentSession) {
      await this.startSession();
    }
  }

  /**
   * Start a new session
   */
  async startSession(): Promise<void> {
    if (!this.stats) return;

    // End current session if exists
    if (this.currentSession) {
      await this.endSession();
    }

    // Create new session
    this.currentSession = {
      sessionId: this.generateSessionId(),
      startTime: Date.now(),
      screenViews: [],
    };

    // Update stats
    this.stats.totalSessions += 1;
    this.stats.lastSessionDate = new Date().toISOString();
    this.stats.lastUpdateDate = new Date().toISOString();

    await this.save();
    await this.saveSession();
  }

  /**
   * End current session
   */
  async endSession(): Promise<void> {
    if (!this.currentSession || !this.stats) return;

    this.currentSession.endTime = Date.now();
    const sessionDuration = this.currentSession.endTime - this.currentSession.startTime;

    // Update stats
    this.stats.totalSessionDuration += sessionDuration;
    this.stats.averageSessionDuration =
      this.stats.totalSessionDuration / this.stats.totalSessions;

    // Clean up
    this.currentSession = null;
    await AsyncStorage.removeItem(this.sessionStorageKey);
    await this.save();
  }

  /**
   * Track screen view
   */
  async trackScreen(screenName: string): Promise<void> {
    if (!this.stats || !this.currentSession) return;

    // Add screen to current session
    this.currentSession.screenViews.push(screenName);

    // Update global stats
    this.stats.totalScreenViews += 1;
    this.stats.screenViewsPerSession[screenName] =
      (this.stats.screenViewsPerSession[screenName] || 0) + 1;

    await this.saveSession();
    await this.save();
  }

  /**
   * Generate session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Save stats to storage
   */
  private async save(): Promise<void> {
    if (!this.stats) return;
    try {
      await AsyncStorage.setItem(this.storageKey, JSON.stringify(this.stats));
    } catch (error) {
      console.error('Stats save error:', error);
    }
  }

  /**
   * Save session to storage
   */
  private async saveSession(): Promise<void> {
    if (!this.currentSession) return;
    try {
      await AsyncStorage.setItem(
        this.sessionStorageKey,
        JSON.stringify(this.currentSession)
      );
    } catch (error) {
      console.error('Session save error:', error);
    }
  }

  /**
   * Get current stats
   */
  async getStats(): Promise<AppStats | null> {
    return this.stats;
  }

  /**
   * Reset all stats
   */
  async reset(): Promise<void> {
    this.stats = this.getDefaultStats();
    this.currentSession = null;
    await AsyncStorage.removeItem(this.storageKey);
    await AsyncStorage.removeItem(this.sessionStorageKey);
  }

  /**
   * Get engagement score (0-100)
   */
  getEngagementScore(): number {
    if (!this.stats || this.stats.totalSessions === 0) return 0;

    // Calculate engagement based on sessions, screen views, and session duration
    const sessionScore = Math.min(this.stats.totalSessions / 10, 1) * 33;
    const screenScore = Math.min(this.stats.totalScreenViews / 50, 1) * 33;
    const durationScore = Math.min(this.stats.averageSessionDuration / 300000, 1) * 34;

    return Math.round(sessionScore + screenScore + durationScore);
  }
}

// Export singleton instance
export const stats = new StatsService();

// Export types
export type { AppStats, SessionData };