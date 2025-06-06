import { Stack } from 'expo-router';

const MovieDetailsLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default MovieDetailsLayout;
