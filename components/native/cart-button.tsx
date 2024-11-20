import useMenu from "@/lib/hooks/useMenu";
import { useCompanyStore } from "@/lib/store/companyStore";
import { useCartStore } from "@/lib/store/orderStore";
import { router } from "expo-router";
import React from "react";
import { Text, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

export default function CartOpenButton() {
  const { activeRestaurantId } = useMenu();
  const { menu: menuItems } = useMenu();
  const { selectedCompanyData } = useCompanyStore();
  const { carts } = useCartStore();

  const scaleX = useSharedValue(1);
  const scaleY = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scaleX: scaleX.value }, { scaleY: scaleY.value }],
    };
  });

  const onPressIn = () => {
    scaleX.value = withTiming(0.95, { duration: 150 });
    scaleY.value = withTiming(0.95, { duration: 150 });
  };

  const onPressOut = () => {
    scaleX.value = withTiming(1, { duration: 150 });
    scaleY.value = withTiming(1, { duration: 150 });
  };

  if (
    !carts[activeRestaurantId as string] ||
    carts[activeRestaurantId as string].length === 0
  ) {
    return null;
  }

  // Function to calculate the total price of the item with modifiers
  const calculateTotalPrice = (item: any, menuItem: any): number => {
    const modifiersPrice = item.modifiers.reduce(
      (modSum: number, modifier: any) => {
        const itemModifier = menuItem?.modifiers.find(
          (mod: any) => mod._id === modifier._id,
        );
        if (!itemModifier) return modSum;

        const optionsPrice = modifier.options.reduce(
          (optSum: number, option: any) => {
            const itemOption = itemModifier.options.find(
              (opt: any) => opt._id === option._id,
            );
            const optionPrice = itemOption ? itemOption.price : 0;
            return optSum + optionPrice * option.quantity;
          },
          0,
        );

        return modSum + optionsPrice;
      },
      0,
    );

    return (menuItem?.price + modifiersPrice) * item.quantity;
  };

  const calculatePriceWithModifiers = () => {
    return (
      carts[activeRestaurantId as string]
        .map((item) => {
          const menuItem = menuItems.find((m: any) => m._id === item._id);
          return calculateTotalPrice(item, menuItem);
        })
        .reduce((acc, price) => acc + price, 0) *
      (100 - selectedCompanyData.companyContributionPercentage) *
      0.01
    );
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={() => router.push(`/restaurant/cart/${activeRestaurantId}`)}
      >
        <Animated.View style={[styles.button, animatedStyle]}>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              gap: 8,
              alignItems: "center",
            }}
          >
            <View style={styles.quantityCircle}>
              <Text
                style={{
                  color: "#FD8000",
                  fontSize: 16,
                  fontFamily: "fredoka-semibold",
                }}
              >
                {carts[activeRestaurantId as string].length}
              </Text>
            </View>
            <Text style={styles.buttonText}>למעבר לעגלה</Text>
          </View>
          <Text style={styles.priceText}>
            ₪{calculatePriceWithModifiers().toFixed(2)}
          </Text>
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FD8000",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: "95%",
    elevation: 5, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOpacity: 0.25,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 5 },
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "left",
    flex: 1,
  },
  priceText: {
    color: "#FFF",
    fontSize: 18,
    fontFamily: "fredoka-semibold",
    textAlign: "right",
    marginLeft: 10,
  },
  quantityCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
});
