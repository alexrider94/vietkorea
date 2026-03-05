import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { AppTheme } from '@/constants/app-theme';

const iconMap: Record<string, React.ComponentProps<typeof MaterialIcons>['name']> = {
  index: 'home-filled',
  community: 'forum',
  university: 'school',
  profile: 'person',
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: AppTheme.colors.accent,
        tabBarInactiveTintColor: AppTheme.colors.textMuted,
        tabBarStyle: {
          backgroundColor: AppTheme.colors.backgroundRaised,
          borderTopColor: AppTheme.colors.border,
          borderTopWidth: 1,
          height: 72,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginBottom: 6,
        },
        tabBarIcon: ({ color, size }) => (
          <MaterialIcons name={iconMap[route.name]} color={color} size={size} />
        ),
      })}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: 'Community',
        }}
      />
      <Tabs.Screen
        name="university"
        options={{
          title: 'University',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
        }}
      />
    </Tabs>
  );
}
