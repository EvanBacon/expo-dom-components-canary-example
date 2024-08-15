import { Slot, Tabs } from "expo-router";

export default function RootLayout() {
  if (process.env.EXPO_OS === "web") return <Slot />;

  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "shadcn" }} />
      <Tabs.Screen name="products" options={{ title: "MDX" }} />
    </Tabs>
  );
}
