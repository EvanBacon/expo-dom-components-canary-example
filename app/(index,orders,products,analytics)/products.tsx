import Products from "@/components/shad/products";
import { useScrollRef } from "@/lib/tab-to-top";
import * as Haptics from "expo-haptics";

export default function ProductsRoute() {
  const ref = useScrollRef<import("react-native-webview").WebView>();

  return (
    <Products
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
