import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

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
          tabBarIcon(props) {
            return <Ionicons name="home" {...props} />;
          },
        }}
      />
      <Tabs.Screen
        name="(orders)"
        options={{
          title: "Orders",
          tabBarIcon(props) {
            return <Ionicons name="cart" {...props} />;
          },
        }}
      />
      <Tabs.Screen
        name="(products)"
        options={{
          title: "Products",
          tabBarIcon(props) {
            return <Ionicons name="gift" {...props} />;
          },
        }}
      />
      <Tabs.Screen
        name="(analytics)"
        options={{
          title: "Analytics",
          tabBarIcon(props) {
            return <Ionicons name="bar-chart" {...props} />;
          },
        }}
      />
    </Tabs>
  );
}
