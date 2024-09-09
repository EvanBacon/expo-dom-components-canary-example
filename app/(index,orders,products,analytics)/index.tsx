// This component is platform-specific.

import { Stack } from "expo-router";
import Dashboard from "@/components/shad/dashboard";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { useScrollRef } from "@/lib/tab-to-top";

export default function IndexRoute() {
  const [enableSearchBar, setEnableSearchBar] = useState(false);

  const onLoad = useCallback(() => {
    if (process.env.EXPO_OS !== 'web') {
      setEnableSearchBar(true);
    }
  }, []);

  return (
    <>
      <Stack.Screen
        options={
          enableSearchBar
            ? {
                headerLargeTitle: true,
                headerSearchBarOptions: {},
              }
            : {}
        }
      />
      <Dashboard
        notify={notify}
        ref={useScrollRef()}
        {...extraProps}
        dom={{
          contentInsetAdjustmentBehavior: "automatic",
          automaticallyAdjustsScrollIndicatorInsets: true,
          onLoad,
        }}
      />
    </>
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

const extraProps = {
  navigate: router.navigate,
} as const;
