import { Stack } from "expo-router";
import { View, Text } from "react-native";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{}} />
    </Stack>
  );
}
