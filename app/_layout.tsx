import { Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "shadcn" }} />
      <Tabs.Screen name="second" options={{ title: "MDX" }} />
    </Tabs>
  );
}
