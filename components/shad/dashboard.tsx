import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useGlobalButtonHaptics } from "../global-button-haptics";
import { TooltipProvider } from "@/components/ui/tooltip";
import CategoriesList from "../native/cuisine-list";
import RestaurantList from "../native/restaurant-list";
import { router } from "expo-router";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export default function DashboardRoute({
  navigate,
  notify,
  onButtonClick,
  restaurants,
}: {
  notify: () => void;
  onButtonClick: (size: number) => Promise<void>;
} & Props) {
  useGlobalButtonHaptics(onButtonClick);
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.section}>
          <View style={styles.header}>
            <Text style={styles.headerText}>אני רוצה לאכול..</Text>
          </View>
          <CategoriesList categories={categories} />
        </View>

        <View style={styles.restaurantsSection}>
          <Text style={styles.restaurantsHeader}>כל המסעדות</Text>
          <View style={styles.restaurantsList}>
            <RestaurantList
              restaurants={restaurants}
              navigate={router.navigate}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const categories = [
  {
    name: "אוכל רחוב",
    places: 281,
    image:
      "https://i.pinimg.com/564x/52/f7/35/52f7358d4dbb4f27b02b7fdab316bef5.jpg",
  },
  {
    name: "סלט",
    places: 200,
    image:
      "https://i.pinimg.com/564x/45/73/d9/4573d97e97a507d2eadbe34261ad0b62.jpg",
  },
  {
    name: "כשר",
    places: 221,
    image:
      "https://i.pinimg.com/564x/b7/0f/da/b70fdaf6b061a817784e3900ba2f6225.jpg",
  },
  {
    name: "פיצה",
    places: 150,
    image:
      "https://i.pinimg.com/564x/e0/c5/b5/e0c5b5ee8e4c56894a8550da6c789d73.jpg",
  },
  {
    name: "המבורגר",
    places: 180,
    image:
      "https://i.pinimg.com/564x/46/11/8f/46118f1a43779595e68d6520a3ab721c.jpg",
  },
];

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    paddingBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "600",
    fontFamily: "fredoka",
  },
  button: {
    color: "#FF8000",
    paddingHorizontal: 8,
    backgroundColor: "#FF8000" + "1A", // 10% opacity
  },
  restaurantsSection: {
    padding: 12,
    paddingTop: 0,
  },
  restaurantsHeader: {
    fontSize: 28,
    fontWeight: "600",
    paddingBottom: 16,
    textAlign: "left",
    fontFamily: "fredoka",
  },
  restaurantsList: {
    gap: 16,
  },
});

type Props = {
  navigate: (typeof import("expo-router").router)["navigate"];
  ref?: import("react").RefObject<import("react-native-webview").WebView>;
  dom?: import("expo/dom").DOMProps;
  restaurants: any;
};
