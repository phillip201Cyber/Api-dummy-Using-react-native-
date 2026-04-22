import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { Image, Pressable } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { useSettings } from '@/src/context/settingpagecontext';
import { getAppColors } from '@/constants/theme';

export default function TabLayout() {
  const router = useRouter();
  const { settings } = useSettings();
  const colors = getAppColors(settings);

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.text,
        headerLeft: () => (
          <Image
            source={require('@/assets/images/makapoLogo.png')}
            style={{ width: 50, height: 50, marginLeft: 15 }}
            resizeMode="contain"
          />
        ),
        headerRight: () => (
          <Pressable onPress={() => router.push('/settings')} style={{ marginRight: 15 }}>
            <Ionicons name="settings-outline" size={24} color={colors.text} />
          </Pressable>
        ),
        tabBarButton: HapticTab,
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size ?? 24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="routes"
        options={{
          title: 'Routes',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map" size={size ?? 24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="record"
        options={{
          title: 'Record',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="radio-button-on" size={size ?? 24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="members"
        options={{
          title: 'Members',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={size ?? 24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="you"
        options={{
          title: 'You',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size ?? 24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
