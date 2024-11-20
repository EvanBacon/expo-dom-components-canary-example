import { useMenuStore } from "@/lib/hooks/useMenu";
import React, { useState, useEffect } from "react";
import { TouchableOpacity, StyleSheet, I18nManager } from "react-native";
import { LayoutChangeEvent } from "react-native";
import Animated, {
  SharedValue,
  interpolate,
  interpolateColor,
  withTiming,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

interface CategoryData {
  position: number;
  width: number;
}

interface Category {
  _id: string;
  name: string;
  description: string;
  index: number;
}

export default function CategoriesHorizontalDropdown({
  menuY,
  scrollY,
  categories,
  sCategory,
  onCategoryChange,
}: {
  menuY: number;
  scrollY: SharedValue<number>;
  categories: Category[];
  sCategory: string;
  onCategoryChange: (category: any) => void;
}) {
  const [categoryLayouts, setCategoryLayouts] = useState<{
    [key: string]: CategoryData;
  }>({});
  const selectedCategoryData = useSharedValue<CategoryData>({
    position: 0,
    width: 0,
  });

  const categoriesTextColor = useAnimatedStyle(() => {
    const color = interpolateColor(
      scrollY.value,
      [menuY - 300, menuY - 50],
      ["#33333300", "#333333FF"],
    );

    const translateY = interpolate(
      scrollY.value,
      [menuY - 300, menuY - 50],
      [-10, 0],
      "clamp",
    );

    return {
      color,
      transform: [{ translateY }],
    };
  });

  // Callback to capture position and width when layout changes
  const handleLayout = (categoryId: string) => (event: LayoutChangeEvent) => {
    const { x, width } = event.nativeEvent.layout;
    setCategoryLayouts((prev) => ({
      ...prev,
      [categoryId]: { position: x, width },
    }));
  };

  const handleCategoryPress = (categoryId: string) => {
    if (categoryLayouts[categoryId]) {
      selectedCategoryData.value = {
        position: categoryLayouts[categoryId].position,
        width: categoryLayouts[categoryId].width,
      };
      onCategoryChange(categoryId);
    }
  };

  useEffect(() => {
    if (categoryLayouts[sCategory]) {
      selectedCategoryData.value = {
        position: categoryLayouts[sCategory].position,
        width: categoryLayouts[sCategory].width,
      };
    }
  }, [sCategory, categoryLayouts]);

  const animatedUnderlineStyle = useAnimatedStyle(() => {
    const position = selectedCategoryData.value.position;
    return {
      width: withTiming(selectedCategoryData.value.width, { duration: 300 }),
      [I18nManager.isRTL ? "right" : "left"]: withTiming(position, {
        duration: 300,
      }),
    };
  });

  return (
    <Animated.ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <Animated.View style={[styles.underline, animatedUnderlineStyle]} />
      {categories?.map((category) => (
        <TouchableOpacity
          key={category._id}
          style={{
            paddingHorizontal: 10,
            alignItems: "center",
            justifyContent: "center",
          }}
          onLayout={handleLayout(category._id)}
          onPress={() => handleCategoryPress(category._id)}
        >
          <Animated.Text style={[styles.menuItem, categoriesTextColor]}>
            {category.name}
          </Animated.Text>
        </TouchableOpacity>
      ))}
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  menuItem: {
    fontSize: 16,
    alignSelf: "center",
  },
  underline: {
    position: "absolute",
    zIndex: 20,
    bottom: 0,
    height: 3,
    borderRadius: 3,
    backgroundColor: "#FD8000",
  },
});
