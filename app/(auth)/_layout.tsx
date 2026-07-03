//2026/habitoos/app/(auth)/_layout.tsx

import { Tabs } from 'expo-router';
import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

export default function AuthLayout() {
 
  return (
    <Stack screenOptions={{ 
      headerShown: false,
    
        
    }}>
      <Stack.Screen name="signin" />
      <Stack.Screen name="signup" />

       <StatusBar style="auto" />
    </Stack>
  );
}