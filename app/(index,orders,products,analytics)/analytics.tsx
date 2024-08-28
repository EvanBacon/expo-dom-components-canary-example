import ShadAnalytics from "@/components/shad/analytics";
import { router, Stack } from "expo-router";

export default function Products() {
  return (
    <>
      <ShadAnalytics
        navigate={router.navigate}
        dom={{
          contentInsetAdjustmentBehavior: "automatic",
        }}
      />
    </>
  );
}
