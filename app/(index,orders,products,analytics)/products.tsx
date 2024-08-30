import Products from "@/components/shad/products";
import { router } from "expo-router";

export default function ProductsRoute() {
  return (
    <Products
      navigate={router.navigate}
      dom={{
        contentInsetAdjustmentBehavior: "automatic",
        automaticallyAdjustsScrollIndicatorInsets: true,
      }}
    />
  );
}
