import Orders from "@/components/shad/orders";
import { router, Stack } from "expo-router";

export default function OrdersRoute() {
  return (
    <>
      <Stack.Screen options={{ title: "Orders" }} />
      <Orders
        navigate={router.navigate}
        dom={{
          contentInsetAdjustmentBehavior: "automatic",
        }}
      />
    </>
  );
}
