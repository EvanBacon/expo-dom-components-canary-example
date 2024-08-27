import ShadProducts from "@/components/shad/products";
import { router } from "expo-router";

export default function Products() {
  return <ShadProducts navigate={router.navigate} />;
}
