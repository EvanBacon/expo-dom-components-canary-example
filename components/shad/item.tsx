import React from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Alert,
  I18nManager,
  Pressable,
} from "react-native";
import { useGlobalButtonHaptics } from "../global-button-haptics";
import ModifierCheckboxGroup from "../native/ui/modifier-checkbox-group";
import { Item, SelectedModifier, ItemOrder } from "@/lib/types";

// Ensure RTL layout
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

interface ItemRouteProps {
  item: Item;
  onButtonClick: (size: number) => Promise<void>;
  onHeightChange?: (event: any) => void;
  orderState: {
    order: ItemOrder;
    setOrder: React.Dispatch<React.SetStateAction<ItemOrder>>;
    validationErrors: string[];
    setValidationErrors: React.Dispatch<React.SetStateAction<string[]>>;
  };
}

const ItemRoute: React.FC<ItemRouteProps> = ({
  item,
  orderState: { order, setOrder, setValidationErrors },
  onButtonClick,
  onHeightChange,
}) => {
  useGlobalButtonHaptics(onButtonClick);

  // Function to calculate the total price of the item with modifiers
  const calculateTotalPrice = (): number => {
    const modifiersPrice = order.modifiers.reduce((modSum, modifier) => {
      const itemModifier = item.modifiers.find(
        (mod) => mod._id === modifier._id,
      );
      if (!itemModifier) return modSum;

      const optionsPrice = modifier.options.reduce((optSum, option) => {
        const itemOption = itemModifier.options.find(
          (opt) => opt._id === option._id,
        );
        const optionPrice = itemOption ? itemOption.price : 0;
        return optSum + optionPrice * option.quantity;
      }, 0);

      return modSum + optionsPrice;
    }, 0);

    return (item.price + modifiersPrice) * order.quantity;
  };

  // Function to handle modifier changes from ModifierCheckboxGroup
  const handleModifierChange = (selectedModifier: SelectedModifier) => {
    setOrder((prevOrder) => {
      const existingModifiers = prevOrder.modifiers || [];
      const modifierIndex = existingModifiers.findIndex(
        (m) => m._id === selectedModifier._id,
      );

      let newModifiers;
      if (modifierIndex !== -1) {
        // Update existing modifier
        newModifiers = [...existingModifiers];
        newModifiers[modifierIndex] = selectedModifier;
      } else {
        // Add new modifier
        newModifiers = [...existingModifiers, selectedModifier];
      }

      return { ...prevOrder, modifiers: newModifiers };
    });

    // Remove validation error if modifier is now filled
    if (selectedModifier.options.length > 0) {
      setValidationErrors((prev) =>
        prev.filter((error) => error !== getModifierName(selectedModifier._id)),
      );
    }
  };

  // Helper function to get modifier name by ID
  const getModifierName = (modifierId: string): string => {
    const modifier = item.modifiers.find((mod: any) => mod._id === modifierId);
    return modifier ? modifier.name : "Unknown Modifier";
  };

  // Function to handle adding the item to the cart
  const handleAddToCart = () => {
    const errors: string[] = [];

    // Validate required modifiers
    item.modifiers.forEach((modifier: any) => {
      if (modifier.required) {
        const hasSelectedModifier = order.modifiers.some(
          (m: any) => m._id === modifier._id && m.options.length > 0,
        );
        if (!hasSelectedModifier) {
          errors.push(modifier.name);
        }
      }
    });

    if (errors.length > 0) {
      setValidationErrors(errors);
      Alert.alert("Error", "Please fill all required fields.");
    } else {
      Alert.alert(
        "Order Added",
        `Quantity: ${
          order.quantity
        }\nTotal Price: ₪${calculateTotalPrice().toFixed(2)}`,
      );
      // Here you can pass 'order' to your cart or backend service
    }
  };

  return (
    <View style={styles.screenContainer}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        scrollEnabled
        onLayout={onHeightChange}
      >
        <View style={styles.container}>
          <View style={styles.article}>
            <View style={styles.header}>
              <View style={styles.textRight}>
                <View style={styles.priceContainer}>
                  <Text style={styles.price}>₪{item.price.toFixed(2)}</Text>
                  <Badge style={styles.badge}>פופולרי</Badge>
                </View>
              </View>
            </View>
            <Text style={styles.description}>{item.description}</Text>
          </View>

          {item.modifiers.map((modifier: any) => (
            <ModifierCheckboxGroup
              key={modifier._id}
              modifier={modifier}
              onModifierChange={handleModifierChange}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const Badge: React.FC<{ style?: any; children: React.ReactNode }> = ({
  style,
  children,
}) => (
  <View style={[styles.badge, style]}>
    <Text style={styles.badgeText}>{children}</Text>
  </View>
);

// Styles
const styles = StyleSheet.create({
  screenContainer: { flex: 1, writingDirection: "rtl", direction: "rtl" },
  scrollViewContent: {
    flex: 1,
    paddingBottom: 120,
    backgroundColor: "white",
    alignItems: "center",
  },
  container: {
    width: "100%",
    paddingVertical: 24,
    paddingHorizontal: 24,
    marginTop: -16,
  },
  article: { marginBottom: 24 },
  header: {
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  textRight: { alignItems: "flex-start" },
  priceContainer: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    marginTop: 4,
    justifyContent: "flex-end",
  },
  price: { fontSize: 24, fontWeight: "bold", color: "#FD8000" },
  badge: {
    backgroundColor: "#FFF0E0",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 8,
  },
  badgeText: { color: "#FD8000", fontSize: 14, fontFamily: "fredoka-semibold" },
  description: { fontSize: 14, color: "#4A4A4A", textAlign: "left" },
  addButton: {
    backgroundColor: "#FD8000",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "fredoka-semibold",
  },
});

export default ItemRoute;
