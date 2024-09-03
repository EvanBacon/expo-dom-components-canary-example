import "expo-router/entry";

import { LogBox } from "react-native";
import * as Notifications from "expo-notifications";

LogBox.ignoreLogs(["Failed to attach search bar to the header"]);
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});
