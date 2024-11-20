import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import React from "react";
import { View, Image, Dimensions, Text, PlatformColor } from "react-native";
import Animated, {
  useAnimatedStyle,
  interpolate,
  SharedValue,
  interpolateColor,
} from "react-native-reanimated";
import { TouchableImpact } from "../touchable-impact";
import { XIcon } from "lucide-react-native";
import { Image as ExpoImage } from "react-native-expo-image-cache";

// Interface for props, including the shared scroll value from Reanimated
interface HeaderProps {
  scrollY: SharedValue<number>;
  menuItem: any;
}

export default function ItemHeader({ scrollY, menuItem }: HeaderProps) {
  const imageHeight = Dimensions.get("window").height * 0.33; // Set initial image height
  const router = useRouter();

  // Animated style for image zooming effect
  const animatedImageStyle = useAnimatedStyle(() => {
    const expandedHeight = interpolate(
      scrollY.value,
      [-300, 0, 230],
      [imageHeight * 1.5, imageHeight, 60],
      "clamp",
    );
    const zoomScale = interpolate(scrollY.value, [-300, 0], [1.5, 1], "clamp");
    const opacity = interpolate(scrollY.value, [0, 230], [1, 0], "clamp");

    return {
      height: expandedHeight,
      transform: [{ scale: zoomScale }],
      opacity,
    };
  });

  // Slip text from the top
  const slipText = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [220, 280], [0, 1], "clamp");
    const translateY = interpolate(
      scrollY.value,
      [220, 280],
      [-10, 0],
      "clamp",
    );

    return {
      transform: [{ translateY }],
      opacity,
    };
  });

  const iconColorStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      scrollY.value,
      [220, 300],
      ["#ffffff", "#f1f1f1"],
    );

    const shadowOpacity = interpolate(
      scrollY.value,
      [220, 300],
      [0.2, 0],
      "clamp",
    );

    return {
      backgroundColor: color,
      shadowOpacity: shadowOpacity,
      shadowOffset: { width: 0, height: 2 },
    };
  });

  const animatedButtonStyle = useAnimatedStyle(() => {
    const topValue = interpolate(scrollY.value, [220, 300], [20, 10], "clamp");

    return {
      top: topValue,
    };
  });
  const animatedHandleStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [220, 300], [1, 0], "clamp");
    const translateY = interpolate(
      scrollY.value,
      [220, 300],
      [0, -10],
      "clamp",
    );

    return {
      opacity: opacity,
      transform: [{ translateY }],
    };
  });

  const AnimatedTouchableImpact =
    Animated.createAnimatedComponent(TouchableImpact);

  return (
    <BlurView
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 60,
        zIndex: 50,
      }}
      intensity={100}
    >
      <Animated.View
        style={[
          {
            position: "absolute",
            height: 60,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          },
          slipText,
        ]}
      >
        <Text
          style={{
            color: "#333",
            fontSize: 20,
            fontFamily: "fredoka-semibold",
          }}
        >
          {menuItem?.name}
        </Text>
      </Animated.View>

      <AnimatedTouchableImpact
        onPress={router.back}
        style={[
          {
            position: "absolute",
            right: 10,
            width: 35,
            height: 35,
            top: 20,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 17.5,
            zIndex: 100,
          },
          iconColorStyle,
          animatedButtonStyle,
        ]}
      >
        <XIcon
          style={{
            width: 30,
            height: 30,
            aspectRatio: 1,
          }}
          strokeWidth={2.5}
          color={PlatformColor("label")}
        />
      </AnimatedTouchableImpact>

      <Animated.View
        style={[
          {
            position: "absolute",
            alignSelf: "center",
            width: "20%",
            height: 7,
            top: 5,
            borderRadius: 7,
            zIndex: 100,
          },
          iconColorStyle,
          animatedHandleStyle,
        ]}
      />

      {/* Image section with search bar and back button */}
      <Animated.View
        style={[
          { position: "absolute", width: "100%", overflow: "hidden" },
          animatedImageStyle,
        ]}
      >
        <ExpoImage
          uri={menuItem.imageUrl}
          style={{ width: "100%", height: "100%" }}
          transitionDuration={1000}
        />
      </Animated.View>
    </BlurView>
  );
}
