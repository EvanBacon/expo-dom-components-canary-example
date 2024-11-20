import React, { useState } from "react";
import { StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import { MoreHorizontal, Search, View } from "lucide-react-native";
import Animated, {
  useAnimatedStyle,
  interpolate,
  SharedValue,
  interpolateColor,
  useAnimatedProps,
} from "react-native-reanimated";
import { ArrowRight } from "lucide-react-native";
import CategoriesHorizationalDropdown from "./categories-drop";
import { router } from "expo-router";

const RestaurantHeader = ({
  scrollY,
  restaurant,
  menuY,
  categories,
  category,
  onCategoryChange,
}: {
  scrollY: SharedValue<number>;
  restaurant: any;
  menuY: number;
  categories: any[];
  category: any;
  onCategoryChange: (category: any) => void;
}) => {
  // Animated styles for header background opacity
  const headerStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      scrollY.value,
      [150, 200],
      ["#ffffff00", "#ffffff"],
    );

    return {
      backgroundColor: backgroundColor,
    };
  });

  const shadowWrapperStyle = useAnimatedStyle(() => {
    const shadowOpacity = interpolate(
      scrollY.value,
      [150, 200],
      [0, 0.5],
      "clamp",
    );

    return {
      shadowOpacity: shadowOpacity,
    };
  });

  // Animated styles for search bar text alignment
  const searchBarStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      scrollY.value,
      [0, 125, 250],
      ["#fff", "#bbb", "#f1f1f1"],
    );

    return {
      backgroundColor: backgroundColor,
    };
  });

  const circleButtonStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      scrollY.value,
      [0, 125, 250],
      ["#fff", "#bbb", "#f1f1f1"],
    );

    return {
      backgroundColor: backgroundColor,
    };
  });

  const smallTextStyles = useAnimatedProps(() => {
    const textOpacity = interpolate(scrollY.value, [100, 200], [1, 0], "clamp");
    const textTranslate = interpolate(
      scrollY.value,
      [100, 200],
      [0, 10],
      "clamp",
    );
    return {
      opacity: textOpacity,
      transform: [{ translateY: textTranslate }],
    };
  });

  const largeTextStyles = useAnimatedProps(() => {
    const textOpacity = interpolate(scrollY.value, [200, 300], [0, 1], "clamp");
    const textTranslate = interpolate(
      scrollY.value,
      [200, 300],
      [10, 0],
      "clamp",
    );
    return {
      opacity: textOpacity,
      transform: [{ translateY: textTranslate }],
    };
  });

  const searchBarContentStyle = useAnimatedStyle(() => {
    const left = interpolate(scrollY.value, [0, 200], [40, 10], "clamp");
    return {
      left: `${left}%`,
    };
  });

  const menuDropDownStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [menuY - 350, menuY - 100],
      [0, 70],
      "clamp",
    );
    const opacity = interpolate(scrollY.value, [200, 250], [0, 1], "clamp");

    return {
      transform: [{ translateY }],
      opacity,
    };
  });

  // Animated TouchableOpacity
  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

  return (
    <>
      <Animated.View
        style={[styles.shadowWrapper, shadowWrapperStyle, headerStyle]}
      />
      <Animated.View style={[styles.header, headerStyle]}>
        <SafeAreaView style={styles.headerContent}>
          {/* Back Button */}
          <AnimatedTouchable
            style={[styles.circleButton, circleButtonStyle]}
            onPress={router.back}
          >
            <ArrowRight color="#333" size={24} />
          </AnimatedTouchable>

          {/* Categories Dropdown */}

          {/* Search Bar */}
          <Animated.View style={[styles.searchBar, searchBarStyle]}>
            <Animated.View
              style={[styles.searchBarContent, searchBarContentStyle]}
            >
              <Animated.Text
                style={[
                  styles.searchInput,
                  smallTextStyles,
                  { position: "absolute", paddingLeft: 28 },
                ]}
              >
                חיפוש
              </Animated.Text>
              <Animated.Text
                style={[
                  styles.searchInput,
                  largeTextStyles,
                  { position: "absolute", paddingLeft: 28 },
                ]}
              >
                {restaurant?.name}
              </Animated.Text>
              <Search color="#999" size={20} style={[styles.searchIcon]} />
            </Animated.View>
          </Animated.View>

          {/* More Button */}
          <Animated.View style={[styles.circleButton, circleButtonStyle]}>
            <MoreHorizontal color="#333" size={24} />
          </Animated.View>

          {/* Menu Button */}
        </SafeAreaView>
      </Animated.View>
      <Animated.View style={[styles.menuContainer, menuDropDownStyle]}>
        <CategoriesHorizationalDropdown
          menuY={menuY}
          scrollY={scrollY}
          categories={categories}
          sCategory={category}
          onCategoryChange={onCategoryChange}
        />
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 110,
    zIndex: 50,
  },
  shadowWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 110,
    zIndex: 10,
    backgroundColor: "#fff",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingVertical: 10,
    justifyContent: "space-between",
    paddingHorizontal: 15,
    height: "100%",
    zIndex: 50,
    gap: 10,
  },
  circleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  searchBar: {
    flex: 1,
    flexDirection: "row-reverse", // RTL layout
    alignItems: "center",
    paddingHorizontal: 15,
    backgroundColor: "#f1f1f1",
    borderRadius: 50,
    height: 40,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    flexDirection: "row",
    fontSize: 16,
    direction: "rtl",
    textAlign: "left",
    color: "#888",
    width: "100%",
    alignItems: "center",
  },
  searchIcon: {},
  searchBarContent: {
    position: "absolute",
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  menuContainer: {
    position: "absolute",
    top: 40, // Adjust to align with your header
    left: 0,
    right: 0,
    height: 50, // Adjust the height as needed
    backgroundColor: "#fff", // Background color for the menu
    shadowOpacity: 0.5,
    zIndex: 20,
    justifyContent: "center",
  },
  menuItem: {
    paddingHorizontal: 15,
    fontSize: 16,
    alignSelf: "center",
  },
  underline: {
    position: "absolute",
    zIndex: 20,
    bottom: 0,
    left: 0,
    height: 2,
    backgroundColor: "#FD8000",
  },
});

export default RestaurantHeader;
