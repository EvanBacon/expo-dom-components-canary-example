import { ShadLayoutFull } from "@/components/shad/shad-layout";
import { router, Slot } from "expo-router";

export default function RootLayout() {
  return (
    <ShadLayoutFull navigate={router.navigate}>
      <Slot />
    </ShadLayoutFull>
  );
}
