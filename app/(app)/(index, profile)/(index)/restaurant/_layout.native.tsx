import { Stack, useRouter } from "expo-router";
import { I18nManager, PlatformColor } from "react-native";
import { TouchableImpact } from "@/components/touchable-impact";
import { XIcon } from "lucide-react-native";
import React from "react";

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
        name={"item"}
        options={{
          title: "מנה",
          contentStyle: {
            backgroundColor: "white",
          },
          headerLargeStyle: {
            backgroundColor: "white",
          },
          headerBackVisible: true,
          headerShown: false,
          presentation: "modal",
          headerLeft: () => {
            return <XButton />;
          },
        }}
      />
      <Stack.Screen
        name={"[restaurant]"}
        options={{
          title: "מסעדה",
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
    </Stack>
  );
}

function XButton() {
    const router = useRouter();
    return (
        <TouchableImpact onPress={router.back}>
        <XIcon
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

