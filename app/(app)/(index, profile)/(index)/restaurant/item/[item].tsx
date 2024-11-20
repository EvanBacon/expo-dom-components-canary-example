import Item from "@/components/shad/item";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { useScrollRef } from "@/lib/tab-to-top";
import * as Haptics from "expo-haptics";
import { Dimensions, I18nManager, ScrollView } from "react-native";
import React, { useState } from "react";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, interpolate } from "react-native-reanimated";
import { useNavigation } from "expo-router";
import ItemHeader from "@/components/native/item-header";
import useMenu from "@/lib/hooks/useMenu";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import { Alert } from "react-native";
import { useCartStore } from "@/lib/store/orderStore";

export default function ItemRoute() {
  const ref = useScrollRef();
  const { item } = useLocalSearchParams();
  const { addItem } = useCartStore();
  const [height, setHeight] = useState(0);
  const scrollY = useSharedValue(0);
  const navigation = useNavigation();

  const { menu, activeRestaurantId } = useMenu();
  const menuItem = Object.values(menu)
    .flat()
    .find((m: any) => m._id === item) as any;

  React.useLayoutEffect(() => {
    navigation.setOptions({});
  }, [navigation, scrollY]);

  I18nManager.allowRTL(true);
  I18nManager.forceRTL(true);

  const titleStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [220, 270], [1, 0], "clamp");
    const translateY = interpolate(scrollY.value, [220, 270], [0, -3], "clamp");

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  const [order, setOrder] = useState<any>({
    quantity: 1,
    modifiers: [],
  });
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

    // Function to handle adding the item to the cart
  const handleAddToCart = () => {
    const errors: string[] = [];

    // Validate required modifiers
    menuItem?.modifiers.forEach((modifier: any) => {
      if (modifier.required) {
        const hasSelectedModifier = order.modifiers.some(
          (m: any) => m._id === modifier._id && m.options.length > 0,
        );
        if (!hasSelectedModifier) {
          errors.push(modifier.name);
        }
      }
    });

    if (errors.length > 0) {
      setValidationErrors(errors);
      Alert.alert("Error", "Please fill all required fields.");
    } else {
      const cartItem = {
        _id: menuItem?._id,
        name: menuItem?.name,
        price: menuItem?.price,
        quantity: order.quantity,
        modifiers: order.modifiers,
      };

      addItem(activeRestaurantId as string, cartItem);
      router.back();
    }
  };

    // Function to calculate the total price of the item with modifiers
  const calculateTotalPrice = (): number => {
    const modifiersPrice = order.modifiers.reduce((modSum: number, modifier: any) => {
      const itemModifier = menuItem?.modifiers.find(
        (mod: any) => mod._id === modifier._id,
      );
      if (!itemModifier) return modSum;

      const optionsPrice = modifier.options.reduce((optSum: number, option: any) => {
        const itemOption = itemModifier.options.find(
          (opt: any) => opt._id === option._id,
        );
        const optionPrice = itemOption ? itemOption.price : 0;
        return optSum + optionPrice * option.quantity;
      }, 0);

      return modSum + optionsPrice;
    }, 0);

    return (menuItem?.price + modifiersPrice) * order.quantity;
  };


  return (
    <>
      <Stack.Screen
        options={{
          header: () => <ItemHeader scrollY={scrollY} menuItem={menuItem} />,
          headerShown: true,
        }}
      />
      <Animated.ScrollView
        contentInsetAdjustmentBehavior="automatic"
        automaticallyAdjustsScrollIndicatorInsets={true}
        contentContainerStyle={{
          paddingTop: Dimensions.get("window").height * 0.33,
          minHeight: height + Dimensions.get("window").height * 0.33,
        }}
        showsVerticalScrollIndicator={false}
        onScroll={(e) => {
          scrollY.value = e.nativeEvent.contentOffset.y;
        }}
      >
        <Animated.Text
          style={[
            {
              fontFamily: "fredoka-semibold",
              fontSize: 28,
              writingDirection: "rtl",
              marginTop: 20,
              paddingHorizontal: 20,
            },
            titleStyle,
          ]}
        >
          {menuItem?.name}
        </Animated.Text>
        <Item
          item={menuItem as any}
          onHeightChange={setHeight}
          orderState={{
            order: order,
            setOrder: setOrder,
            validationErrors: validationErrors,
            setValidationErrors: setValidationErrors
          }}
          onButtonClick={async (size: number) => {
            if (process.env.EXPO_OS !== "web") {
              Haptics.impactAsync(
                [
                  Haptics.ImpactFeedbackStyle.Light,
                  Haptics.ImpactFeedbackStyle.Medium,
                  Haptics.ImpactFeedbackStyle.Heavy,
                ][size]
              );
            }
          }}
        />
      </Animated.ScrollView>
      <View style={styles.footerContainer}>
        <View style={styles.quantityContainer}>
          <AnimatedButton
            title={"-"}
            onPress={() =>
              setOrder((prev) => ({
                ...prev,
                quantity: Math.max(1, prev.quantity - 1),
              }))
            }
            style={styles.quantityButton}
            textStyle={styles.quantityButtonText}
          />
          <Text style={styles.quantityText}>{order.quantity}</Text>
          <AnimatedButton
            title="+"
            onPress={() =>
              setOrder((prev) => ({
                ...prev,
                quantity: prev.quantity + 1,
              }))
            }
            style={styles.quantityButton}
            textStyle={styles.quantityButtonText}
          />
        </View>

        <AnimatedButton
          title="הוסף להזמנה"
          onPress={() => handleAddToCart()}
          style={styles.addToCartButton}
          textStyle={styles.addToCartButtonText}
        />
      </View>
    </>
  );
}

interface AnimatedButtonProps {
    title: string;
    onPress: () => void;
    style: any;
    textStyle: any;
}

const AnimatedButton:React.FC<AnimatedButtonProps>  = ({ title, onPress, style, textStyle }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 10 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10 });
    onPress();
  };

  return (
    <Animated.View style={[animatedStyle]}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={style}
      >
        <Text style={textStyle}>{title}</Text>
      </Pressable>
    </Animated.View>
  );
};

// Updated Styles
const styles = StyleSheet.create({
  footerContainer: {
    position: "absolute",
    bottom: 16,
    flexDirection: "row",
    backgroundColor: "transparent",
    padding: 16,
    width: "95%", // Full width
    gap: 12,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFF0E0",
    paddingHorizontal: 12,
    borderRadius: 8,
    height: 60,
    width: "35%", // Fixed width
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  quantityButton: {
    marginHorizontal: 3,
    borderRadius: 11,
    backgroundColor: "transparent", // White circular background
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityButtonText: {
    color: "#FD8000",
    fontSize: 17,
    fontWeight: "bold",
  },
  quantityText: {
    fontSize: 24,
    fontFamily: "fredoka-semibold",
    color: "#444",
    marginHorizontal: 8,
  },
  addToCartButton: {
    backgroundColor: "#FD8000",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 60,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    minWidth: "65%",
  },
  addToCartButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
