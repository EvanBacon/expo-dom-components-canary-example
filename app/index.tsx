import { View } from "react-native";
import DomView from "@/components/DomView";
import { useState } from "react";

// This component is platform-specific.

export default function Index() {
  const [index, setIndex] = useState(0);
  return (
    <View style={{ flex: 1 }}>
      <DomView
        index={index}
        onPress={() => setIndex((index) => index + 1)}
        dom={{
          scrollEnabled: false,
        }}
      />
    </View>
  );
}
