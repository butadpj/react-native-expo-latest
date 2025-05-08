export const fetchPopularMovies = async () => {
  const res = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/api/popular-movies`,
  );
  return await res.json();
};

export const fetchMovieDetails = async (id: string) => {
  const res = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/api/movie/${id}?language=en-US`,
  );
  return await res.json();
};

export const fetchUpcomingMovies = async () => {
  const res = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/api/upcoming-movies`,
  );
  return await res.json();
};
