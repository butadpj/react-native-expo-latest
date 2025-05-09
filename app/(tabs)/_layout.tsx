import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, useColorScheme, View } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { ThemedView } from '@/components/ThemedView';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarBackground: () => <ThemedView className="w-full flex-1" />,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: colorScheme === 'dark' ? '#9084d2' : '#5209b0',
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="(home)/index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="menu/index"
        options={{
          title: 'Menu',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="menubar.rectangle" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
