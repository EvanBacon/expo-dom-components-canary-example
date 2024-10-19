"use dom";

import "@/global.css";

import ShadLayout from "@/components/shad/shad-layout";
import { Button } from "@/components/ui/button";
import { useGlobalButtonHaptics } from "../global-button-haptics";
import { ArrowRight } from "lucide-react";

export default function BackButton({
  navigate,
  notify,
  onButtonClick,
}: {
  notify: () => void;
  onButtonClick: () => Promise<void>;
} & Props) {
  useGlobalButtonHaptics(onButtonClick);
  return (
    <ShadLayout navigate={navigate}>
      <Button className="p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors">
        <ArrowRight
          className="w-6 h-6 text-[#FD8000]"
          onClick={() => {
            onButtonClick();
          }}
        />
      </Button>
    </ShadLayout>
  );
}

type Props = {
  navigate: (typeof import("expo-router").router)["navigate"];

  ref?: import("react").RefObject<import("react-native-webview").WebView>;
  dom?: import("expo/dom").DOMProps;
};
