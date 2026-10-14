// @ts-expect-error CSS imports are handled by the bundler
import "./global.css";
import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}