import { Tabs } from "expo-router";
import { House, ShoppingCart, Package, LineChart } from "lucide-react-native";

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
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
