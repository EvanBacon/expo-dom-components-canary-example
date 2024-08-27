import { Slot, Stack, usePathname, useSegments } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { Image } from "react-native";

export default function RootLayout() {
  if (process.env.EXPO_OS === "web") return <Slot />;

  const [, segment] = useSegments();
  return (
    <Stack
      screenOptions={{
        title: segment,
        headerLargeTitle: true,
        headerSearchBarOptions: {},
        headerRight(props) {
          return (
            <Image
              style={{
                width: 30,
                aspectRatio: 1,
                borderRadius: 24,
              }}
              source={require("@/public/placeholder-user.jpg")}
            />
          );
        },
      }}
    />
  );

  return (
    <Drawer>
      <Drawer.Screen name="index" options={{ title: "shadcn" }} />
      <Drawer.Screen name="products" options={{ title: "MDX" }} />
    </Drawer>
  );
}
