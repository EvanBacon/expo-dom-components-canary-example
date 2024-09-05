import "expo-router/entry";

import { LogBox } from "react-native";
import * as Notifications from "expo-notifications";

LogBox.ignoreLogs([
  "Failed to attach search bar to the header",
  // Shows when adding the tab bar during fast refresh. Maybe related to the scrolling system?
  "Error evaluating injectedJavaScript:",
]);
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});
