import { Slot, Stack, Tabs } from "expo-router";
import { Drawer } from "expo-router/drawer";
import Ionicons from "@expo/vector-icons/Ionicons";
import { View } from "react-native";

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        header(props) {
          return <View></View>;
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon(props) {
            return <Ionicons name="home" {...props} />;
          },
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarIcon(props) {
            return <Ionicons name="cart" {...props} />;
          },
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: "Products",
          tabBarIcon(props) {
            return <Ionicons name="contract" {...props} />;
          },
        }}
      />
      <Tabs.Screen
        name="analytics"
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
