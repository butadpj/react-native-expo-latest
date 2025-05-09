import { useRouter } from 'expo-router';
import { Pressable } from 'react-native';
import { IconSymbol } from './IconSymbol';

export const BackButton = () => {
  const router = useRouter();

  const handlePressBack = () => {
    // For better UX, router.back() is preffered when it's possible
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };
  return (
    <Pressable
      onPress={handlePressBack}
      className="absolute left-4 top-10 z-10 rounded-full bg-black/30 p-2"
    >
      <IconSymbol name="chevron.left" size={30} color="#fff" />
    </Pressable>
  );
};
