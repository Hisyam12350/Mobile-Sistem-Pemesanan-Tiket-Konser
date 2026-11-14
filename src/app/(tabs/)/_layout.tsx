import { Image, useColorScheme } from 'react-native';
import { Tabs } from 'expo-router';

import { Colors } from '@/constants/theme';

export default function TabsLayout() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colors.background,
        },
        tabBarLabelStyle: {
          color: colors.text,
        },
      }}>
    <Tabs.Screen
      name="index"
      options={{
        title: 'Home',
        tabBarIcon: ({ color, size }) => (
          <Image
            source={require('@/assets/images/tabIcons/home.png')}
            style={{ width: size, height: size, tintColor: color }}
          />
        ),
      }}
    />
    <Tabs.Screen
      name="explore"
      options={{
        title: 'Explore',
        tabBarIcon: ({ color, size }) => (
          <Image
            source={require('@/assets/images/tabIcons/explore.png')}
            style={{ width: size, height: size, tintColor: color }}
          />
        ),
      }}
    />
    </Tabs>
  );
}