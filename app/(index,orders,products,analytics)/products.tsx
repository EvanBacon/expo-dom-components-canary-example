import Products from "@/components/shad/products";
import { router } from "expo-router";
import { useScrollRef } from "@/lib/tab-to-top";

export default function ProductsRoute() {
  const ref = useScrollRef();

  return (
    <Products
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
