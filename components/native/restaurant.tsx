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
import useMenu, { useMenuStore } from "@/lib/hooks/useMenu";
import { useRestaurantStore } from "@/lib/store/restaurantStore";
import CartOpenButton from "./cart-button";
import LottieView from "lottie-react-native";

interface RestaurantScreenProps {
  restaurantId: string;
}

export default function RestaurantScreen({
  restaurantId,
}: RestaurantScreenProps) {
  const scrollY = useSharedValue(0); // Shared scroll value for Reanimated v2
  const [targetY, setTargetY] = useState(0); // State for target Y position
  const scrollRef = useRef<Animated.ScrollView>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { restaurants } = useRestaurantStore();
  const { categoryRefs } = useMenuStore();
  const [cartOpen, setCartOpen] = useState(false);

  const { menu: menuItems, categories, loading } = useMenu(restaurantId);
  const restaurant = restaurants.find((r) => r._id === restaurantId);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y; // Update the shared scroll value
      async () =>
        categories.forEach((category) => {
          let ref = categoryRefs[category._id];
          if (ref?.current) {
            ref.current.measureLayout(scrollRef.current, (x: any, y: any) => {
              if (scrollY.value >= y - 100) {
                setSelectedCategory(category._id);
              }
            });
          }
        });
    },
  });

  useEffect(() => {
    async function changeSelectedCategoryId() {}

    changeSelectedCategoryId();
  }, [scrollY.value]);

  const handleLayout = (event: any) => {
    const { y } = event.nativeEvent.layout;
    setTargetY(y);
  };

  const scrollToCategory = async (categoryId: string) => {
    let ref = categoryRefs[categoryId];

    ref.current.measureLayout(scrollRef.current, (x: any, y: any) => {
      scrollRef?.current?.scrollTo({ y: y - 100, animated: true });
    });
  };

  const onChangeCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    scrollToCategory(categoryId);
  };

  return (
    <>
      <View>
        <SafeAreaView style={{ zIndex: 20, flex: 1 }}>
          <RestaurantHeader
            scrollY={scrollY}
            restaurant={restaurant}
            menuY={targetY}
            categories={categories as any[]}
            category={selectedCategory as any}
            onCategoryChange={onChangeCategory}
          />
        </SafeAreaView>
        <ScaleHeader
          Uri={restaurant?.profile?.banner as string}
          scrollY={scrollY}
        />

        <Animated.ScrollView
          ref={scrollRef}
          style={{ flexGrow: 1 }}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          contentContainerStyle={{
            flexGrow: 1,
            direction: "rtl",
            minWidth: "100%",
            paddingVertical: 12,
            paddingBottom: 32,
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
              {restaurant?.operatingData.status === "open" ? "פתוח" : "סגור"}{" "}
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
                {`ב${
                  restaurant?.deliveryTime - 10
                }-${restaurant?.deliveryTime}`}{" "}
                דקות
              </Text>
            </TouchableOpacity>
          </View>
          {menuItems?.length > 0 ? (
            <View style={{ flex: 1 }} onLayout={handleLayout}>
              <OrdersRoute menuItems={menuItems} restaruantId={restaurantId} />
            </View>
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                height: Dimensions.get("window").height * 0.5,
              }}
            >
              <LottieView
                source={require("../../assets/lottie/loading.json")}
                autoPlay
                loop
                style={{
                  width: Dimensions.get("window").width * 0.5,
                  height: Dimensions.get("window").width * 0.5,
                }}
              />
            </View>
          )}
        </Animated.ScrollView>
      </View>
      <SafeAreaView
        style={{
          position: "absolute",
          bottom: 10,
          width: "100%",
        }}
      >
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <CartOpenButton />
        </View>
      </SafeAreaView>
    </>
  );
}
