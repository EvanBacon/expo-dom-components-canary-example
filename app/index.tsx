import { View } from "react-native";
import Dashboard from "@/components/dashboard";
import { router } from "expo-router";

// This component is platform-specific.

import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function Index() {
  return (
    <View style={{ flex: 1 }}>
      <Dashboard navigate={router.navigate} notify={notify} />
    </View>
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
