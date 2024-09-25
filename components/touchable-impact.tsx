import React from "react";
import TouchableBase from "./touchable-bounce";
import * as Haptics from "expo-haptics";

export const TouchableImpact = React.forwardRef<
  typeof TouchableBase,
  React.ComponentProps<typeof TouchableBase> & {
    impact?: boolean | Haptics.ImpactFeedbackStyle;
  }
>(({ onPressIn, impact = true, ...props }, ref) => {
  return (
    <TouchableBase
      ref={ref}
      activeOpacity={0.8}
      onPressIn={(...props) => {
        if (impact && process.env.EXPO_OS !== "web") {
          Haptics.impactAsync(
            impact === true ? Haptics.ImpactFeedbackStyle.Light : impact
          );
        }
        onPressIn?.(...props);
      }}
      {...props}
    />
  );
});
