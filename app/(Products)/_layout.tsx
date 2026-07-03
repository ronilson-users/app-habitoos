import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: true }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />

      <Tabs.Screen
        name="scan"
        options={{
          title: 'Scan',
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          href: null,
          tabBarStyle: {
            display: 'none',
          },
        }}
      />

      <Tabs.Screen
        name="(Products)"
        options={{
          title: 'Lista',
          href: null,
          tabBarStyle: {
            display: 'none',
          },
        }}
      />
    </Tabs>
  );
}