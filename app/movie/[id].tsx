import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { BackButton } from '@/components/ui/BackButton';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { formatRuntime, getYouTubeThumbnail } from '@/lib/utils';
import { fetchMovieDetails } from '@/services/movies';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  Linking,
  Pressable,
  ScrollView,
  useColorScheme,
  View,
} from 'react-native';

const MovieDetails = () => {
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
    movie.videos?.results?.filter(
      (video: any) => video.type === 'Trailer' && video.site === 'YouTube',
    ) || [];

  const cast = movie.credits?.cast?.slice(0, 10) || []; // Show top 10 cast members

  if (!movieId) {
    return (
      <ThemedView className="flex-1 items-center justify-center">
        <ThemedText className="!text-red-500">Movie ID not found.</ThemedText>
      </ThemedView>
    );
  }
  return (
    <ThemedView className="flex-1">
      <BackButton />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* --- Hero Section --- */}
        <View>
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
        </View>

        {/* --- Trailers Section --- */}
        {trailers.length > 0 && (
          <View className="py-2">
            <ThemedText type="subtitle" className="mb-2 px-4 text-xl">
              Trailers & More
            </ThemedText>
            <FlatList
              data={trailers}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{
                paddingHorizontal: 16,
                paddingBottom: 16,
              }}
              renderItem={({ item: video }) => (
                <Pressable
                  className="mr-3 aspect-video w-60 overflow-hidden rounded-md bg-neutral-800"
                  onPress={() =>
                    Linking.openURL(
                      `https://www.youtube.com/watch?v=${video.key}`,
                    )
                  }
                >
                  <ImageBackground
                    source={{ uri: getYouTubeThumbnail(video.key) }}
                    className="h-full w-full items-center justify-center"
                  >
                    <IconSymbol
                      name="play.circle.fill"
                      size={48}
                      color="rgba(255,255,255,0.8)"
                    />
                  </ImageBackground>
                  <View className="absolute bottom-0 left-0 right-0 bg-black/50 p-1.5">
                    <ThemedText className="text-xs" numberOfLines={1}>
                      {video.name}
                    </ThemedText>
                  </View>
                </Pressable>
              )}
            />
          </View>
        )}

        {/* --- Cast Section --- */}
        {cast.length > 0 && (
          <View className="py-2">
            <ThemedText type="subtitle" className="mb-2 px-4 text-xl">
              Cast
            </ThemedText>
            <FlatList
              data={cast}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={{
                paddingHorizontal: 16,
                paddingBottom: 16,
              }}
              renderItem={({ item: member }) => (
                <View className="mr-3 w-24 items-center">
                  <Image
                    source={
                      member.profile_path
                        ? {
                            uri: `https://image.tmdb.org/t/p/w300${member.profile_path}`,
                          }
                        : require('../../assets/images/partial-react-logo.png') // Your placeholder
                    }
                    className="mb-1 !h-20 !w-20 rounded-full bg-neutral-700"
                    resizeMode="cover"
                  />
                  <ThemedText className="text-center text-xs" numberOfLines={2}>
                    {member.name}
                  </ThemedText>
                  <ThemedText
                    className="text-center text-xs text-neutral-400"
                    numberOfLines={1}
                  >
                    {member.character}
                  </ThemedText>
                </View>
              )}
            />
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
};

export default MovieDetails;
