import { ThemedText } from '@/components/ThemedText';
import { useRouter } from 'expo-router';
import { Image, Pressable, View } from 'react-native';

interface Movie {
  id: string;
  poster?: string | null;
  title: string;
  year: string | number;
  rating: string | number;
}

export const MovieCard = ({ movie }: { movie: Movie }) => {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: `/movie/[id]`,
      params: {
        id: movie.id,
      },
    });
  };

  // Determine image source, using placeholder if poster is missing
  const imageSource = movie.poster
    ? { uri: movie.poster }
    : require('../../../../assets/images/partial-react-logo.png');

  return (
    <Pressable
      onPress={handlePress}
      // Define a width for the card in a horizontal list
      // Adjust w-32 (width: 8rem or 128px) or w-40 (10rem or 160px) as needed
      // Remove flex-1 if it was there
      className="border-border bg-card pressed:shadow-lg mr-3 w-48 overflow-hidden rounded-lg border shadow"
    >
      <View className="relative aspect-[2/3]">
        {/* aspect-video for 16/9 ratio */}
        <Image
          source={imageSource}
          alt={movie.title}
          className="absolute inset-0 h-full w-full"
          resizeMode="cover"
          onError={(e) =>
            console.error(`Image Error for ${movie.id}:`, e.nativeEvent.error)
          }
        />
        <View className="absolute right-2 top-2">
          <View className="rounded bg-black/70 px-1.5 py-0.5">
            <ThemedText className="text-xs font-medium text-white">
              {movie.rating}
            </ThemedText>
          </View>
        </View>
      </View>
      <View className="p-2">
        {/* Reduced padding slightly for smaller card */}
        <ThemedText
          numberOfLines={1} // Keep title to one line
          className="text-card-foreground pressed:text-primary font-medium"
        >
          {movie.title}
        </ThemedText>
        <ThemedText className="text-muted-foreground text-xs">
          {movie.year}
        </ThemedText>
        {/* Smaller year text */}
      </View>
    </Pressable>
  );
};
