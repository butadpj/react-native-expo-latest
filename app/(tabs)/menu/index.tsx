import { ScrollView, View, Linking, Pressable } from 'react-native';
import Constants from 'expo-constants';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

const appVersion = Constants.expoConfig?.version || '1.0.0';
const appName = 'Movie Discovery App';

const GITHUB_REPO_URL = 'https://github.com/butadpj/react-native-expo-latest';

export default function MenuScreen() {
  return (
    <ThemedView className="flex-1">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 30 }} // Add some padding at the bottom
        showsVerticalScrollIndicator={false}
      >
        <View className="p-6">
          <ThemedText type="title" className="mb-2 text-center text-3xl">
            {appName}
          </ThemedText>
          <ThemedText className="mb-8 text-center text-neutral-400">
            Version {appVersion}
          </ThemedText>

          <View className="border-border mb-6 rounded-lg border bg-accent-light p-4 dark:bg-accent-dark">
            <ThemedText type="subtitle" className="mb-2">
              About This Project
            </ThemedText>
            <ThemedText className="text-sm leading-relaxed">
              This application is a demonstration of building a movie discovery
              app using modern React Native technologies. Showcasing features
              like Styling, Dark mode, Data fetching, and Secure API key
              handling.
            </ThemedText>
          </View>

          <View className="border-border mb-6 rounded-lg border bg-accent-light p-4 dark:bg-accent-dark">
            <ThemedText type="subtitle" className="mb-3">
              Key Technologies Used
            </ThemedText>
            <View className="space-y-1.5">
              <ThemedText className="text-sm">
                • React Native (with Expo)
              </ThemedText>
              <ThemedText className="text-sm">• TypeScript</ThemedText>
              <ThemedText className="text-sm">
                • NativeWind (Tailwind CSS)
              </ThemedText>
              <ThemedText className="text-sm">
                • TanStack Query (React Query)
              </ThemedText>
              <ThemedText className="text-sm">• Expo Router</ThemedText>
              <ThemedText className="text-sm">
                • Deno & Hono (Backend Proxy)
              </ThemedText>
              <ThemedText className="text-sm">
                • TMDB API (for movie data)
              </ThemedText>
            </View>
          </View>

          <Pressable
            onPress={() => Linking.openURL(GITHUB_REPO_URL)}
            className="flex-row items-center justify-center space-x-2 rounded-lg bg-primary p-4 active:opacity-80"
          >
            <MaterialCommunityIcons
              name="github"
              size={24}
              color="white" // Assuming primary button text is white
            />
            <ThemedText className="font-semibold text-white">
              View on GitHub
            </ThemedText>
          </Pressable>

          <View className="mt-10 items-center">
            <ThemedText className="text-xs text-neutral-500">
              Made with ❤️
            </ThemedText>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}
