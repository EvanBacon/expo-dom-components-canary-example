import { Stack, Tabs, useFocusEffect, useNavigation, useRouter } from "expo-router";
import { I18nManager, PlatformColor } from "react-native";
import { TouchableImpact } from "@/components/touchable-impact";
import { ArrowRight, ChevronDown, XIcon } from "lucide-react-native";
import React, { useCallback } from "react";

export default function RootLayout({ segment }: { segment: string }) {
  // Force RTL for the entire app
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(true);

  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      // Hide tab bar when this screen is focused
      navigation.getParent()?.getParent()?.setOptions({ tabBarStyle: { display: "none" } });
      return () => {
        // Show tab bar again when leaving this screen
        navigation.getParent()?.getParent()?.setOptions({ tabBarStyle: { display: "flex" } });
      };
    }, [navigation])
  );

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
          backgroundColor: "rgba(255,255,255,0.01)",
        },
        headerLargeStyle: {
          backgroundColor: "background",
        },
        contentStyle: {
          backgroundColor: "#fff",
        },
      }}
    >
      <Stack.Screen
        name={"item/[item]"}
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
      <Stack.Screen
        name={"cart/[restaurant]"}
        options={{
          title: "עגלת קניות",
          contentStyle: {
            backgroundColor: "white",
          },
          headerLargeStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
              fontFamily: "fredoka-semibold",
              fontSize: 20,
          },
          headerBackVisible: false,
          presentation: "card",
          animation: "slide_from_bottom",
          headerLeft: () => {
            return <ChevronDownButton />;
          },
        }} />
      <Stack.Screen
        name={"checkout/[restaurant]"}
        options={{
          title: "תשלום",
          contentStyle: {
            backgroundColor: "white",
          },
          headerLargeStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
              fontFamily: "fredoka-semibold",
              fontSize: 20,
          },
          headerBackVisible: false,
          presentation: "card",
          headerLeft: () => {
            return <ArrowBack />;
          },
        }} />
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

function ChevronDownButton() {
    const router = useRouter();
    return (
        <TouchableImpact onPress={router.back} style={{
            padding: 6,
            borderRadius: 24,
            backgroundColor: "#dddddde0",
            alignItems: "center",
            justifyContent: "center",
        }}>
        <ChevronDown
        style={{
            width: 40,
            height: 40,
            aspectRatio: 1,
            borderRadius: 24,
        }}
        color={PlatformColor("label")}
        />
        </TouchableImpact>
    );
}



function ArrowBack() {
    const router = useRouter();
    return (
        <TouchableImpact onPress={router.back} style={{
            padding: 4,
            borderRadius: 24,
            backgroundColor: "#dddddde0",
            alignItems: "center",
            justifyContent: "center",
        }}>
        <ArrowRight
        style={{
            width: 40,
            height: 40,
            aspectRatio: 1,
            borderRadius: 24,
        }}
        color={PlatformColor("label")}
        />
        </TouchableImpact>
    );
}


