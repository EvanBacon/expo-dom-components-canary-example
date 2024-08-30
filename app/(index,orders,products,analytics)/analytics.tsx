import ShadAnalytics from "@/components/shad/analytics";
import { router } from "expo-router";
import { useScrollToTop } from "@/lib/tab-to-top";
import { useRef } from "react";

export default function AnalyticsRoute() {
  const ref = useRef(null);

  useScrollToTop(ref);

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
