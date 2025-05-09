import { Image, Pressable, SectionList, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { fetchMovies } from '@/services/movies';
import React from 'react';

interface Movie {
  id: number | string;
  poster?: string | null;
  title: string;
  year: string | number;
  rating: string | number;
}

// Reusable Movie Card Component (Pure NativeWind)
const MovieCard = ({ movie }: { movie: Movie }) => {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: `/(tabs)/(home)`,
    }); // Navigate on press
  };

  // Determine image source, using placeholder if poster is missing
  const imageSource = movie.poster
    ? { uri: movie.poster }
    : require('../../../assets/images/partial-react-logo.png');

  return (
    <Pressable
      onPress={handlePress}
      // Apply base styles and use `pressed:` variant for shadow change
      // Use flex-1 to allow items to grow within the FlatList column structure
      // Add margin for vertical gap between rows
      className="border-border bg-card pressed:shadow-lg mb-4 flex-1 overflow-hidden rounded-lg border shadow" // mb-4 adds vertical gap
      // Remove inline style for margin if mb-4 is sufficient
      // style={{ margin: GAP / 2 }} // Alternative gap handling
    >
      {/* Image Container */}
      <View className="relative aspect-video">
        {/* Image using NativeWind for absolute positioning */}
        <Image
          source={imageSource}
          alt={movie.title}
          // Use NativeWind classes for fill effect
          className="absolute inset-0 h-full w-full"
          resizeMode="cover" // Equivalent to object-cover
        />
        {/* Rating Badge */}
        <View className="absolute right-2 top-2">
          <View className="rounded bg-black/70 px-1.5 py-0.5">
            <ThemedText className="text-xs font-medium text-white">
              {movie.rating}
            </ThemedText>
          </View>
        </View>
      </View>

      {/* Text Content */}
      <View className="p-3">
        <ThemedText
          numberOfLines={1} // Equivalent to line-clamp-1
          // Use `pressed:` variant for text color change
          type={'subtitle'}
          className="pressed:text-primary font-medium"
        >
          {movie.title}
        </ThemedText>
        <ThemedText className="text-muted-foreground text-sm">
          {movie.year}
        </ThemedText>
      </View>
    </Pressable>
  );
};

export default function HomeScreen() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['movies'],
    queryFn: fetchMovies,
  });

  const movieSections = React.useMemo(() => {
    if (data?.results?.length) {
      const mappedMovieData = data.results.map((movie: any) => {
        return {
          poster: movie.poster_path
            ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
            : null,
          year: movie.release_date ? movie.release_date.substring(0, 4) : 'N/A', // Extract year
          rating: movie.vote_average?.toFixed(1) ?? 'N/A', // Format rating
          ...movie,
        };
      });

      return [
        {
          title: 'Popular movies',
          data: mappedMovieData,
        },

        { title: 'New movies', data: mappedMovieData },
      ];
    }
    return [];
  }, [data?.results]);

  return (
    <ThemedView className="flex-1 px-4 pt-10">
      <View className="mb-10">
        <ThemedText type={'title'} className="text-4xl">
          Discover
        </ThemedText>
      </View>

      {isLoading ? (
        <ThemedText>Loading...</ThemedText>
      ) : isError ? ( // <-- Add this check
        <ThemedText className="!text-red-500">
          Error loading movies: {(error as Error)?.message || 'Unknown error'}
        </ThemedText>
      ) : (
        <SectionList
          sections={movieSections}
          keyExtractor={(item, index) => item.id.toString() + index}
          showsVerticalScrollIndicator={false}
          stickyHeaderHiddenOnScroll
          renderSectionHeader={({ section: { title } }) => (
            <View className="px-4 pt-4">
              <ThemedText type={'title'}>{title}</ThemedText>
            </View>
          )}
          renderItem={({ item, section, index }) => {
            return (
              <View className="p-2">
                <MovieCard movie={item} />
              </View>
            );
          }}
          stickySectionHeadersEnabled={true} // Optional: if you don't want sticky headers
          className="flex-1" // Ensure it takes up available space
        />
      )}
    </ThemedView>
  );
}
