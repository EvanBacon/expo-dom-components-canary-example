import { Link, Stack, } from "expo-router";
import { I18nManager, PlatformColor } from "react-native";
import { TouchableImpact } from "@/components/touchable-impact";
import {  Settings } from "lucide-react-native";
import React, { useEffect } from "react";
import { useRestaurantStore } from "@/lib/store/restaurantStore";

export default function RootLayout({ segment }: { segment: string }) {
  // Force RTL for the entire app
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(true);

  // States
  const { fetchRestaurants } = useRestaurantStore();

  // Fetch everything
  useEffect(() => {
      fetchRestaurants();
  }, []);

  const name = getRouteName(segment);

  return (
    <Stack
      screenOptions={{
        headerTransparent: true,
        headerBlurEffect: "prominent",
        headerShadowVisible: true,
        headerLargeTitleShadowVisible: false,
        headerStyle: {
          // Hack to ensure the collapsed small header shows the shadow / border
          backgroundColor: "rgba(255,255,255,0.01)",
        },
        headerLargeStyle: {
          backgroundColor: "background",
        },
        contentStyle: {
          backgroundColor: "white",
        },
        headerShown: false,
      }}
    >
      <Stack.Screen
        name={name}
        options={{
          title: titles[name],
          headerRight() {
            return <ProfileButton segment={segment} />;
          },
          contentStyle: {
            backgroundColor: "white",
          },
          headerLargeStyle: {
            backgroundColor: "white",
          },
          headerBackVisible: false,
          headerLargeTitle: undefined,
          headerSearchBarOptions: undefined,
          headerShown: false,
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
        <Settings
          style={{
            width: 30,
            height: 30,
            aspectRatio: 1,
            borderRadius: 24,
          }}
          color={PlatformColor("label")}
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
  index: "מסעדות",
  profile: "פרופיל",
};

function getRouteName(segment: string) {
  return segment.replace(/\((.+)\)/, "$1") as keyof typeof titles;
}

