import SettingsRoute from "@/components/shad/settings";
import { router } from "expo-router";
import { StatusBar } from "react-native";

export default function Settings() {
  return (
    <>
      <SettingsRoute
        navigate={router.navigate}
        dom={{
          contentInsetAdjustmentBehavior: "automatic",
          automaticallyAdjustsScrollIndicatorInsets: true,
        }}
      />
      <StatusBar barStyle="light-content" />
    </>
  );
}
