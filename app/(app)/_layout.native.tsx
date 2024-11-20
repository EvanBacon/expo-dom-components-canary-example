import { Redirect, Tabs } from "expo-router";
import { Utensils, User } from "lucide-react-native";
import { BlurView } from "expo-blur";
import { StyleSheet, View } from "react-native";
import { HapticTab } from "@/components/haptic-tab";
import * as SplashScreen from "expo-splash-screen";
import { useAuth } from "@/components/providers/auth-provider";
import React, { useEffect, useState } from "react";
import { useRestaurantStore } from "@/lib/store/restaurantStore";
import { initializeUserStore, useLoginStore } from "@/lib/store/loginStore";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import DraggableExpandableFABs from "@/components/native/draggable-fabs";
import { SafeAreaView } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { user, isLoggedIn } = useAuth();
  const { tenantId } = useLoginStore();
  const { fetchRestaurants } = useRestaurantStore();
  const [sureRedirect, setSureRedirect] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const promises = [initializeUserStore()];

    Promise.all(promises)
      .then(() => {
        setIsReady(true);
        setTimeout(() => {
            SplashScreen.hideAsync();
        }, 1);
      })
      .catch((error) => {
        setIsReady(true);
        setTimeout(() => {
            SplashScreen.hideAsync();
        }, 1);
      });
  }, []);

  if (!isReady) return null;
  if (!isLoggedIn && !user) return <Redirect href="/auth" />;

  return (
      <GestureHandlerRootView style={{ flex: 1 }}>
    <Tabs
      screenOptions={{
        lazy: false,
        tabBarButton: HapticTab,
        headerShown: false,
        tabBarActiveTintColor: "#fd8000",
        tabBarStyle: {
          position: "absolute",
        },
        tabBarBackground: () => (
          <BlurView
            tint="light"
            intensity={100}
            style={StyleSheet.absoluteFill}
          />
        ),
      }}
    >
      <Tabs.Screen
        name="(index)"
        options={{
          title: "מסעדות",
          tabBarIcon: (props) => <Utensils {...props} strokeWidth={2.5} />,
        }}
      />
      <Tabs.Screen
        name="(profile)"
        options={{
          title: "פרופיל",
          tabBarIcon: (props) => <FontAwesome name="user-circle" {...props} />,
        }}
      />
    </Tabs>
    <View style={{ position: "absolute" }}>
    <DraggableExpandableFABs />
    </View>
    </GestureHandlerRootView>
  );
}

