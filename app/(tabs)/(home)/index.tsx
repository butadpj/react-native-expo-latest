import {
  ActivityIndicator,
  FlatList,
  SectionList,
  useColorScheme,
  View,
} from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useQueries } from '@tanstack/react-query';
import { fetchPopularMovies, fetchUpcomingMovies } from '@/services/movies';
import React from 'react';
import { MovieCard } from './components/movie-card';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const tabBarHeight = useBottomTabBarHeight();

  const results = useQueries({
    queries: [
      {
        queryKey: ['movies', 'popular'],
        queryFn: fetchPopularMovies,
      },
      {
        queryKey: ['movies', 'upcoming'],
        queryFn: fetchUpcomingMovies,
      },
    ],
  });

  const popularMoviesQuery = results[0];
  const upcomingMoviesQuery = results[1];

  const isLoading = results.some((query) => query.isLoading);
  const isError = results.some((query) => query.isError);

  const movieSections = React.useMemo(() => {
    let defaultMovieSections: any = [
      {
        title: 'Popular movies',
        // data is an array with ONE item. That item holds the list of movies.
        data: [],
      },
      {
        title: 'Upcoming movies',
        data: [],
      },
    ];

    if (popularMoviesQuery.data?.results?.length) {
      const mappedPopularMoviesData = popularMoviesQuery.data.results.map(
        (movie: any) => {
          return {
            poster: movie.poster_path
              ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
              : null,
            year: movie.release_date
              ? movie.release_date.substring(0, 4)
              : 'N/A', // Extract year
            rating: movie.vote_average?.toFixed(1) ?? 'N/A', // Format rating
            ...movie,
          };
        },
      );

      defaultMovieSections[0].data.push({
        id: 'popular_movies_list',
        movies: mappedPopularMoviesData,
      });
    }

    if (upcomingMoviesQuery.data?.results?.length) {
      const mappedUpcomingMoviesQuery = upcomingMoviesQuery.data.results.map(
        (movie: any) => {
          return {
            poster: movie.poster_path
              ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
              : null,
            year: movie.release_date
              ? movie.release_date.substring(0, 4)
              : 'N/A', // Extract year
            rating: movie.vote_average?.toFixed(1) ?? 'N/A', // Format rating
            ...movie,
          };
        },
      );

      defaultMovieSections[1].data.push({
        id: 'upcoming_movies_list',
        movies: mappedUpcomingMoviesQuery,
      });
    }

    console.log(defaultMovieSections);
    return defaultMovieSections;
  }, [popularMoviesQuery.data?.results, upcomingMoviesQuery.data?.results]);

  return (
    <ThemedView className="flex-1 px-4 pt-10">
      <View className="mb-8">
        <ThemedText
          type={'title'}
          className="text-4xl !text-link dark:!text-primary"
        >
          Discover
        </ThemedText>
      </View>

      {isLoading ? (
        <ThemedView className="flex-1 items-center justify-center">
          <ActivityIndicator
            size="large"
            color={colorScheme === 'dark' ? '#9084d2' : '#5209b0'}
          />
          <ThemedText className="mt-2">Loading Movies...</ThemedText>
        </ThemedView>
      ) : isError ? ( // <-- Add this check
        <ThemedView>
          {results.map((query, index) =>
            query.isError ? (
              <ThemedText key={index} className="!text-red-500">
                Error for query {index + 1}: {(query.error as Error)?.message}
              </ThemedText>
            ) : null,
          )}
        </ThemedView>
      ) : (
        <SectionList
          sections={movieSections}
          keyExtractor={(item, index) => item.id.toString() + index}
          showsVerticalScrollIndicator={false}
          stickyHeaderHiddenOnScroll
          renderSectionHeader={({ section: { title } }) => (
            <View className="py-4">
              <ThemedText type={'subtitle'} className="text-2xl">
                {title}
              </ThemedText>
            </View>
          )}
          renderItem={({ item, section, index }) => {
            const moviesForThisSection = item.movies;

            if (!moviesForThisSection || moviesForThisSection.length === 0) {
              return (
                <View className="h-48 items-center justify-center">
                  <ThemedText>No movies in this section yet.</ThemedText>
                </View>
              );
            }

            return (
              <FlatList
                data={moviesForThisSection}
                renderItem={({ item: movie }) => <MovieCard movie={movie} />}
                keyExtractor={(movie) => movie.id.toString()}
                horizontal // Key prop for horizontal scrolling!
                showsHorizontalScrollIndicator={false}
                // Add padding to the start/end of the horizontal list
                contentContainerStyle={{
                  paddingVertical: 12, // py-3 for some vertical space for the carousel
                }}
                // You can also use ItemSeparatorComponent for spacing instead of margin on MovieCard
                // ItemSeparatorComponent={() => <View className="w-3" />}
              />
            );
          }}
          stickySectionHeadersEnabled={true}
          className="flex-1"
          ListFooterComponent={
            <View
              // Not sure why this doesn't work.
              //className={`h-[${tabBarHeight}px]`}
              style={{
                height: tabBarHeight,
              }}
            />
          }
        />
      )}
    </ThemedView>
  );
}
