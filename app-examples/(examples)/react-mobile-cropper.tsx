import Cropper from "@/components/mobile-cropper";
import { View } from "react-native";

export default function CropPage() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "black",
      }}
    >
      <Cropper
        image={process.env.EXPO_DOM_BASE_URL + "/placeholder-user.jpg"}
        dom={{
          scrollEnabled: false,
          webviewDebuggingEnabled: true,
          style: {
            flex: 1,
          },
        }}
      />
    </View>
  );
}
