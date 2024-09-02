import Cropper from "@/components/mobile-cropper";
import { IS_DOM } from "expo/dom";
import { View } from "react-native";

const baseUrl = IS_DOM ? process.env.EXPO_DOM_BASE_URL : "";

export default function CropPage() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "black",
      }}
    >
      <Cropper
        image={baseUrl + "/placeholder-user.jpg"}
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
