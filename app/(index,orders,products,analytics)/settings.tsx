import SettingsRoute from "@/components/shad/settings";
import { router } from "expo-router";

export default function Settings() {
  return (
    <SettingsRoute
      navigate={router.navigate}
      dom={{
        contentInsetAdjustmentBehavior: "automatic",
      }}
    />
  );
}
