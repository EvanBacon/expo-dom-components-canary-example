import { router, Link, Slot, Stack } from "expo-router";
import { Image } from "react-native";
import { TouchableImpact } from "@/components/touchable-impact";

import { PlatformColor } from "react-native";

import { ShadLayoutFull } from "@/components/shad/shad-layout";

export default function RootLayout({ segment }: { segment: string }) {
  if (process.env.EXPO_OS === "web") {
    return (
      <ShadLayoutFull navigate={router.navigate}>
        <Slot />
      </ShadLayoutFull>
    );
  }

  // TODO: Add header bar
  // return <Slot />;

  const name = getRouteName(segment);
  return (
    <Stack
      screenOptions={{
        headerTransparent: true,
        headerBlurEffect: "prominent",
        headerShadowVisible: true,
        headerLargeTitleShadowVisible: false,
        headerStyle: {
          // Hack to ensure the collapsed small header shows the shadow / border.
          backgroundColor: "rgba(255,255,255,0.01)",
        },
        headerLargeStyle: {
          backgroundColor: PlatformColor("systemGroupedBackgroundColor"), // Color of your background
        },
        contentStyle: {
          backgroundColor: PlatformColor("systemGroupedBackgroundColor"),
        },
      }}
    >
      <Stack.Screen
        name={name}
        options={{
          title: titles[name],
          headerLargeTitle: true,
          headerSearchBarOptions: {},
          headerRight() {
            return <ProfileButton segment={segment} />;
          },

          //
          ...(name !== "index"
            ? {
                headerLargeTitle: undefined,
                headerSearchBarOptions: undefined,
              }
            : {}),
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          title: "Settings",
          presentation: "modal",
          headerTransparent: true,
          headerBlurEffect: "prominent",
          headerShadowVisible: true,
          headerStyle: {
            // Hack to ensure the collapsed small header shows the shadow / border.
            backgroundColor: "rgba(255,255,255,0.01)",
          },
        }}
      />
    </Stack>
  );
}

function ProfileButton({ segment }: { segment: string }) {
  return (
    <Link href={`/${segment}/settings`} asChild>
      <TouchableImpact
        style={{
          aspectRatio: 1,
        }}
      >
        <Image
          style={{
            width: 30,
            height: 30,
            aspectRatio: 1,
            borderRadius: 24,
          }}
          source={require("@/public/evanbacon.jpg")}
        />
      </TouchableImpact>
    </Link>
  );
}

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
};

const titles = {
  index: "Dashboard",
  orders: "Orders",
  products: "Products",
  analytics: "Analytics",
};

function getRouteName(segment: string) {
  return segment.replace(/\((.+)\)/, "$1") as keyof typeof titles;
}
