import Item from "@/components/shad/item";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { useScrollRef } from "@/lib/tab-to-top";
import * as Haptics from "expo-haptics";
import { Dimensions, I18nManager, ScrollView } from "react-native";
import React, { useState } from "react";
import Animated, { interpolate, useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { View } from "lucide-react-native";
import { useNavigation } from "expo-router";
import ItemHeader from "@/components/native/item-header";
import useMenu from "@/lib/hooks/useMenu";

export default function ItemRoute() {
  const ref = useScrollRef();
  const { id, item } = useLocalSearchParams();
  const [height, setHeight] = useState(0);
  const scrollY = useSharedValue(0);
  const navigation = useNavigation();
  const { menu } = useMenu(id as string);
  const menuItem = menu?.find((m: any) => m._id === item);

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

  return (
    <>
      <Stack.Screen
        options={{
          header: () => <ItemHeader scrollY={scrollY} />,
          headerShown: true,
        }}
      />
      <Animated.ScrollView
        contentInsetAdjustmentBehavior="automatic"
        automaticallyAdjustsScrollIndicatorInsets={true}
        contentContainerStyle={{
          flexGrow: 1,
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
          navigate={router.navigate}
          ref={ref}
          onHeightChange={setHeight}
          dom={{
            contentInsetAdjustmentBehavior: "automatic",
            automaticallyAdjustsScrollIndicatorInsets: true,
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
    </>
  );
}

