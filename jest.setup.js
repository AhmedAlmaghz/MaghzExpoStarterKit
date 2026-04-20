/**
 * Jest Setup File
 * Mocking and setup for tests
 */

// Mock MMKV
jest.mock('react-native-mmkv', () => ({
  MMKV: jest.fn().mockImplementation(() => ({
    getString: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
    contains: jest.fn(),
    getAllKeys: jest.fn(),
    clearAll: jest.fn(),
  })),
}));

// Mock expo-analytics
jest.mock('expo-analytics', () => ({
  Analytics: {
    setUser: jest.fn(),
    trackEvent: jest.fn(),
  },
}));

// Mock expo-crash-reporting
jest.mock('expo-crash-reporting', () => ({
  enableCrashReporting: jest.fn(),
  crashAsync: jest.fn(),
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
    getAllKeys: jest.fn(),
    multiGet: jest.fn(),
    multiSet: jest.fn(),
    multiRemove: jest.fn(),
  },
}));

// Mock notifications
jest.mock('expo-notifications', () => ({
  setNotificationChannelAsync: jest.fn(),
  requestPermissionsAsync: jest.fn(),
  getExpoPushTokenAsync: jest.fn(),
}));

// Silence console warnings in tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock fetch
global.fetch = jest.fn();

// Mock Animated
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');