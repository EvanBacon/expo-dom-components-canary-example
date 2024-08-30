import Products from "@/components/shad/products";
import { router } from "expo-router";
import { useScrollToTop } from "@/lib/tab-to-top";
import { useRef } from "react";

export default function ProductsRoute() {
  const ref = useRef(null);

  useScrollToTop(ref);

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
