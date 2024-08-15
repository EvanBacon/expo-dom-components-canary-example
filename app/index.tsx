import { View } from "react-native";
import Dashboard from "@/components/dashboard";
import { router } from "expo-router";

// This component is platform-specific.

export default function Index() {
  return (
    <View style={{ flex: 1 }}>
      <Dashboard navigate={router.navigate} />
    </View>
  );
}
