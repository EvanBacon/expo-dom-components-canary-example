import { Slot, Tabs } from "expo-router";
import { House, ShoppingCart, Package, LineChart } from "lucide-react-native";
import * as Haptics from "expo-haptics";

export default function RootLayout() {
  // TODO: Add tab bar
  // if (process.env.EXPO_OS === "web")
  return <Slot />;
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "rgb(15, 23, 42)",
      }}
      screenListeners={{
        tabPress: () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        },
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
