import Orders from "@/components/shad/orders";
import { router } from "expo-router";
import { useScrollToTop } from "@/lib/tab-to-top";
import { useRef } from "react";

export default function OrdersRoute() {
  const ref = useRef(null);

  useScrollToTop(ref);

  return (
    <Orders
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
