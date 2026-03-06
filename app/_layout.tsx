import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { AppErrorBoundary } from '@/components/error/app-error-boundary';
import { AppTheme } from '@/constants/app-theme';
import { AppProvider } from '@/providers/app-provider';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <AppErrorBoundary>
      <AppProvider>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: AppTheme.colors.backgroundRaised,
            },
            headerTintColor: AppTheme.colors.text,
            headerTitleStyle: {
              fontWeight: '700',
            },
            contentStyle: {
              backgroundColor: AppTheme.colors.background,
            },
          }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="university/[id]" options={{ title: 'University Detail' }} />
          <Stack.Screen name="community/[postId]" options={{ title: 'Post Detail' }} />
          <Stack.Screen name="community/create" options={{ title: 'Create Post' }} />
          <Stack.Screen name="profile/edit" options={{ title: 'Edit Profile' }} />
          <Stack.Screen name="profile/notifications" options={{ title: 'Notifications' }} />
          <Stack.Screen name="profile/help" options={{ title: 'Help Center' }} />
          <Stack.Screen name="profile/about" options={{ title: 'About App' }} />
        </Stack>
        <StatusBar style="light" />
      </AppProvider>
    </AppErrorBoundary>
  );
}
