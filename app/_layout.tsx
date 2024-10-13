import { Slot, Tabs } from "expo-router";
import { House, ShoppingCart, Package, LineChart } from "lucide-react-native";
import { BlurView } from "expo-blur";
import { StyleSheet } from "react-native";
import { HapticTab } from "@/components/haptic-tab";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // TODO: Add tab bar
  if (process.env.EXPO_OS === "web") return <Slot />;
  return (
    <Tabs
      screenOptions={{
        lazy: false,
        tabBarButton: HapticTab,
        headerShown: false,
        tabBarActiveTintColor: "rgb(15, 23, 42)",
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
          title: "Dashboard",
          tabBarIcon: (props) => <House {...props} />,
        }}
      />
      <Tabs.Screen
        name="(orders)"
        options={{
          title: "Orders",
          tabBarIcon: (props) => <ShoppingCart {...props} />,
        }}
      />
      <Tabs.Screen
        name="(products)"
        options={{
          title: "Products",
          tabBarIcon: (props) => <Package {...props} />,
        }}
      />
      <Tabs.Screen
        name="(analytics)"
        options={{
          title: "Analytics",
          tabBarIcon: (props) => <LineChart {...props} />,
        }}
      />
    </Tabs>
  );
}
