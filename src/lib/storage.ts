/**
 * Secure Storage Utility
 *
 * Provides in-memory storage for the application.
 * For production, replace with SecureStore/AsyncStorage after native build.
 *
 * @module lib/storage
 */
const memoryStorage: Record<string, string> = {};

/**
 * Storage type options
 */
type StorageType = 'secure' | 'async';

/**
 * Storage utility class for managing persistent data
 */
class StorageService {
  /**
   * Store a value
   */
  async setItem<T>(
    key: string,
    value: T,
    type: StorageType = 'async',
  ): Promise<void> {
    const serialized = JSON.stringify(value);
    memoryStorage[key] = serialized;
  }

  /**
   * Retrieve a value from storage
   */
  async getItem<T>(
    key: string,
    type: StorageType = 'async',
  ): Promise<T | null> {
    const serialized = memoryStorage[key];
    if (!serialized) return null;
    try {
      return JSON.parse(serialized) as T;
    } catch {
      return null;
    }
  }

  /**
   * Remove a value from storage
   */
  async removeItem(key: string, type: StorageType = 'async'): Promise<void> {
    delete memoryStorage[key];
  }

  /**
   * Clear all storage
   */
  async clearAsync(): Promise<void> {
    Object.keys(memoryStorage).forEach((key) => delete memoryStorage[key]);
  }

  /**
   * Get all keys
   */
  async getAllKeys(): Promise<readonly string[]> {
    return Object.keys(memoryStorage);
  }

  /**
   * Multi-get values
   */
  async multiGet<T>(keys: string[]): Promise<(T | null)[]> {
    return Promise.all(keys.map((key) => this.getItem<T>(key)));
  }

  /**
   * Multi-set values
   */
  async multiSet<T>(pairs: [string, T][]): Promise<void> {
    pairs.forEach(([key, value]) => this.setItem(key, value));
  }
}

export const storage = new StorageService();
