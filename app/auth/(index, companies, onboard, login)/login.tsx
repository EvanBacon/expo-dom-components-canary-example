import Login from "@/components/shad/login";
import { Stack, router } from "expo-router";
import { useScrollRef } from "@/lib/tab-to-top";
import * as Haptics from "expo-haptics";
import { useCompanyStore } from "@/lib/store/companyStore";
import { useCallback, useEffect, useState } from "react";
import { KeyboardAvoidingView, NativeSyntheticEvent } from "react-native";
import { useAuth } from "@/components/providers/auth-provider";
import LottieView from "lottie-react-native";

export default function LoginRoute() {
  const ref = useScrollRef();
    const auth = useAuth();
  const { selectedCompany } = useCompanyStore();

  useEffect(() => {
    if (auth.user) router.navigate("/");
  }, [auth.user]);

  return (
      <>
      <Stack.Screen options={{
          title: "התחברות",
          headerTitleStyle: { fontFamily: "fredoka-semibold", fontSize: 20 },
      }} />
    <Login
      ref={ref}
      navigate={router.navigate}
      auth={auth}
      login={auth.login}
      selectedCompany={selectedCompany}
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
    <LottieView
        source={require("@/assets/lottie/bike.json")}
        autoPlay
        loop
        style={{
            position: "absolute",
            bottom: 0,
            height: "30%",
            width: "100%",
            zIndex: -1,
        }}
    />
    </>
  );
}



