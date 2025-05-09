import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import '../global.css';
import { Provider } from '@/Provider';
import { useColorScheme, View } from 'react-native';
import { useColorScheme as useNativeColorScheme } from 'nativewind';
import { cn } from '@/lib/utils';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const { setColorScheme } = useNativeColorScheme();

  setColorScheme(colorScheme as 'light' | 'dark');

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <Provider>
      <View className={cn(colorScheme === 'dark' && 'dark', 'flex-1')}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
          <Stack.Screen name="movie" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </View>
    </Provider>
  );
}
