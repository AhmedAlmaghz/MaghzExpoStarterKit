/**
 * Auth Layout
 *
 * Layout for the authentication section of the app.
 * Contains login, register, and forgot-password screens.
 *
 * @module app/(auth)/_layout
 */
import { Stack } from 'expo-router';
import { useTheme } from '@/theme/hooks/useTheme';

export default function AuthLayout(): React.ReactElement {
  const { isDarkMode, colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
        },
        headerTintColor: isDarkMode ? '#f8fafc' : '#0f172a',
        contentStyle: {
          backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="login"
        options={{
          title: 'Login',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          title: 'Create Account',
        }}
      />
      <Stack.Screen
        name="forgot-password"
        options={{
          title: 'Reset Password',
        }}
      />
    </Stack>
  );
}
