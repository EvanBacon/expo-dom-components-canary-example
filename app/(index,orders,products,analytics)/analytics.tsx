import ShadAnalytics from "@/components/shad/analytics";
import { router } from "expo-router";

export default function AnalyticsRoute() {
  return (
    <ShadAnalytics
      navigate={router.navigate}
      dom={{
        contentInsetAdjustmentBehavior: "automatic",
        automaticallyAdjustsScrollIndicatorInsets: true,
      }}
    />
  );
}
