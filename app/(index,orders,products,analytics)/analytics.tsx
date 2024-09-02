import ShadAnalytics from "@/components/shad/analytics";
import { router } from "expo-router";
import { useScrollRef } from "@/lib/tab-to-top";

export default function AnalyticsRoute() {
  const ref = useScrollRef();
  return (
    <ShadAnalytics
      // @ts-expect-error
      ref={ref}
      navigate={router.navigate}
      dom={{
        contentInsetAdjustmentBehavior: "automatic",
        automaticallyAdjustsScrollIndicatorInsets: true,
      }}
    />
  );
}
