import { router, Slot } from "expo-router";

import { ShadLayoutFull } from "@/components/shad-layout";

export default function RootLayout() {
  return (
    <ShadLayoutFull navigate={router.navigate}>
      <Slot />
    </ShadLayoutFull>
  );
}
