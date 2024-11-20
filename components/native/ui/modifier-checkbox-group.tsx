import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Check, Minus, Plus } from "lucide-react-native";
import * as Haptics from "expo-haptics";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface IAddition {
  _id: string;
  name: string;
  price: number;
  multiple?: boolean;
  max?: number;
  days?: number[];
}

interface IModifier {
  _id: string;
  name: string;
  required: boolean;
  multiple: boolean;
  max?: number;
  options: IAddition[];
}

interface SelectedOption {
  _id: string;
  quantity: number;
}

interface SelectedModifier {
  _id: string;
  options: SelectedOption[];
}

interface ModifierCheckboxGroupProps {
  modifier: IModifier;
  onModifierChange: (selectedModifier: SelectedModifier) => void;
}

const PRIMARY_COLOR = "#fd8000";

const ModifierCheckboxGroup: React.FC<ModifierCheckboxGroupProps> = ({
  modifier,
  onModifierChange,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<SelectedOption[]>([]);

  const currentDay = new Date().getDay() + 1; // 1 (Sunday) to 7 (Saturday)

  useEffect(() => {
    // Notify parent component of changes
    onModifierChange({
      _id: modifier._id,
      options: selectedOptions,
    });
  }, [selectedOptions]);

  const handleAdditionChange = (additionId: string, change: number) => {
    setSelectedOptions((prevState) => {
      const optionIndex = prevState.findIndex((opt) => opt._id === additionId);
      let newOptions = [...prevState];
      const addition = modifier.options.find((opt) => opt._id === additionId);

      if (!addition) return prevState;

      let newQuantity = change;

      if (optionIndex !== -1) {
        newQuantity = prevState[optionIndex].quantity + change;

        // Enforce addition.multiple
        if (!addition.multiple && newQuantity > 1) {
          newQuantity = 1;
        }

        // Enforce addition.max
        if (addition.max && newQuantity > addition.max) {
          newQuantity = addition.max;
        }

        if (newQuantity <= 0) {
          // Remove the option
          newOptions.splice(optionIndex, 1);
        } else {
          // Update the quantity
          newOptions[optionIndex] = { _id: additionId, quantity: newQuantity };
        }
      } else if (change > 0) {
        // Add new option
        // Enforce addition.multiple
        if (!addition.multiple && change > 1) {
          newQuantity = 1;
        }

        // Enforce addition.max
        if (addition.max && change > addition.max) {
          newQuantity = addition.max;
        }

        newOptions.push({ _id: additionId, quantity: newQuantity });
      }

      // Enforce modifier.max
      const totalQuantity = newOptions.reduce(
        (sum, opt) => sum + opt.quantity,
        0,
      );
      if (modifier.max && totalQuantity > modifier.max) {
        // Adjust the last added option
        const excess = totalQuantity - modifier.max;
        if (optionIndex !== -1) {
          newOptions[optionIndex].quantity -= excess;
          if (newOptions[optionIndex].quantity <= 0) {
            newOptions.splice(optionIndex, 1);
          }
        } else {
          newOptions.pop();
        }
      }

      // If modifier.multiple is false, only one option can be selected
      if (!modifier.multiple && newOptions.length > 1) {
        newOptions = [newOptions[newOptions.length - 1]];
      }

      return newOptions;
    });
  };

  const handleSingleSelection = (additionId: string) => {
    const addition = modifier.options.find((opt) => opt._id === additionId);
    if (!addition) return;

    if (modifier.multiple) {
      setSelectedOptions((prevState) => {
        const optionIndex = prevState.findIndex(
          (opt) => opt._id === additionId,
        );
        let newOptions = [...prevState];

        if (optionIndex !== -1) {
          // Toggle off
          newOptions.splice(optionIndex, 1);
        } else {
          // Toggle on
          newOptions.push({ _id: additionId, quantity: 1 });
        }

        // Enforce modifier.max
        const totalQuantity = newOptions.reduce(
          (sum, opt) => sum + opt.quantity,
          0,
        );
        if (modifier.max && totalQuantity > modifier.max) {
          // Adjust the last added option
          newOptions.pop();
        }

        return newOptions;
      });
    } else {
      handleAdditionChange(additionId, 1);
    }
  };

  return (
    <View style={styles.modifierContainer}>
      <Text style={[styles.modifierName, { fontFamily: "fredoka-semibold" }]}>
        {modifier.name}
      </Text>
      <Text style={[styles.modifierMaxText, { fontFamily: "fredoka" }]}>
        {modifier.multiple
          ? `תבחר עד ${modifier.max} אפשרויות`
          : `תבחר אפשרות אחת ${modifier.required ? "(חובה)" : ""}`}
      </Text>
      {modifier.options.map((addition) => {
        // Check if addition is available today
        if (addition.days && !addition.days.includes(currentDay)) {
          // Option is not available today
          return null;
        }

        const selectedOption = selectedOptions.find(
          (opt) => opt._id === addition._id,
        );
        const quantity = selectedOption ? selectedOption.quantity : 0;
        const isSelected = quantity > 0;

        return (
          <AdditionItem
            key={addition._id}
            addition={addition}
            quantity={quantity}
            isSelected={isSelected}
            onChange={handleAdditionChange}
            onPress={handleSingleSelection}
            modifier={modifier}
            selectedOptions={selectedOptions}
          />
        );
      })}
    </View>
  );
};

interface AdditionItemProps {
  addition: IAddition;
  quantity: number;
  isSelected: boolean;
  onChange: (additionId: string, change: number) => void;
  onPress: (additionId: string) => void;
  modifier: IModifier;
  selectedOptions: SelectedOption[];
}

const AdditionItem: React.FC<AdditionItemProps> = ({
  addition,
  quantity,
  isSelected,
  onChange,
  onPress,
}) => {
  const scale = useSharedValue(1);
  const scaleMinus = useSharedValue(1);
  const scalePlus = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  const animatedStyleMinus = useAnimatedStyle(() => ({
    transform: [{ scale: scaleMinus.value }],
  }));
  const animatedStylePlus = useAnimatedStyle(() => ({
    transform: [{ scale: scalePlus.value }],
  }));

  const handlePressIn = () => {
    scale.value = withTiming(1.2, { duration: 200 });
    scaleMinus.value = withTiming(1, { duration: 200 });

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
  };
  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 200 });
  };

  const handlePressInQuantity = (side: string) => {
    if (side === "minus") {
      scaleMinus.value = withTiming(1.2, { duration: 200 });
    } else {
      scalePlus.value = withTiming(1.2, { duration: 200 });
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
  };

  const handlePressOutQuantity = (side: string) => {
    if (side === "minus") {
      scaleMinus.value = withTiming(1, { duration: 200 });
    } else {
      scalePlus.value = withTiming(1, { duration: 200 });
    }
  };

  if (!addition.multiple) {
    // Single selection addition
    return (
      <AnimatedPressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => onPress(addition._id)}
        style={styles.additionItem}
      >
        <AnimatedPressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={() => onPress(addition._id)}
          style={[
            styles.circle,
            animatedStyle,
            isSelected && styles.circleSelected,
          ]}
        >
          {isSelected && <Check color="#fff" size={18} />}
        </AnimatedPressable>
        <Text style={[styles.additionName, { fontFamily: "fredoka" }]}>
          {addition.name}
        </Text>
        <Text style={[styles.additionPrice, { fontFamily: "fredoka" }]}>
          ₪{addition.price.toFixed(2)}
        </Text>
      </AnimatedPressable>
    );
  } else {
    // Multiple quantities addition
    return (
      <AnimatedPressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => onChange(addition._id, 1)}
        style={styles.additionItem}
      >
        <AnimatedPressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={() => onChange(addition._id, 1)}
          style={[
            styles.circle,
            animatedStyle,
            isSelected && styles.circleSelected,
          ]}
        >
          {isSelected && (
            <Text style={[styles.quantityText, { fontFamily: "fredoka" }]}>
              {quantity}
            </Text>
          )}
        </AnimatedPressable>
        <Text style={[styles.additionName, { fontFamily: "fredoka" }]}>
          {addition.name}
        </Text>
        {isSelected && (
          <View style={styles.quantityControls}>
            <AnimatedPressable
              onPress={() => onChange(addition._id, -1)}
              onPressIn={() => handlePressInQuantity("minus")}
              onPressOut={() => handlePressOutQuantity("minus")}
              style={[
                styles.circle,
                animatedStyleMinus,
                {
                  marginHorizontal: 2,
                },
              ]}
            >
              <Minus size={18} color={"#fd8000"} strokeWidth={2.5} />
            </AnimatedPressable>
            <AnimatedPressable
              onPress={() => onChange(addition._id, 1)}
              onPressIn={() => handlePressInQuantity("plus")}
              onPressOut={() => handlePressOutQuantity("plus")}
              style={[
                styles.circle,
                animatedStylePlus,
                {
                  marginHorizontal: 2,
                },
              ]}
            >
              <Plus size={18} color={"#fd8000"} strokeWidth={2.5} />
            </AnimatedPressable>
          </View>
        )}
        <Text style={[styles.additionPrice, { fontFamily: "fredoka" }]}>
          ₪{addition.price.toFixed(2)}
        </Text>
      </AnimatedPressable>
    );
  }
};

const styles = StyleSheet.create({
  modifierContainer: {
    flex: 1,
    marginBottom: 26,
  },
  modifierName: {
    fontSize: 20,
    textAlign: "left",
    color: "#333",
    marginBottom: 2,
  },
  modifierMaxText: {
    fontSize: 14,
    color: "#777",
    textAlign: "left",
    marginBottom: 12,
  },
  additionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },
  additionName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "400",
    color: "#333",
    textAlign: "left",
  },
  additionPrice: {
    fontSize: 14,
    color: "#777",
    textAlign: "left",
  },
  circle: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    borderWidth: 2,
    borderColor: PRIMARY_COLOR,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 6,
  },
  circleSelected: {
    backgroundColor: PRIMARY_COLOR,
    borderColor: PRIMARY_COLOR,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },
  quantityText: {
    fontSize: 16,
    color: "#fff",
  },
});

export default ModifierCheckboxGroup;
