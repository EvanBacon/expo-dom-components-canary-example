import { Link, Stack, useRouter } from "expo-router";
import { I18nManager, PlatformColor } from "react-native";
import { TouchableImpact } from "@/components/touchable-impact";
import { ArrowRight, Settings, XIcon } from "lucide-react-native";
import React, { useEffect } from "react";

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
        headerLeft: () => {
            return <BackButton />;
        },
      }}
    >
      <Stack.Screen
        name={"index"}
        options={{
          title: "פרופיל",
          headerLargeTitleStyle: { fontFamily: "fredoka-semibold" },
          headerTitleStyle: { fontFamily: "fredoka-semibold", fontSize: 20 },
          headerLargeTitle: true,
          headerLeft: () => {
              return null;
          },
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
