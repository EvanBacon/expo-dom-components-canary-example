import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
} from "react-native-reanimated";
import OrdersRoute from "@/components/shad/menu"; // Import the DOM component for menu
import ScaleHeader from "@/components/native/scale-header"; // Import the animated Header component
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { Truck } from "lucide-react-native";
import RestaurantHeader from "./res-header";
import useMenu from "@/lib/hooks/useMenu";
import { useRestaurantStore } from "@/lib/store/restaurantStore";

interface RestaurantScreenProps {
  restaurantId: string;
}

export default function RestaurantScreen({
  restaurantId,
}: RestaurantScreenProps) {
  const scrollY = useSharedValue(0); // Shared scroll value for Reanimated v2
  const [targetY, setTargetY] = useState(0); // State for target Y position
  const heightArray = useRef<number[]>([]); // Ref for storing individual category heights
  const categoryScrollValues = useRef(new Map<string, number>()); // Ref for storing category scroll values
  const scrollRef = useRef<Animated.ScrollView>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { restaurants } = useRestaurantStore();

  const { menu: menuItems, categories, loading } = useMenu(restaurantId);
  const restaurant = restaurants.find((r) => r._id === restaurantId);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y; // Update the shared scroll value
    },
  });

  const handleLayout = (event: any) => {
    const { y } = event.nativeEvent.layout;
    setTargetY(y);
  };

  const scrollToCategory = (category: string) => {
    const y = categoryScrollValues.current.get(category); // Get the Y position from the ref
    if (y) {
      scrollRef.current?.scrollTo({ y: y - targetY, animated: true });
    }
  };

  useEffect(() => {
    if (selectedCategory) {
      scrollToCategory(selectedCategory);
    }
  }, [selectedCategory]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <RestaurantHeader
        scrollY={scrollY}
        menuY={targetY}
        categories={categories as string[]}
        category={selectedCategory as string}
        onCategoryChange={setSelectedCategory}
      />
      <ScaleHeader
        Uri={restaurant?.profile?.banner as string}
        scrollY={scrollY}
      />

      <Animated.ScrollView
        ref={scrollRef}
        style={{ flexGrow: 1, marginBottom: 20 }}
        onScroll={scrollHandler}
        scrollEventThrottle={16} // Optimize scroll event handling
        contentContainerStyle={{
          flexGrow: 1,
          minWidth: "100%",
          paddingVertical: 12,
          paddingTop: Dimensions.get("window").height * 0.33, // Add padding to the top
        }}
      >
        <View
          style={{
            padding: 8,
            alignItems: "center",
            width: "100%",
            marginBottom: 20,
            paddingHorizontal: 20,
          }}
        >
          <Text
            style={{
              fontSize: 32,
              fontFamily: "fredoka-bold",
              marginBottom: 12,
              color: "#333",
            }}
          >
            {restaurant?.name}
          </Text>

          <Text
            style={{
              fontSize: 16,
              marginTop: 12,
              marginBottom: 8,
              textAlign: "center",
            }}
          >
            ☆ {restaurant?.rating} •{" "}
            {restaurant?.operatingData.status === "Open" ? "פתוח" : "סגור"}{" "}
            עכשיו •{" "}
            {`${restaurant?.deliveryTime - 10}-${restaurant?.deliveryTime}`}{" "}
            דקות • {restaurant?.distance} ק"מ •{" "}
            <Text
              style={{
                color: "#FD8000",
                fontFamily: "fredoka-semibold",
              }}
            >
              מידע נוסף
            </Text>
          </Text>
          <TouchableOpacity
            style={{
              flex: 1,
              flexDirection: "row",
              padding: 8,
              width: "100%",
              backgroundColor: "#FD800020",
              borderRadius: 8,
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              marginTop: 12,
            }}
          >
            <Truck
              size={24}
              color="#FD8000"
              style={{ transform: [{ rotateY: "180deg" }] }}
            />
            <Text
              style={{
                color: "#FD8000",
                textAlign: "center",
                fontWeight: "bold",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
              }}
            >
              מסירה{" "}
              {`ב${restaurant?.deliveryTime - 10}-${restaurant?.deliveryTime}`}{" "}
              דקות
            </Text>
          </TouchableOpacity>
        </View>
        {categories !== null ? (
          <View style={{ flex: 1 }} onLayout={handleLayout}>
            <OrdersRoute menuItems={menuItems} />
          </View>
        ) : (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text
              style={{
                fontSize: 20,
                fontFamily: "fredoka-bold",
                color: "#333",
              }}
            >
              טוען תפריט...
            </Text>
          </View>
        )}
      </Animated.ScrollView>
    </SafeAreaView>
  );
}
