"use dom";

import "@/global.css";

import { useGlobalButtonHaptics } from "../global-button-haptics";
import { ScrollView } from "react-native";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "../ui/avatar";
import ShadLayout from "./shad-layout";
import { useEffect } from "react";

export default function CompanyList({
  navigate,
  onButtonClick,
  onSelectChange,
  search,
  store,
}: {
  onButtonClick: (size: number) => Promise<void>;
  onSelectChange: (item: any) => void;
  search: string;
  store: any;
} & Props) {
  useGlobalButtonHaptics(onButtonClick);
  // On selection
  const handleSelection = (item: any) => {
    onSelectChange(item);
    navigate("/auth/onboard");
  };

  const filteredItems = store.companies.filter((item: any) =>
    item.name.includes(search),
  );

  // Define Framer Motion variants for the list items
  const itemVariants = {
    hidden: { opacity: 0, y: 10 }, // Slightly offset with 10px vertical shift
    visible: { opacity: 1, y: 0 },
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        marginTop: 8,
        backgroundColor: "white",
        direction: "rtl",
        padding: 8,
        height: "100%",
      }}
    >
      {filteredItems.map((item: any) => (
        <motion.li
          key={item.tenantId} // Using tenantId as the key
          className="flex items-center bg-white border border-gray-200 rounded-lg p-3 shadow-md transition-all duration-100 ease-in-out active:bg-gray-100 cursor-pointer mx-1"
          onClick={() => {
            handleSelection(item);
          }}
          initial="hidden"
          animate="visible"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }} // Trigger animation when 10% of the item is in view
          variants={itemVariants}
          transition={{ duration: 0.25, ease: "easeOut" }} // Fast and smooth transition
        >
          <Avatar className="ml-6">
            <AvatarFallback>{/* Empty avatar */}</AvatarFallback>
          </Avatar>
          <span className="flex-grow text-right ml-3 font-medium">
            {item.name}
          </span>
        </motion.li>
      ))}
    </ScrollView>
  );
}

type Props = {
  navigate: (typeof import("expo-router").router)["navigate"];
  ref?: import("react").RefObject<import("react-native-webview").WebView>;
  dom?: import("expo/dom").DOMProps;
};
