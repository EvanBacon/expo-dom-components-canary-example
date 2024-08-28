import { Link, Slot, Stack } from "expo-router";
import { Image, TouchableOpacity } from "react-native";

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

const titles = {
  index: "Dashboard",
  orders: "Orders",
  products: "Products",
  analytics: "Analytics",
};

export default function RootLayout({ segment }: { segment: string }) {
  // TODO: Add header bar
  // if (process.env.EXPO_OS === "web")
  return <Slot />;

  const initialScreenName = segment.replace(
    /\((.+)\)/,
    "$1"
  ) as keyof typeof titles;
  return (
    <Stack>
      <Stack.Screen
        name={initialScreenName}
        options={{
          title: titles[initialScreenName],
          headerLargeTitle: true,
          headerSearchBarOptions: {},
          headerRight(props) {
            return (
              // @ts-expect-error
              <Link href={`/${segment}/settings`} asChild>
                <TouchableOpacity
                  style={{
                    width: 30,
                    aspectRatio: 1,
                    borderRadius: 24,
                  }}
                >
                  <Image
                    style={{
                      width: 30,
                      height: 30,
                      aspectRatio: 1,
                      borderRadius: 24,
                    }}
                    source={require("@/public/placeholder-user.jpg")}
                  />
                </TouchableOpacity>
              </Link>
            );
          },
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          title: "Settings",
          presentation: "modal",
          headerLargeTitle: true,
        }}
      />
    </Stack>
  );
}
