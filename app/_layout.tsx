import { Slot } from "expo-router";
import { Drawer } from "expo-router/drawer";

export default function RootLayout() {
  if (process.env.EXPO_OS === "web") return <Slot />;

  return (
    <Drawer>
      <Drawer.Screen name="index" options={{ title: "shadcn" }} />
      <Drawer.Screen name="products" options={{ title: "MDX" }} />
    </Drawer>
  );
}
