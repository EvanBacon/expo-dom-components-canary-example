// This component is platform-specific.

import Dashboard from "@/components/shad/dashboard";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import React from "react";
import { useScrollRef } from "@/lib/tab-to-top";

export default function IndexRoute() {
  return (
    <Dashboard
      // notify={notify}
      //
      ref={useScrollRef()}
      {...extraProps}
    />
  );
}

// async function notify() {
//   if (process.env.EXPO_OS === "web") {
//     alert("New Order (from a DOM component 🚀)");
//     return;
//   }

//   await Notifications.requestPermissionsAsync();

//   await Notifications.scheduleNotificationAsync({
//     identifier: "hello",
//     content: {
//       title: "New Order",
//       body: "(from a DOM component 🚀)",
//     },
//     trigger: null,
//   });
// }

const extraProps = {
  navigate: router.navigate,
  dom: {
    contentInsetAdjustmentBehavior: "automatic",
    automaticallyAdjustsScrollIndicatorInsets: true,
  },
} as const;
