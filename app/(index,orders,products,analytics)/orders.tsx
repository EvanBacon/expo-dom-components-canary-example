import Orders from "@/components/shad/orders";
import { router } from "expo-router";
import { useScrollRef } from "@/lib/tab-to-top";

export default function OrdersRoute() {
  const ref = useScrollRef();
  return (
    <Orders
      ref={ref}
      navigate={router.navigate}
      dom={{
        contentInsetAdjustmentBehavior: "automatic",
        automaticallyAdjustsScrollIndicatorInsets: true,
      }}
    />
  );
}
