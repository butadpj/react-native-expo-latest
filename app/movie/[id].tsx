import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { formatRuntime } from '@/lib/utils';
import { fetchMovieDetails } from '@/services/movies';
import { useQuery } from '@tanstack/react-query';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import {
  ActivityIndicator,
  ImageBackground,
  Pressable,
  ScrollView,
  useColorScheme,
  View,
} from 'react-native';

const MovieDetails = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const movieId = params.id as string;

  const {
    data: movie,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ['movie', movieId],
    queryFn: () => fetchMovieDetails(movieId),
    enabled: Boolean(movieId),
  });

  const colorScheme = useColorScheme();

  if (isLoading) {
    return (
      <ThemedView className="flex-1 items-center justify-center">
        <ActivityIndicator
          size="large"
          color={colorScheme === 'dark' ? '#9084d2' : '#5209b0'}
        />
        {/* Netflix Red */}
      </ThemedView>
    );
  }

  if (isError || !movie) {
    return (
      <ThemedView className="flex-1 items-center justify-center p-4">
        <ThemedText type="title" className="mb-2 !text-red-500">
          Error
        </ThemedText>
        <ThemedText className="text-center !text-red-500">
          Could not load movie details: {(error as Error)?.message}
        </ThemedText>
      </ThemedView>
    );
  }

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w780${movie.backdrop_path}` // w780 or w1280
    : movie.backdrop_path // Fallback to poster if no backdrop
      ? `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`
      : undefined; // Or a default placeholder

  const year = movie.release_date ? movie.release_date.substring(0, 4) : 'N/A';
  const runtime = formatRuntime(movie.runtime);

  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
  const genres = movie.genres?.map((g) => g.name).join(' • ') || '';

  const trailers =
    movie.videos?.results.filter(
      (video: any) => video.type === 'Trailer' && video.site === 'YouTube',
    ) || [];

  const cast = movie.credits?.cast.slice(0, 10) || []; // Show top 10 cast members

  if (!movieId) {
    return (
      <ThemedView className="flex-1 items-center justify-center">
        <ThemedText>Movie ID not found.</ThemedText>
      </ThemedView>
    );
  }
  return (
    <ThemedView className="flex-1">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* --- Hero Section --- */}
        <View className="relative">
          <Pressable
            onPress={() => router.back()}
            className="absolute left-4 top-10 z-10 rounded-full bg-black/30 p-2"
          >
            <IconSymbol name="chevron.left" size={32} color="white" />
          </Pressable>
          {backdropUrl ? (
            <ImageBackground
              source={{ uri: backdropUrl }}
              resizeMode="cover"
              className="h-80 w-full justify-end md:h-96" // Adjust height as needed
            >
              {/* Gradient Overlay for text readability */}
              <View className="from-background via-background/80 absolute inset-0 bg-gradient-to-t to-transparent" />
            </ImageBackground>
          ) : (
            <View className="h-64 w-full items-center justify-center bg-neutral-800 md:h-96">
              <ThemedText>No Image Available</ThemedText>
            </View>
          )}

          <View className="absolute bottom-0 left-0 right-0 p-4">
            <ThemedText type="title" className="mb-1 text-3xl lg:text-4xl">
              {movie.title}
            </ThemedText>
            <View className="mb-2 flex-row items-center justify-between">
              <View className="flex-row items-center space-x-4">
                <ThemedText className="text-sm text-neutral-400">
                  {year}
                </ThemedText>
                {runtime && (
                  <>
                    <ThemedText className="text-sm text-neutral-500">
                      •
                    </ThemedText>
                    <ThemedText className="text-sm text-neutral-400">
                      {runtime}
                    </ThemedText>
                  </>
                )}
              </View>

              <View className="flex-row items-center gap-1 rounded bg-black/70 px-1.5 py-0.5">
                <IconSymbol name="star.fill" color={'#9084d2'} size={18} />
                <ThemedText className="text-right text-sm font-medium text-white">
                  {rating}
                </ThemedText>
              </View>
            </View>
          </View>
        </View>

        {/* --- Overview --- */}
        <View className="p-4">
          {/* Synopsis */}
          {movie.overview && (
            <ThemedText className="mb-3 leading-relaxed text-neutral-300">
              {movie.overview}
            </ThemedText>
          )}

          {/* Genres */}
          {genres && (
            <ThemedText className="mb-1 text-neutral-400">
              <ThemedText className="font-semibold text-neutral-300">
                Genres:{' '}
              </ThemedText>
              {genres}
            </ThemedText>
          )}
          {/* Add more details like "Starring:" if you have full cast data */}
        </View>
      </ScrollView>
    </ThemedView>
  );
};

export default MovieDetails;
