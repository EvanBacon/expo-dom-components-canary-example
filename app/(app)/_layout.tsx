import { useAuth } from "@/components/providers/auth-provider";
import { ShadLayoutFull } from "@/components/shad/shad-layout";
import { useCompanyStore } from "@/lib/store/companyStore";
import { Redirect, router, Slot } from "expo-router";
import { useEffect } from "react";

export default function RootLayout() {
  const { user, isLoggedIn } = useAuth();
  if (!user && !isLoggedIn) return <Redirect href="/auth" />;
  const { fetchSelectedCompanyData, selectedCompany} = useCompanyStore();

  useEffect(() => {
      fetchSelectedCompanyData();
  }, [selectedCompany]);

  return (
    <ShadLayoutFull navigate={router.navigate}>
      <Slot />
    </ShadLayoutFull>
  );
}

