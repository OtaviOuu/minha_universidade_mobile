import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Navbar />
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen
          name="university/[acronym]/index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="university/[acronym]/[reviewSlug]/index"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </QueryClientProvider>
  );
}
