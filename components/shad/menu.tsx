// App.js
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Dimensions,
  I18nManager,
  TouchableOpacity,
} from "react-native";
import {
  GestureHandlerRootView,
  PanGestureHandler,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  runOnJS,
  withTiming,
  Extrapolate,
} from "react-native-reanimated";
import { Check } from "lucide-react-native";
import { Image as ExpoImage } from "react-native-expo-image-cache";
import { router } from "expo-router";
import useMenu, { useMenuStore } from "@/lib/hooks/useMenu";
import { useCompanyStore } from "@/lib/store/companyStore";

I18nManager.forceRTL(true);
I18nManager.allowRTL(true);

const isRTL = I18nManager.isRTL;

interface MenuProps {
  menuItems: any;
  restaruantId: string;
}

export default function Menu({ menuItems }: MenuProps) {
  const { categories, loading, setCategoryRef, categoryRefs } = useMenuStore();
  const { selectedCompanyData } = useCompanyStore();
  const handleAddToCart = (item: any) => {
    // TODO: Implement cart logic
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onClick(item._id);
  };

  // TODO: Implement navigation using resId prop, two seconds probably, goodnight
  const onClick = (itemId: string) => {
    router.navigate(`/restaurant/item/${itemId}`);
  };

  // create as many refs as there are categories
  useEffect(() => {
    categories.forEach((category) => {
      setCategoryRef(category._id, React.createRef());
    });
  }, [categories]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {categories.map((category: any, categoryIndex) => (
        <View
          key={categoryIndex}
          style={styles.categoryContainer}
          ref={categoryRefs[category._id]}
        >
          <Text style={styles.category}>{category.name}</Text>
          {menuItems
            .filter((item: any) => item.category === category._id)
            .map((item: any, itemIndex: any) => (
              <SwipeableItem
                key={itemIndex}
                item={item}
                handleAddToCart={handleAddToCart}
                onClick={onClick}
                selectedCompanyData={selectedCompanyData}
              />
            ))}
        </View>
      ))}
    </ScrollView>
  );
}

interface SwipeableItemProps {
  item: any;
  handleAddToCart: (item: any) => void;
  onClick: (itemId: string) => void;
  selectedCompanyData: any;
}

const SwipeableItem = ({
  item,
  handleAddToCart,
  onClick,
  selectedCompanyData,
}: SwipeableItemProps) => {
  const [hapticFired, setHapticFired] = useState(false);
  const translateX = useSharedValue(0);
  const SCREEN_WIDTH = Dimensions.get("window").width;
  const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25; // Positive threshold
  const MOVE_RIGHT_THRESHOLD = SCREEN_WIDTH * 0.75; // Negative threshold

  // Direction multiplier based on RTL
  const direction = isRTL ? 1 : -1;

  const panGesture = useAnimatedGestureHandler({
    onStart: (_, context: any) => {
      context.startX = translateX.value;
    },
    onActive: (event, context) => {
      const translation = event.translationX * direction;
      translateX.value = Math.max(0, context.startX + translation);

      if (translateX.value > SWIPE_THRESHOLD && !hapticFired) {
        runOnJS(setHapticFired)(true);
        runOnJS(Haptics.selectionAsync)();
      } else if (translateX.value < SWIPE_THRESHOLD && hapticFired) {
        runOnJS(setHapticFired)(false);
      }
    },
    onEnd: () => {
      if (translateX.value > SWIPE_THRESHOLD) {
        // Register the action
        runOnJS(handleAddToCart)(item);
        // Animate the item back to its original position
        translateX.value = withTiming(0);
      } else {
        // Reset position
        translateX.value = withTiming(0);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value * direction }],
  }));

  const iconScaleStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      translateX.value,
      [0, SWIPE_THRESHOLD],
      [0, 1],
      Extrapolate.CLAMP,
    );

    const marginRight = interpolate(
      translateX.value,
      [0, SWIPE_THRESHOLD],
      [0, 36],
      Extrapolate.CLAMP,
    );

    return {
      transform: [{ scale }],
      marginRight,
    };
  });

  const animatedBackgroundStyle = useAnimatedStyle(() => {
    const width = interpolate(
      translateX.value,
      [0, SWIPE_THRESHOLD],
      [0, SCREEN_WIDTH],
      Extrapolate.CLAMP,
    );
    const opacity = interpolate(
      translateX.value,
      [0, SWIPE_THRESHOLD],
      [0, 1],
      Extrapolate.CLAMP,
    );
    return { width, opacity };
  });

  return (
    <View style={{ overflow: "hidden" }}>
      {/* Background with check icon */}
      <Animated.View style={[styles.rightAction, animatedBackgroundStyle]}>
        <Animated.View style={[styles.iconContainer, iconScaleStyle]}>
          <Check size={32} color="#fff" />
        </Animated.View>
      </Animated.View>
      {/* Swipeable item */}
      <PanGestureHandler
        onGestureEvent={panGesture}
        activeOffsetX={[-15, 15]}
        failOffsetY={[-15, 15]}
      >
        <Animated.View style={[{ flex: 1 }, animatedStyle]}>
          <TouchableWithoutFeedback
            onPress={() => onClick(item._id)}
            style={styles.itemContainer}
          >
            <View style={styles.itemContent}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemName}>{item.name}</Text>
              </View>
              <Text style={styles.itemDescription}>{item.description}</Text>
              <Text style={styles.itemPrice}>
                ₪
                {(
                  item?.price *
                  (100 - selectedCompanyData?.companyContributionPercentage) *
                  0.01
                ).toFixed(2)}
              </Text>
            </View>
            <ExpoImage
              defaultSource={item.imageUrl}
              uri={item.imageUrl}
              style={styles.itemImage}
            />
          </TouchableWithoutFeedback>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexDirection: "column",
    width: "100%",
    backgroundColor: "#fff",
    paddingBottom: 92,
  },
  categoryContainer: {
    marginBottom: 24,
  },
  category: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "fredoka",
    color: "#1F2937", // text-gray-800
    marginBottom: 8,
    textAlign: "left",
    textTransform: "capitalize", // To capitalize category names
    marginLeft: 12,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB", // border-gray-200
    paddingVertical: 8,
  },
  itemContent: {
    flex: 1,
    paddingLeft: 16,
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemName: {
    fontWeight: "600",
    color: "#1F2937", // text-gray-800
    fontSize: 16,
    paddingRight: 16,
    fontFamily: "fredoka-semibold",
  },
  itemDescription: {
    fontSize: 14,
    color: "#4B5563", // text-gray-600
    marginTop: 4,
    textAlign: "left",
    paddingRight: 16,
    fontFamily: "fredoka",
  },
  itemPrice: {
    color: "#FF8000",
    marginTop: 4,
    fontWeight: "500",
    textAlign: "left",
    fontFamily: "fredoka-semibold",
  },
  itemImage: {
    width: 100,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
    resizeMode: "cover",
    backgroundColor: "#F3F4F6", // bg-gray-100
  },
  rightAction: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    backgroundColor: "#FD8000",
    justifyContent: "center",
    alignItems: "flex-end",
  },
  iconContainer: {},
});
