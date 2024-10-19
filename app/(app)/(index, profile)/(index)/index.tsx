import Dashboard from "@/components/shad/dashboard";
import * as Notifications from "expo-notifications";
import { Redirect, router } from "expo-router";
import React from "react";
import { useScrollRef } from "@/lib/tab-to-top";
import * as Haptics from "expo-haptics";

export default function IndexRoute() {
  const { restaurants } = useRestaurantStore();

  return (
    <Dashboard
      notify={notify}
      onButtonClick={async (size: number) => {
        if (process.env.EXPO_OS !== "web") {
          Haptics.impactAsync(
            [
              Haptics.ImpactFeedbackStyle.Light,
              Haptics.ImpactFeedbackStyle.Medium,
              Haptics.ImpactFeedbackStyle.Heavy,
            ][size]
          );
        }
      }}
      restaurants={restaurants}
      ref={useScrollRef()}
      navigate={router.navigate}
      dom={{
        contentInsetAdjustmentBehavior: "automatic",
        automaticallyAdjustsScrollIndicatorInsets: true,
        onLoadEnd(event) {
          // Keep the splash screen open until the DOM content has loaded.
          setTimeout(() => {
            SplashScreen.hideAsync();
          }, 1);
        },
      }}
    />
  );
}

// native notify function
async function notify() {
  if (process.env.EXPO_OS === "web") {
    alert("New Order (from a DOM component 🚀)");
    return;
  }

  await Notifications.requestPermissionsAsync();

  await Notifications.scheduleNotificationAsync({
    identifier: "hello",
    content: {
      title: "New Order",
      body: "(from a DOM component 🚀)",
    },
    trigger: null,
  });
}
import * as SplashScreen from "expo-splash-screen";import { useAuth } from "@/components/providers/auth-provider";
import { useRestaurantStore } from "@/lib/store/restaurantStore";

