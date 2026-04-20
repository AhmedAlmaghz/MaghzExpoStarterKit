/**
 * Error Handling Service
 * Centralized error handling and reporting
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

export enum ErrorLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
}

export enum ErrorCategory {
  NETWORK = 'network',
  AUTH = 'auth',
  DATABASE = 'database',
  VALIDATION = 'validation',
  RUNTIME = 'runtime',
  UI = 'ui',
  UNKNOWN = 'unknown',
}

export interface AppError {
  id: string;
  message: string;
  level: ErrorLevel;
  category: ErrorCategory;
  timestamp: number;
  stack?: string;
  context?: Record<string, unknown>;
  userId?: string;
  deviceInfo?: {
    platform: string;
    osVersion?: string;
    appVersion: string;
  };
}

export interface ErrorStats {
  totalErrors: number;
  errorsByCategory: Record<ErrorCategory, number>;
  errorsByLevel: Record<ErrorLevel, number>;
  lastErrorDate?: string;
}

class ErrorService {
  private errors: AppError[] = [];
  private maxErrors: number = 50;
  private storageKey = '@app_errors';
  private statsKey = '@error_stats';
  private listeners: Array<(error: AppError) => void> = [];

  /**
   * Initialize error service
   */
  async init(): Promise<void> {
    try {
      const savedErrors = await AsyncStorage.getItem(this.storageKey);
      if (savedErrors) {
        this.errors = JSON.parse(savedErrors);
      }
    } catch (error) {
      console.error('Error service init error:', error);
    }
  }

  /**
   * Subscribe to new errors
   */
  subscribe(listener: (error: AppError) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  /**
   * Create error ID
   */
  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Determine error category
   */
  private categorizeError(error: unknown): ErrorCategory {
    if (error instanceof Error) {
      const message = error.message.toLowerCase();
      if (message.includes('network') || message.includes('fetch') || message.includes('timeout')) {
        return ErrorCategory.NETWORK;
      }
      if (message.includes('auth') || message.includes('token') || message.includes('permission')) {
        return ErrorCategory.AUTH;
      }
      if (message.includes('database') || message.includes('sql') || message.includes('drizzle')) {
        return ErrorCategory.DATABASE;
      }
      if (message.includes('validation') || message.includes('invalid') || message.includes('required')) {
        return ErrorCategory.VALIDATION;
      }
    }
    return ErrorCategory.UNKNOWN;
  }

  /**
   * Log an error
   */
  async log(
    message: string,
    level: ErrorLevel = ErrorLevel.ERROR,
    context?: Record<string, unknown>,
    userId?: string
  ): Promise<AppError> {
    const error: AppError = {
      id: this.generateErrorId(),
      message,
      level,
      category: this.determineCategoryFromMessage(message),
      timestamp: Date.now(),
      context,
      userId,
    };

    // Add to errors array
    this.errors.unshift(error);

    // Trim if needed
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors);
    }

    // Save to storage
    await this.save();

    // Log to console in development
    if (__DEV__) {
      console.error(`[${level.toUpperCase()}] ${message}`, context);
    }

    // Notify listeners
    this.notifyListeners(error);

    return error;
  }

  /**
   * Log error from try-catch
   */
  async catch(
    error: unknown,
    context?: Record<string, unknown>,
    userId?: string
  ): Promise<AppError> {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    const stack = error instanceof Error ? error.stack : undefined;

    const appError: AppError = {
      id: this.generateErrorId(),
      message,
      level: ErrorLevel.ERROR,
      category: this.categorizeError(error),
      timestamp: Date.now(),
      stack,
      context,
      userId,
    };

    // Add to errors array
    this.errors.unshift(appError);

    // Trim if needed
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors);
    }

    // Save to storage
    await this.save();

    // Log to console
    console.error('[Error caught]', message, stack, context);

    // Notify listeners
    this.notifyListeners(appError);

    return appError;
  }

  /**
   * Categorize error from message
   */
  private determineCategoryFromMessage(message: string): ErrorCategory {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('network') || lowerMessage.includes('fetch') || lowerMessage.includes('timeout')) {
      return ErrorCategory.NETWORK;
    }
    if (lowerMessage.includes('auth') || lowerMessage.includes('token') || lowerMessage.includes('permission')) {
      return ErrorCategory.AUTH;
    }
    if (lowerMessage.includes('database') || lowerMessage.includes('sql') || lowerMessage.includes('drizzle')) {
      return ErrorCategory.DATABASE;
    }
    if (lowerMessage.includes('validation') || lowerMessage.includes('invalid') || lowerMessage.includes('required')) {
      return ErrorCategory.VALIDATION;
    }
    return ErrorCategory.UNKNOWN;
  }

  /**
   * Notify listeners
   */
  private notifyListeners(error: AppError): void {
    this.listeners.forEach((listener) => {
      try {
        listener(error);
      } catch (listenerError) {
        console.error('Error in error listener:', listenerError);
      }
    });
  }

  /**
   * Save errors to storage
   */
  private async save(): Promise<void> {
    try {
      await AsyncStorage.setItem(this.storageKey, JSON.stringify(this.errors));
    } catch (error) {
      console.error('Error save error:', error);
    }
  }

  /**
   * Get all errors
   */
  async getErrors(): Promise<AppError[]> {
    return [...this.errors];
  }

  /**
   * Get errors by level
   */
  async getErrorsByLevel(level: ErrorLevel): Promise<AppError[]> {
    return this.errors.filter((e) => e.level === level);
  }

  /**
   * Get errors by category
   */
  async getErrorsByCategory(category: ErrorCategory): Promise<AppError[]> {
    return this.errors.filter((e) => e.category === category);
  }

  /**
   * Get error statistics
   */
  async getStats(): Promise<ErrorStats> {
    const stats: ErrorStats = {
      totalErrors: this.errors.length,
      errorsByCategory: {
        [ErrorCategory.NETWORK]: 0,
        [ErrorCategory.AUTH]: 0,
        [ErrorCategory.DATABASE]: 0,
        [ErrorCategory.VALIDATION]: 0,
        [ErrorCategory.RUNTIME]: 0,
        [ErrorCategory.UI]: 0,
        [ErrorCategory.UNKNOWN]: 0,
      },
      errorsByLevel: {
        [ErrorLevel.DEBUG]: 0,
        [ErrorLevel.INFO]: 0,
        [ErrorLevel.WARNING]: 0,
        [ErrorLevel.ERROR]: 0,
        [ErrorLevel.CRITICAL]: 0,
      },
    };

    this.errors.forEach((error) => {
      stats.errorsByCategory[error.category]++;
      stats.errorsByLevel[error.level]++;
    });

    if (this.errors.length > 0) {
      stats.lastErrorDate = new Date(this.errors[0].timestamp).toISOString();
    }

    return stats;
  }

  /**
   * Clear all errors
   */
  async clearErrors(): Promise<void> {
    this.errors = [];
    await AsyncStorage.removeItem(this.storageKey);
  }

  /**
   * Get error by ID
   */
  async getErrorById(id: string): Promise<AppError | undefined> {
    return this.errors.find((e) => e.id === id);
  }
}

// Export singleton instance
export const errorService = new ErrorService();

// Export helper function for quick error catching
export const logError = (
  message: string,
  level?: ErrorLevel,
  context?: Record<string, unknown>,
  userId?: string
) => errorService.log(message, level, context, userId);

// Export helper for try-catch
export const handleError = async (
  error: unknown,
  context?: Record<string, unknown>,
  userId?: string
) => errorService.catch(error, context, userId);