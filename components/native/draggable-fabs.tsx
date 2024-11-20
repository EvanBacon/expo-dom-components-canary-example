import React, { useState, useEffect, createContext, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  I18nManager,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  useAnimatedGestureHandler,
  runOnJS,
  useDerivedValue,
} from "react-native-reanimated";
import {
  PanGestureHandler,
  TapGestureHandler,
} from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCartStore } from "@/lib/store/orderStore";
import tw from "twrnc";
import { Scroll, ScrollTextIcon } from "lucide-react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const FABSIZE = 80;

// Create a context to store FAB positions
const FABsContext = createContext({
  fabPositions: {},
  updateFabPosition: (id: any, position: any) => {},
});

const DraggableExpandableFABs = () => {
  const [fabPositions, setFabPositions] = useState({});
  const { fetchActiveOrders, activeOrders } = useCartStore();

  const updateFabPosition = (id: any, position: any) => {
    setFabPositions((prevPositions) => ({
      ...prevPositions,
      [id]: position,
    }));
  };

  React.useEffect(() => {
    setInterval(() => {
      fetchActiveOrders();
    }, 10000);
  }, []);

  return (
    <FABsContext.Provider value={{ fabPositions, updateFabPosition }}>
      <View style={styles.container}>
        {activeOrders.map((order) => (
          <DraggableExpandableFAB
            key={order._id}
            id={order._id}
            initialPosition={{ x: 20, y: 100 }}
            color="#fd8000"
            label={order.restaurantName}
            expandedContent={
              <View style={tw`flex-1 items-center justify-center`}>
                <Text style={styles.modalText}>הזמנה</Text>
                <Text>{order.restaurantName}</Text>
                {order.items.map((item: any) => (
                  <Text key={item._id}>
                    {item.quantity} x {item.name}
                  </Text>
                ))}
                <Text>
                  {order.status === "pending" ? "בדרך אליך" : "הזמנה הושלמה"}
                </Text>
              </View>
            }
          />
        ))}
      </View>
    </FABsContext.Provider>
  );
};

interface DraggableExpandableFABProps {
  id: string;
  initialPosition: { x: number; y: number };
  color: string;
  label: string;
  expandedContent: React.ReactNode;
}

