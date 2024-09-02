// This component is platform-specific.

import Dashboard from "@/components/shad/dashboard";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import React from "react";
import { useScrollRef } from "@/lib/tab-to-top";

export default function Index() {
  return (
    <Dashboard
      notify={notify}
      //
      ref={useScrollRef()}
      {...extraProps}
    />
  );
}

async function notify() {
  if (process.env.EXPO_OS === "web") {
    alert("New Order (from a DOM component 🚀)");
    return;
  }
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

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

const extraProps = {
  navigate: router.navigate,
  haptics: async () => {
    if (process.env.EXPO_OS === "web") return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  },
  dom: {
    contentInsetAdjustmentBehavior: "automatic",
    automaticallyAdjustsScrollIndicatorInsets: true,
  },
} as const;
