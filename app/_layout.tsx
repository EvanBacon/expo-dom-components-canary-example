import { Redirect, Slot, SplashScreen, router } from "expo-router";
import { AuthProvider } from "@/components/providers/auth-provider";
import { useFonts } from "expo-font";
import { ActivityIndicator, View } from "react-native";
import { initializeUserStore } from "@/lib/store/loginStore";
import { useEffect } from "react";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    fredoka: require("@/assets/fonts/fredoka-regular.ttf"),
    "fredoka-bold": require("@/assets/fonts/fredoka-bold.ttf"),
    "fredoka-semibold": require("@/assets/fonts/fredoka-semibold.ttf"),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (process.env.EXPO_OS === "web")
    return (
      <AuthProvider>
        <Slot />
      </AuthProvider>
    );

  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}
