import { useAuth } from "@/components/providers/auth-provider";
import { ShadLayoutFull } from "@/components/shad/shad-layout";
import { Redirect, router, Slot } from "expo-router";

export default function RootLayout() {
  const { user, isLoggedIn } = useAuth();
  if (!user && !isLoggedIn) return <Redirect href="/auth" />;

  return (
    <ShadLayoutFull navigate={router.navigate}>
      <Slot />
    </ShadLayoutFull>
  );
}

