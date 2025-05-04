import { Dimensions, Image, Pressable, SectionList, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';

const movieSections = [
  {
    title: 'Popular movies',
    data: [
      {
        id: 1,
        title: 'The Shawshank Redemption',
        year: '1994',
        rating: '9.3',
        poster: '/placeholder.svg?height=600&width=400',
        genre: ['Drama'],
        director: 'Frank Darabont',
        description:
          'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
      },
      {
        id: 2,
        title: 'The Godfather',
        year: '1972',
        rating: '9.2',
        poster: '/placeholder.svg?height=600&width=400',
        genre: ['Crime', 'Drama'],
        director: 'Francis Ford Coppola',
        description:
          'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
      },
      {
        id: 3,
        title: 'The Dark Knight',
        year: '2008',
        rating: '9.0',
        poster: '/placeholder.svg?height=600&width=400',
        genre: ['Action', 'Crime', 'Drama'],
        director: 'Christopher Nolan',
        description:
          'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
      },
    ],
  },
  {
    title: 'New movies',
    data: [
      {
        id: 1,
        title: 'The Shawshank Redemption',
        year: '1994',
        rating: '9.3',
        poster: '/placeholder.svg?height=600&width=400',
        genre: ['Drama'],
        director: 'Frank Darabont',
        description:
          'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
      },
      {
        id: 2,
        title: 'The Godfather',
        year: '1972',
        rating: '9.2',
        poster: '/placeholder.svg?height=600&width=400',
        genre: ['Crime', 'Drama'],
        director: 'Francis Ford Coppola',
        description:
          'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
      },
      {
        id: 3,
        title: 'The Dark Knight',
        year: '2008',
        rating: '9.0',
        poster: '/placeholder.svg?height=600&width=400',
        genre: ['Action', 'Crime', 'Drama'],
        director: 'Christopher Nolan',
        description:
          'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
      },
    ],
  },
];

interface Movie {
  id: number | string;
  poster?: string | null;
  title: string;
  year: string | number;
  rating: string | number;
}

interface MovieGridProps {
  movies: Movie[];
}

// --- Optional: Calculate columns based on screen width ---
const { width } = Dimensions.get('window');
const calculateNumColumns = () => {
  if (width >= 1024) return 5; // lg
  if (width >= 768) return 4; // md
  if (width >= 640) return 3; // sm
  return 2; // default
};
const NUM_COLUMNS = calculateNumColumns();
const GAP = 16; // Corresponds to gap-4 (4 * 4 = 16)

// Reusable Movie Card Component (Pure NativeWind)
const MovieCard = ({ movie }: { movie: Movie }) => {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: `/`,
    }); // Navigate on press
  };

  // Determine image source, using placeholder if poster is missing
  const imageSource = movie.poster
    ? { uri: movie.poster }
    : '../../assets/images/partial-react-logo.png';

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
          source={require('../../assets/images/partial-react-logo.png')}
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
  return (
    <ThemedView className="flex-1 px-4 pb-40 pt-10">
      <View className="mb-10">
        <ThemedText type={'title'} className="text-5xl">
          Movies
        </ThemedText>
      </View>

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
          // SectionList renders items vertically by default.
          // To get a grid, you'd need complex logic here or render
          // a non-scrollable grid view for the section's data.
          // This simple example just renders one card per row:
          return (
            <View className="p-2">
              <MovieCard movie={item} />
            </View>
          );
        }}
        stickySectionHeadersEnabled={true} // Optional: if you don't want sticky headers
        className="flex-1" // Ensure it takes up available space
      />
    </ThemedView>
  );
}
