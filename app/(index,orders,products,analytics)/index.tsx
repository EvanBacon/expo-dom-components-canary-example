// This component is platform-specific.

import Dashboard from "@/components/shad/dashboard";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";

export default function Index() {
  return (
    <Dashboard
      navigate={router.navigate}
      notify={notify}
      dom={{
        contentInsetAdjustmentBehavior: "automatic",
      }}
    />
  );
}

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
    trigger: {
      seconds: 1,
    },
  });
}
