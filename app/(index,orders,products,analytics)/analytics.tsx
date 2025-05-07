import ShadAnalytics from "@/components/shad/analytics";
import { useScrollRef } from "@/lib/tab-to-top";
import * as Haptics from "expo-haptics";

export default function AnalyticsRoute() {
  const ref = useScrollRef<import("react-native-webview").WebView>();

  return (
    <ShadAnalytics
      ref={ref}
      onButtonClick={async (size: number) => {
        if (process.env.EXPO_OS !== "web") {
          Haptics.impactAsync(
            [
              Haptics.ImpactFeedbackStyle.Light,
              Haptics.ImpactFeedbackStyle.Medium,
              Haptics.ImpactFeedbackStyle.Heavy,
            ][size]
          );
        }
      }}
      dom={{
        contentInsetAdjustmentBehavior: "automatic",
        automaticallyAdjustsScrollIndicatorInsets: true,
      }}
    />
  );
}
