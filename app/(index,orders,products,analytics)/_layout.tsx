import { Slot, Stack, Tabs, useSegments } from "expo-router";
import { Drawer } from "expo-router/drawer";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image, View } from "react-native";

export const unstable_settings = {
  initialRouteName: "index",
  orders: {
    initialRouteName: "orders",
  },
  products: {
    initialRouteName: "products",
  },
  analytics: {
    initialRouteName: "analytics",
  },
  settings: {
    initialRouteName: "settings",
  },
};

export default function RootLayout() {
  if (process.env.EXPO_OS === "web") return <Slot />;

  return (
    <Stack
      screenOptions={{
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
}
