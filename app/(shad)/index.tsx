import { ScrollView, View } from "react-native";
import Dashboard from "@/components/shad/dashboard";
import { router } from "expo-router";

// This component is platform-specific.

import * as Notifications from "expo-notifications";

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
