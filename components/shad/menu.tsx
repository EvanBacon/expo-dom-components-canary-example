// App.js
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Dimensions,
  I18nManager,
} from "react-native";
import {
  GestureHandlerRootView,
  PanGestureHandler,
  TouchableOpacity,
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

I18nManager.forceRTL(true);
I18nManager.allowRTL(true);

const isRTL = I18nManager.isRTL;

interface MenuProps {
  menuItems: any;
}

export default function Menu({ menuItems }: MenuProps) {
  const handleAddToCart = (item: any) => {
    // TODO: Implement cart logic
    console.log(`Added ${item.name} to the cart`);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  // TODO: Implement navigation using resId prop, two seconds probably, goodnight
  const onClick = (itemId: string) => {
    router.navigate(`/restaurant/item/${restaruantId}/${itemId}`);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        {Object.entries(menuItems).map(
          ([categoryName, items]: any, categoryIndex) => (
            <View key={categoryIndex} style={styles.categoryContainer}>
              <Text style={styles.category}>{categoryName}</Text>
              {items.map((item: any, itemIndex: any) => (
                <SwipeableItem
                  key={itemIndex}
                  item={item}
                  handleAddToCart={handleAddToCart}
                  onClick={onClick}
                />
              ))}
            </View>
          ),
        )}
      </ScrollView>
    </GestureHandlerRootView>
  );
}

interface SwipeableItemProps {
  item: any;
  handleAddToCart: (item: any) => void;
  onClick: (itemId: string) => void;
}

const SwipeableItem = ({
  item,
  handleAddToCart,
  onClick,
}: SwipeableItemProps) => {
  const [hapticFired, setHapticFired] = useState(false);
  const translateX = useSharedValue(0);
  const SCREEN_WIDTH = Dimensions.get("window").width;
  const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25; // Positive threshold

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
    return { transform: [{ scale }] };
  });

  return (
    <TouchableOpacity
      style={{ overflow: "hidden" }}
      onPress={() => onClick(item._id as string)}
    >
      {/* Background with check icon */}
      <View style={styles.rightAction}>
        <Animated.View style={[styles.iconContainer, iconScaleStyle]}>
          <Check size={32} color="#fff" />
        </Animated.View>
      </View>
      {/* Swipeable item */}
      <PanGestureHandler
        onGestureEvent={panGesture}
        // Add the following props:
        activeOffsetX={[-15, 15]}
        failOffsetY={[-15, 15]}
      >
        <Animated.View style={[styles.itemContainer, animatedStyle]}>
          <View style={styles.itemContent}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemName}>{item.name}</Text>
            </View>
            <Text style={styles.itemDescription}>{item.description}</Text>
            <Text style={styles.itemPrice}>₪{item.price.toFixed(2)}</Text>
          </View>
          <ExpoImage
            defaultSource={item.imageUrl}
            uri={item.imageUrl}
            style={styles.itemImage}
          />
        </Animated.View>
      </PanGestureHandler>
    </TouchableOpacity>
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
  },
  itemDescription: {
    fontSize: 14,
    color: "#4B5563", // text-gray-600
    marginTop: 4,
    textAlign: "left",
    paddingRight: 16,
  },
  itemPrice: {
    color: "#FF8000",
    marginTop: 4,
    fontWeight: "500",
    textAlign: "left",
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
    width: "100%",
    backgroundColor: "#FD8000",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingHorizontal: 20,
  },
  iconContainer: {
    marginRight: 16, // Adjust as needed
  },
});
