import { ShadLayoutFull } from "@/components/shad/shad-layout";
import { Slot } from "expo-router";
import { navigate } from "expo-router/build/global-state/routing";

export default function RootLayout() {
  return (
    <ShadLayoutFull navigate={navigate}>
      <Slot />
    </ShadLayoutFull>
  );
}
