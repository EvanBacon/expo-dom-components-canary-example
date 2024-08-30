// This component is platform-specific.

import Dashboard from "@/components/shad/dashboard";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";

export default function Index() {
  return (
    <Dashboard
      navigate={router.navigate}
      notify={notify}
      haptics={async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }}
      dom={{
        contentInsetAdjustmentBehavior: "automatic",
        automaticallyAdjustsScrollIndicatorInsets: true,
      }}
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
