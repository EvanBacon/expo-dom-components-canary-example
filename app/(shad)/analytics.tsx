import ShadAnalytics from "@/components/shad/analytics";
import { router } from "expo-router";

export default function Products() {
  return <ShadAnalytics navigate={router.navigate} />;
}
