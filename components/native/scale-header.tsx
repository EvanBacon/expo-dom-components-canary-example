import React from "react";
import { View, Image, Dimensions } from "react-native";
import Animated, {
  useAnimatedStyle,
  interpolate,
  SharedValue,
} from "react-native-reanimated";
import { Ellipse, Path, Svg } from "react-native-svg";
import { Image as ExpoImage } from "react-native-expo-image-cache";

// Interface for props, including the shared scroll value from Reanimated
interface HeaderProps {
  Uri: string;
  scrollY: SharedValue<number>;
}

export default function ScaleImageHeader({ Uri, scrollY }: HeaderProps) {
  const imageHeight = Dimensions.get("window").height * 0.4; // Set initial image height

  // Animated style for image zooming effect
  const animatedImageStyle = useAnimatedStyle(() => {
    const expandedHeight = interpolate(
      scrollY.value,
      [-300, 0, 250],
      [imageHeight * 1.5, imageHeight, 0],
      "clamp",
    );
    const zoomScale = interpolate(scrollY.value, [-300, 0], [1.5, 1], "clamp");
    const opacity = interpolate(scrollY.value, [100, 250], [1, 0], "clamp");

    return {
      height: expandedHeight,
      transform: [{ scale: zoomScale }],
      opacity,
    };
  });

  return (
    <View
      style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: -1 }}
    >
      {/* Image section with search bar and back button */}
      <Animated.View
        style={[{ width: "100%", overflow: "hidden" }, animatedImageStyle]}
      >
        <ExpoImage
          uri={Uri}
          style={{ width: "100%", height: "100%" }}
          transitionDuration={1000}
        />

        {/* Elliptical overlay */}
        <Svg
          height="60" // Adjust height for curve depth
          width="100%"
          style={{
            position: "absolute",
            bottom: 0,
          }}
        >
          <Ellipse
            cx="50%" // Center horizontally
            cy="100%" // Position the center at the bottom
            rx="55%" // Horizontal radius (controls width stretch)
            ry="40" // Vertical radius (controls height stretch)
            fill="white" // Adjust to match background color
          />
        </Svg>
      </Animated.View>
    </View>
  );
}
