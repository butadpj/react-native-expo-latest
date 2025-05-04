import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import '../global.css';
import { Provider } from '@/Provider';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from 'react-native';
import { cn } from '@/lib/utils';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <Provider>
      <ThemedView className={cn(colorScheme === 'dark' && '', 'flex-1')}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemedView>
    </Provider>
  );
}
