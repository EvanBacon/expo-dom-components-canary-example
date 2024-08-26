import { Slot } from "expo-router";
import { Drawer } from "expo-router/drawer";

export default function RootLayout() {
  if (process.env.EXPO_OS === "web") return <Slot />;

  return (
    <Drawer>
      <Drawer.Screen name="index" options={{ title: "Shadcn" }} />
      <Drawer.Screen name="emoji-mart" options={{ title: "Emoji Mart" }} />
      <Drawer.Screen name="prism-react-renderer" options={{ title: "Prism React Renderer" }} />
      <Drawer.Screen name="products" options={{ title: "Products (MDX)" }} />
      <Drawer.Screen name="react-flow" options={{ title: "React Flow" }} />
      <Drawer.Screen name="react-mobile-cropper" options={{ title: "Mobile Cropper" }} />
      <Drawer.Screen name="react-three-fiber" options={{ title: "React Three Fiber" }} />
      <Drawer.Screen name="remotion" options={{ title: "Remotion" }} />
      <Drawer.Screen name="tiptap" options={{ title: "Tiptap" }} />
    </Drawer>
  );
}
