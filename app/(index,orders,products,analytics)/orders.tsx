import Orders from "@/components/shad/orders";
import { router } from "expo-router";

export default function OrdersRoute() {
  return (
    <Orders
      navigate={router.navigate}
      dom={{
        contentInsetAdjustmentBehavior: "automatic",
      }}
    />
  );
}
