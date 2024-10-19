import { Stack, useRouter } from "expo-router";
import { I18nManager, PlatformColor } from "react-native";
import React from "react";
import { TouchableImpact } from "@/components/touchable-impact";
import { ArrowRight } from "lucide-react-native";

export default function RootLayout({ segment }: { segment: string }) {
  // Force RTL for the entire app
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(true);

  return (
    <Stack
      screenOptions={{
        headerTransparent: true,
        headerBlurEffect: "prominent",
        headerShadowVisible: true,
        headerLargeTitleShadowVisible: false,
        gestureEnabled: true,
        gestureDirection: "horizontal",
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
      }}
    >
      <Stack.Screen
        name={"index"}
        options={{
          contentStyle: {
            backgroundColor: "white",
          },
          headerLargeStyle: {
            backgroundColor: "white",
          },
          headerBackVisible: false,
          headerShown: false,
          navigationBarHidden: true,
        }}
      />
      <Stack.Screen
        name={"onboard"}
        options={{
          contentStyle: {
            backgroundColor: "white",
          },
          headerLargeStyle: {
            backgroundColor: "white",
          },
          headerBackVisible: false,
          headerShown: false,
          navigationBarHidden: true,
        }}
      />
      <Stack.Screen
        name={"companies"}
        options={{
          contentStyle: {
            backgroundColor: "white",
          },
          headerLargeStyle: {
            backgroundColor: "white",
          },
          headerBackVisible: false,
          headerShown: true,
        }}
      />
      <Stack.Screen
        name={"login"}
        options={{
          contentStyle: {
            backgroundColor: "white",
          },
          headerLargeStyle: {
            backgroundColor: "white",
          },
          headerBackVisible: false,
          headerShown: true,
          headerLeft: () => <BackButton />,
        }}
      />
    </Stack>
  );
}

function BackButton() {
  const router = useRouter();
  return (
    <TouchableImpact onPress={router.back}>
      <ArrowRight
        style={{
          width: 30,
          height: 30,
          aspectRatio: 1,
          borderRadius: 24,
        }}
        color={PlatformColor("label")}
      />
    </TouchableImpact>
  );
}

