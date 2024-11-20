import CompanyList from "@/components/shad/company-list";
import { Stack, router } from "expo-router";
import { useScrollRef } from "@/lib/tab-to-top";
import * as Haptics from "expo-haptics";
import { useCompanyStore } from "@/lib/store/companyStore";
import { useCallback, useEffect, useState } from "react";
import { NativeSyntheticEvent } from "react-native";

export default function CompanyListRoute() {
  const ref = useScrollRef();
  const companyStore = useCompanyStore();
  const [search, setSearch] = useState("");

  useEffect(() => {
    companyStore.fetchCompanies();
  }, []);

  return (
      <>
      <Stack.Screen options={{
            headerSearchBarOptions: {
            placeholder: "חיפוש חברה",
            tintColor: "#fd8000",
            onChangeText: (text: NativeSyntheticEvent<any>) => {
                setSearch(text.nativeEvent.text);
            },
            cancelButtonText: "ביטול",
            hideWhenScrolling: false,
          },
          title: "חברות",
          headerTitleStyle: { fontFamily: "fredoka-semibold", fontSize: 20 },
      }} />
    <CompanyList
      ref={ref}
      navigate={router.navigate}
      store={companyStore}
      onSelectChange={companyStore.setSelectedCompany}
      search={search}
      dom={{
        contentInsetAdjustmentBehavior: "automatic",
        automaticallyAdjustsScrollIndicatorInsets: true,
      }}
      onButtonClick={async (size: number) => {
        if (process.env.EXPO_OS !== "web") {
          Haptics.impactAsync(
            [
              Haptics.ImpactFeedbackStyle.Light,
              Haptics.ImpactFeedbackStyle.Medium,
              Haptics.ImpactFeedbackStyle.Heavy,
            ][size]
          );
        }
      }}
    />
    </>
  );
}


