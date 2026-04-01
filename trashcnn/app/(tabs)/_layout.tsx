import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarItemStyle:{
          marginTop: 12
        }
      }}>
      
      <Tabs.Screen
        name="index"
        options={{
          title: 'Scan Trash',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="photo.badge.magnifyingglass.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="info"
        options={{
          title: 'Information',
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="info.circle.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <IconSymbol size={25} name="gearshape.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
