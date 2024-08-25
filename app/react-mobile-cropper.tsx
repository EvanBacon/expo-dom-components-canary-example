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
        image={"/placeholder-user.jpg"}
        dom={{
          scrollEnabled: false,
          style: {
            flex: 1,
          },
        }}
      />
    </View>
  );
}