const DraggableExpandableFAB: React.FC<DraggableExpandableFABProps> = ({
  id,
  initialPosition,
  color,
  label,
  expandedContent,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const insets = useSafeAreaInsets();

  const { fabPositions, updateFabPosition } = useContext(FABsContext);

  // Shared values for position
  const x = useSharedValue(initialPosition.x);
  const y = useSharedValue(initialPosition.y);

  // Listen to x and y changes
  useDerivedValue(() => {
    runOnJS(updateFabPosition)(id, { x: x.value, y: y.value });
  }, [x, y]);

  // Shared values for before expansion animation
  const xBeforeExpand = useSharedValue(initialPosition.x);
  const yBeforeExpand = useSharedValue(initialPosition.y);

  // Shared values for expansion animation
  const borderRadius = useSharedValue(FABSIZE / 2);
  const fabWidth = useSharedValue(FABSIZE);
  const fabHeight = useSharedValue(FABSIZE);

  const checkForOverlap = () => {
    // Get positions of other FABs
    const otherFABs = Object.entries(fabPositions).filter(
      ([key]) => key !== id,
    );

    otherFABs.forEach(([otherId, otherPosition]: any) => {
      const dx = x.value - otherPosition.x;
      const dy = y.value - otherPosition.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      const minDistance = fabWidth.value; // Assuming FABs are circles with diameter of fabWidth

      if (distance < minDistance) {
        // They are overlapping, move this FAB away
        const angle = Math.atan2(dy, dx);
        const overlap = minDistance - distance;

        const offsetX = Math.cos(angle) * overlap;
        const offsetY = Math.sin(angle) * overlap;

        // Temporarily calculate new positions
        let newX = x.value + offsetX * 1.2;
        let newY = y.value + offsetY * 1.2;

        // Constrain the new positions to screen boundaries
        const leftBound = insets.left;
        const rightBound = SCREEN_WIDTH - fabWidth.value - insets.right;
        const topBound = insets.top;
        const bottomBound = SCREEN_HEIGHT - fabHeight.value - insets.bottom;

        newX = Math.max(leftBound, Math.min(newX, rightBound));
        newY = Math.max(topBound, Math.min(newY, bottomBound));

        // Animate to the constrained position
        x.value = withTiming(newX, { duration: 300 });
        y.value = withTiming(newY, { duration: 300 });
      }
    });
  };

  // Gesture handling for dragging
  const panGestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      if (isExpanded) return; // Disable dragging when expanded
      context.startX = x.value;
      context.startY = y.value;
    },
    onActive: (event, context: any) => {
      if (isExpanded) return; // Disable dragging when expanded

      // Adjust the x translation based on RTL or LTR
      const adjustedTranslationX = I18nManager.isRTL
        ? -event.translationX
        : event.translationX;

      x.value = context.startX + adjustedTranslationX;
      y.value = context.startY + event.translationY;

      // Constrain within safe area boundaries
      const leftBound = insets.left + 5;
      const rightBound = SCREEN_WIDTH - fabWidth.value - insets.right - 5;
      const topBound = insets.top + 45;
      const bottomBound = SCREEN_HEIGHT - fabHeight.value - insets.bottom - 50;

      x.value = Math.max(leftBound, Math.min(x.value, rightBound));
      y.value = Math.max(topBound, Math.min(y.value, bottomBound));
    },
    onEnd: (_) => {
      if (isExpanded) return;
      // After dragging ends, check for overlaps
      runOnJS(checkForOverlap)();
    },
  });

  // Handle tap to expand/collapse
  const onTapGestureEvent = () => {
    setIsExpanded(!isExpanded);

    if (!isExpanded) {
      // Expand the FAB
      borderRadius.value = withTiming(0, {
        duration: 300,
        easing: Easing.out(Easing.ease),
      });
      xBeforeExpand.value = x.value;
      yBeforeExpand.value = y.value;
      x.value = withTiming(0, {
        duration: 300,
        easing: Easing.out(Easing.ease),
      });
      y.value = withTiming(0, {
        duration: 300,
        easing: Easing.out(Easing.ease),
      });
      fabWidth.value = withTiming(SCREEN_WIDTH, {
        duration: 300,
        easing: Easing.out(Easing.ease),
      });
      fabHeight.value = withTiming(SCREEN_HEIGHT, {
        duration: 300,
        easing: Easing.out(Easing.ease),
      });
    } else {
      // Collapse the FAB
      borderRadius.value = withTiming(FABSIZE / 2, {
        duration: 300,
        easing: Easing.in(Easing.ease),
      });
      x.value = withTiming(xBeforeExpand.value, {
        duration: 300,
        easing: Easing.in(Easing.ease),
      });
      y.value = withTiming(yBeforeExpand.value, {
        duration: 300,
        easing: Easing.in(Easing.ease),
      });
      fabWidth.value = withTiming(FABSIZE, {
        duration: 300,
        easing: Easing.in(Easing.ease),
      });
      fabHeight.value = withTiming(FABSIZE, {
        duration: 300,
        easing: Easing.in(Easing.ease),
      });
    }
  };

  // Animated styles
  const animatedStyle = useAnimatedStyle(() => {
    return {
      position: "absolute",
      left: x.value,
      top: y.value,
      width: fabWidth.value,
      height: fabHeight.value,
      borderRadius: borderRadius.value,
      // Add shadow styles
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    };
  });

  const contentOpacity = useSharedValue(0);
  const contentAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: contentOpacity.value,
    };
  });

  // Handle content opacity based on expansion state
  useEffect(() => {
    contentOpacity.value = withTiming(isExpanded ? 1 : 0, { duration: 300 });
  }, [isExpanded]);

  return (
    <>
      <PanGestureHandler onGestureEvent={panGestureHandler}>
        <Animated.View style={[animatedStyle]}>
          <TapGestureHandler onEnded={onTapGestureEvent}>
            <Animated.View style={[styles.fab, { backgroundColor: color }]}>
              {isExpanded ? (
                <Animated.View
                  style={[styles.expandedContent, contentAnimatedStyle]}
                >
                  <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                    keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {expandedContent}
                  </KeyboardAvoidingView>
                </Animated.View>
              ) : (
                <>
                  <ScrollTextIcon size={40} color="#fff" />
                </>
              )}
            </Animated.View>
          </TapGestureHandler>
        </Animated.View>
      </PanGestureHandler>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    width: "100%",
    height: "100%",
    borderRadius: FABSIZE / 2,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  fabText: {
    color: "#fff",
    fontSize: 12,
    marginTop: 4,
  },
  expandedContent: {
    flex: 1,
    width: "100%",
    height: "100%",
    paddingTop: 40,
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 20,
  },
  modalText: {
    fontSize: 24,
    textAlign: "center",
  },
});

export default DraggableExpandableFABs;
