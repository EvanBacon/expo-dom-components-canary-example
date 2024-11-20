// CheckoutDetails.js

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
  Easing,
  ScrollView,
  SafeAreaView,
} from "react-native";
import tw from "twrnc";
import Icon from "react-native-vector-icons/Feather";
import { useCartStore } from "@/lib/store/orderStore";
import { useCompanyStore } from "@/lib/store/companyStore";
import { router, useLocalSearchParams } from "expo-router";
import useMenu, { useMenuStore } from "@/lib/hooks/useMenu";

export default function CheckoutDetails({
  restaurantId,
}: {
  restaurantId: string;
}) {
  const cartItems = useCartStore(
    (state) => state.carts[restaurantId as string] || [],
  );
  const { menu } = useMenuStore();
  const menuItems = menu[restaurantId as string] || [];
  const { selectedCompanyData, fetchSelectedCompanyData } = useCompanyStore();
  const { updateTip } = useCartStore();

  const [selectedTip, setSelectedTip] = useState<number>(0);
  const [customTipModalVisible, setCustomTipModalVisible] = useState(false);
  const [customTip, setCustomTip] = useState<string>("");
  const [fadeAnim] = useState(new Animated.Value(0));

  const handleTipChange = (tip: number) => {
    setSelectedTip(tip);
    updateTip(restaurantId, tip);
  };

  const tipOptions = [0, 5, 10, 15];

  useEffect(() => {
    fetchSelectedCompanyData();
  }, []);

  const openModal = () => {
    setCustomTipModalVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      setCustomTipModalVisible(false);
      setCustomTip("");
    });
  };

  const handleCustomTipSubmit = () => {
    const tipValue = parseFloat(customTip);
    if (!isNaN(tipValue)) {
      setSelectedTip(tipValue);
      handleTipChange(tipValue);
    }
    closeModal();
  };

  // Function to calculate total price including modifiers
  const calculateItemTotalPrice = (item: any, itemData: any) => {
    let totalPrice = itemData.price || 0;

    if (item.modifiers && itemData.modifiers) {
      item.modifiers.forEach((cartModifier: any) => {
        const itemDataModifier = itemData.modifiers.find(
          (mod: any) => mod._id === cartModifier._id,
        );

        if (itemDataModifier) {
          cartModifier.options.forEach((cartOption: any) => {
            const itemDataOption = itemDataModifier.options.find(
              (opt: any) => opt._id === cartOption._id,
            );

            if (itemDataOption) {
              const optionPrice = itemDataOption.price || 0;
              const optionQuantity = cartOption.quantity || 1;

              totalPrice += optionPrice * optionQuantity;
            }
          });
        }
      });
    }

    // Multiply by the item quantity
    totalPrice *= item.quantity;

    return totalPrice;
  };

  // Calculate subtotal
  const itemSubtotal = cartItems.reduce(
    (total: number, item: any) =>
      total +
      calculateItemTotalPrice(
        item,
        menuItems.find((m: any) => m._id === item._id),
      ),
    0,
  );

  const serviceFee = 2;
  const deliveryFee = 12;
  const deliveryDiscount = selectedCompanyData?.deliveryDiscount || 12; // Assuming company provides delivery discount
  const appliedOffers = deliveryDiscount; // Assuming only delivery discount is applied
  const totalBeforeTip = itemSubtotal + deliveryFee - appliedOffers;

  // Apply company contribution percentage
  const contributionPercentage =
    100 - selectedCompanyData?.companyContributionPercentage || 0;
  const finalTotal =
    totalBeforeTip * (contributionPercentage / 100) + selectedTip + serviceFee;

  return (
    <>
      <View style={tw`flex-1 items-center w-full`}>
        <View style={tw`w-full`}>
          <View style={tw`bg-white`}>
            <View style={tw`p-4`}>
              <Text style={tw`text-2xl font-bold mb-2 text-left`}>
                הוסף טיפ לשליח
              </Text>
              <Text style={tw`text-gray-500 text-left`}>
                השליח יראה את הטיפ שלך בתוך שעה. וולט לא מנכים דבר מהטיפ פרט
                למע"מ כנדרש בחוק.
              </Text>
            </View>

            <View style={tw`p-4`}>
              <View style={tw`flex-row gap-2`}>
                {tipOptions.map((tip) => (
                  <TouchableOpacity
                    key={tip}
                    style={tw.style(
                      "flex-1 py-2 rounded-lg items-center justify-center",
                      selectedTip === tip
                        ? "bg-[#fd8000]"
                        : "border border-gray-300",
                    )}
                    onPress={() => handleTipChange(tip)}
                  >
                    <Text
                      style={tw`${
                        selectedTip === tip ? "text-white" : "text-black"
                      }`}
                    >
                      ₪{tip}
                    </Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={tw`py-2 px-3 border border-gray-300 rounded-lg items-center justify-center`}
                  onPress={openModal}
                >
                  <Icon name="edit-2" size={20} color="black" />
                </TouchableOpacity>
              </View>

              <View style={tw`mt-6`}>
                <Text style={tw`text-xl font-semibold mb-2 text-left`}>
                  מחירים בש"ח
                </Text>
                <Text style={tw`text-sm text-gray-500 mb-4 text-left`}>
                  כולל מיסים (אם רלוונטי)
                </Text>

                <View style={tw`space-y-4`}>
                  <View style={tw`flex-row justify-between mb-1`}>
                    <Text style={{ fontFamily: "fredoka" }}>סכום פריטים</Text>
                    <View style={tw`flex-row items-center`}>
                      <Text style={tw`text-black`}>
                        ₪
                        {(
                          (itemSubtotal *
                            (100 -
                              selectedCompanyData.companyContributionPercentage)) /
                          100
                        ).toFixed(2)}
                      </Text>
                      <Text style={tw`line-through text-gray-500 ml-2`}>
                        ₪{itemSubtotal.toFixed(2)}
                      </Text>
                    </View>
                  </View>
                  {selectedTip > 0 && (
                    <View style={tw`flex-row justify-between mb-1`}>
                      <Text style={tw`text-right`}>טיפ</Text>
                      <Text>₪{selectedTip.toFixed(2)}</Text>
                    </View>
                  )}
                  <View style={[tw`flex-row justify-between mb-1`]}>
                    <Text style={tw`text-right`}>דמי שירות</Text>
                    <Text>₪{serviceFee.toFixed(2)}</Text>
                  </View>
                  <View style={tw`flex-row justify-between items-center mb-1`}>
                    <Text style={tw`text-right`}>משלוח</Text>
                    <View style={tw`flex-row-reverse items-center`}>
                      {deliveryDiscount > 0 ? (
                        <>
                          <Text style={tw`line-through text-gray-500 ml-2`}>
                            ₪{deliveryFee.toFixed(2)}
                          </Text>
                          <Text style={tw`text-green-500`}>₪0.00</Text>
                        </>
                      ) : (
                        <Text>₪{deliveryFee.toFixed(2)}</Text>
                      )}
                    </View>
                  </View>
                  <View style={tw`flex-row justify-between pt-4`}>
                    <Text style={tw`font-semibold text-right`}>סה"כ</Text>
                    <Text style={tw`font-semibold`}>
                      ₪{finalTotal.toFixed(2)}
                    </Text>
                  </View>
                  {appliedOffers > 0 && (
                    <View style={tw`flex-row justify-between`}>
                      <Text style={tw`text-gray-500 text-right`}>
                        הנחות שהופעלו
                      </Text>
                      <Text style={tw`text-gray-500`}>
                        -₪{appliedOffers.toFixed(2)}
                      </Text>
                    </View>
                  )}
                </View>

                {deliveryDiscount > 0 && (
                  <View
                    style={tw`flex-row-reverse justify-between items-center mt-6`}
                  >
                    <Text style={tw`text-right`}>משלוח חינם</Text>
                    <TouchableOpacity
                      style={tw`border border-gray-300 rounded-lg px-4 py-2`}
                      onPress={() => {
                        router.back();
                      }}
                    >
                      <Text style={tw`text-primary`}>שינוי</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>
      </View>
      <Modal
        visible={customTipModalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <Animated.View
                style={[
                  styles.modalContainer,
                  {
                    opacity: fadeAnim,
                    transform: [
                      {
                        translateY: fadeAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [200, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <KeyboardAvoidingView
                  behavior={Platform.OS === "ios" ? "padding" : undefined}
                  keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
                >
                  <View style={styles.modalContent}>
                    <Text
                      style={tw`text-xl font-bold mb-4 text-center font-fredoka`}
                    >
                      הזן טיפ מותאם אישית
                    </Text>
                    <TextInput
                      style={styles.input}
                      placeholder="הזן סכום טיפ"
                      keyboardType="numeric"
                      value={customTip}
                      onChangeText={setCustomTip}
                    />
                    <TouchableOpacity
                      style={styles.submitButton}
                      onPress={handleCustomTipSubmit}
                    >
                      <Text style={tw`text-white font-fredoka`}>עדכן טיפ</Text>
                    </TouchableOpacity>
                  </View>
                </KeyboardAvoidingView>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

// Styles for the modal
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 16,
    paddingBottom: 32,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  modalContent: {},
  input: {
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    marginBottom: 16,
    textAlign: "right",
    fontFamily: "fredoka",
  },
  submitButton: {
    backgroundColor: "#fd8000",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
});
