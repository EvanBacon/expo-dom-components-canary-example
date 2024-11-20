// CartScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  Animated,
  Easing,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import AnimatedReanimated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  useAnimatedGestureHandler,
  runOnJS,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { PanGestureHandler, Pressable } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { useCartStore } from '@/lib/store/orderStore';
import { router, useLocalSearchParams } from 'expo-router';
import { useMenuStore } from '@/lib/hooks/useMenu';
import { useCompanyStore } from '@/lib/store/companyStore';
import SwipeToOrderButton from '@/components/native/order-button';
import LottieView from 'lottie-react-native';
import CheckoutOpenButton from '@/components/native/checkout-button';
import tw from 'twrnc';

const CartScreen = () => {
  const { restaurant: restaurantId } = useLocalSearchParams();

  // Access the cart store
  const cartItems = useCartStore((state) => state.carts[restaurantId as string] || []);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateItem = useCartStore((state) => state.updateItem);
  const updateMessageToKitchen = useCartStore((state) => state.updateMessageToKitchen);
  const { menu } = useMenuStore();
  const menuItems = menu[restaurantId as string] || [];

  const [message, setMessage] = useState('');
  const [isMessageModalVisible, setIsMessageModalVisible] = useState(false);
  const [messageModalFadeAnim] = useState(new Animated.Value(0));

  const openMessageModal = () => {
    setIsMessageModalVisible(true);
    Animated.timing(messageModalFadeAnim, {
      toValue: 1,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const closeMessageModal = () => {
    Animated.timing(messageModalFadeAnim, {
      toValue: 0,
      duration: 300,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      setIsMessageModalVisible(false);
      Keyboard.dismiss();
    });
  };

  const handleChangeMessage = (text: string) => {
    setMessage(text);
    updateMessageToKitchen(restaurantId as string, text);
  };

  const handleDeleteItem = (itemId: string) => {
    removeItem(restaurantId as string, itemId);
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    // Find the item in the cart
    const item = cartItems.find((item: any) => item._id === itemId);
    if (item) {
      const updatedItem = { ...item, quantity: newQuantity };
      updateItem(restaurantId as string, updatedItem);
    }
  };

  if (cartItems.length < 1) {
    return (
      <SafeAreaView style={styles.container}>
        <Text
          style={{
            fontSize: 32,
            fontFamily: 'fredoka-semibold',
            textAlign: 'center',
            paddingTop: 30,
            marginBottom: -12,
          }}
        >
          העגלה שלך ריקה
        </Text>
        <LottieView
          source={require('@/assets/lottie/empty-cart.json')}
          autoPlay
          loop
          style={{ width: '100%', height: '70%' }}
        />
        <Pressable style={styles.emptyCartButton} onPress={() => router.back()}>
          <Text style={styles.emptyCartButtonText}>הוסף פריטים</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, marginTop: 16 }}>
        {/* Add Message Section */}
        <TouchableOpacity style={styles.messageSection} onPress={openMessageModal}>
          <Feather name="message-square" size={32} color="#fd8000" style={styles.icon} />
          <View style={styles.messageTextContainer}>
            <Text style={styles.messageTitle}>הוסף הודעה למסעדה</Text>
            <Text style={styles.messageSubtitle}>
              בקשות מיוחדות, אלרגיות, הגבלות תזונתיות, טקסט לברכה?
            </Text>
          </View>
          <Feather name="chevron-left" size={24} color="#6B7280" style={styles.chevronIcon} />
        </TouchableOpacity>

        {/* Message Modal */}
        <Modal
          visible={isMessageModalVisible}
          transparent={true}
          animationType="none"
          onRequestClose={closeMessageModal}
        >
          <TouchableWithoutFeedback onPress={closeMessageModal}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback onPress={() => {}}>
                <Animated.View
                  style={[
                    styles.modalContainer,
                    {
                      opacity: messageModalFadeAnim,
                      transform: [
                        {
                          translateY: messageModalFadeAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [200, 0],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
                  >
                    <View style={styles.modalContent}>
                      <Text style={tw`text-xl font-bold mb-4 text-center font-fredoka`}>
                        הוסף הודעה למסעדה
                      </Text>
                      <TextInput
                        style={styles.input}
                        placeholder="הזן את הודעתך"
                        value={message}
                        onChangeText={handleChangeMessage}
                        multiline
                      />
                      <TouchableOpacity style={styles.submitButton} onPress={closeMessageModal}>
                        <Text style={tw`text-white font-fredoka`}>אישור</Text>
                      </TouchableOpacity>
                    </View>
                  </KeyboardAvoidingView>
                </Animated.View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Order Items Section */}
        <View style={styles.orderSection}>
          <View style={styles.orderHeader}>
            <Text style={styles.orderTitle}>פריטי הזמנה</Text>
          </View>
          {cartItems.map((item: any) => {
            const itemData = menuItems.find((menuItem: any) => menuItem._id === item._id) || {};
            return (
              <SwipeableCartItem
                key={item._id}
                item={item}
                itemData={itemData}
                handleDelete={handleDeleteItem}
                updateQuantity={updateQuantity}
              />
            );
          })}
        </View>
      </ScrollView>
      <View style={{ position: 'absolute', bottom: 38, left: 0, right: 0 }}>
        <CheckoutOpenButton />
      </View>
    </SafeAreaView>
  );
};

interface SwipeableCartItemProps {
  item: any;
  itemData: any;
  handleDelete: (itemId: string) => void;
  updateQuantity: (itemId: string, newQuantity: number) => void;
}

const SwipeableCartItem = ({
  item,
  itemData,
  handleDelete,
  updateQuantity,
}: SwipeableCartItemProps) => {
  const translateX = useSharedValue(0);
  const SWIPE_THRESHOLD = -100; // Threshold for swipe delete
  const SCREEN_WIDTH = Dimensions.get('window').width;

  const [aboveThreshold, setAboveThreshold] = useState(false);
  const [isQuantityModalVisible, setIsQuantityModalVisible] = useState(false);
  const [quantityModalFadeAnim] = useState(new Animated.Value(0));

  const { selectedCompanyData, fetchSelectedCompanyData } = useCompanyStore();

  useEffect(() => {
    fetchSelectedCompanyData();
  }, []);

  useEffect(() => {
    if (aboveThreshold) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [aboveThreshold]);

  const panGesture = useAnimatedGestureHandler({
    onActive: (event) => {
      translateX.value = Math.max(-SCREEN_WIDTH, Math.min(0, event.translationX));
      if (event.translationX < SWIPE_THRESHOLD) {
        runOnJS(setAboveThreshold)(true);
      } else {
        runOnJS(setAboveThreshold)(false);
      }
    },
    onEnd: () => {
      if (translateX.value < SWIPE_THRESHOLD) {
        translateX.value = withTiming(-SCREEN_WIDTH);
        // Trigger delete if swiped far enough
        runOnJS(handleDelete)(item._id);
      } else {
        // Reset position if not swiped far enough
        translateX.value = withTiming(0);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const backgroundStyle = useAnimatedStyle(() => {
    const opacity = interpolate(translateX.value, [-200, 0], [1, 0], Extrapolate.CLAMP);
    return { opacity };
  });

  const iconStyle = useAnimatedStyle(() => {
    const scale = interpolate(translateX.value, [-100, 0], [1, 0], Extrapolate.CLAMP);
    const moveLeft = interpolate(translateX.value, [-100, 0], [0, 100], Extrapolate.CLAMP);
    return { transform: [{ scale }, { translateX: moveLeft }] };
  });

  const handleQuantityChange = (newQuantity: number) => {
    updateQuantity(item._id, newQuantity);
  };

  const openQuantityModal = () => {
    setIsQuantityModalVisible(true);
    Animated.timing(quantityModalFadeAnim, {
      toValue: 1,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const closeQuantityModal = () => {
    Animated.timing(quantityModalFadeAnim, {
      toValue: 0,
      duration: 300,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      setIsQuantityModalVisible(false);
      Keyboard.dismiss();
    });
  };

  const [modifiersString, setModifiersString] = useState('');
  useEffect(() => {
    // Initialize an array to hold strings for each modifier
    const modifierStrings: any[] = [];

    // Ensure that item.modifiers and itemData.modifiers exist
    if (item.modifiers && itemData.modifiers) {
      // Loop through each modifier in the cart item
      item.modifiers.forEach((cartModifier: any) => {
        // Find the corresponding modifier in itemData
        const itemDataModifier = itemData.modifiers.find(
          (mod: any) => mod._id === cartModifier._id
        );

        if (itemDataModifier) {
          // Get the modifier name from itemData
          const modifierName = itemDataModifier.name;

          // Initialize an array to hold option strings
          const optionStrings: any[] = [];

          // Loop through each option in the cart modifier
          cartModifier.options.forEach((cartOption: any) => {
            // Find the corresponding option in itemDataModifier
            const itemDataOption = itemDataModifier.options.find(
              (opt: any) => opt._id === cartOption._id
            );

            if (itemDataOption) {
              // Get the option name from itemData
              const optionName = itemDataOption.name;
              // Get the quantity from the cart option
              const optionQuantity = cartOption.quantity;

              // Create the option string
              const optionString =
                optionQuantity > 1 ? `${optionQuantity} × ${optionName}` : optionName;

              // Add the option string to the array
              optionStrings.push(optionString);
            }
          });

          // Join the option strings with commas
          const optionsString = optionStrings.join(', ');

          // Combine the modifier name and options
          const modifierString = `${modifierName}: ${optionsString}`;

          // Add the modifier string to the array
          modifierStrings.push(modifierString);
        }
      });

      // Join all modifier strings with newlines
      const finalModifiersString = modifierStrings.join('\n');

      // Update the state
      setModifiersString(finalModifiersString);
    }
  }, [item]);

  // Function to calculate total price including modifiers
  const calculateItemTotalPrice = (item: any, itemData: any) => {
    let totalPrice = itemData.price || 0;

    if (item.modifiers && itemData.modifiers) {
      item.modifiers.forEach((cartModifier: any) => {
        const itemDataModifier = itemData.modifiers.find(
          (mod: any) => mod._id === cartModifier._id
        );

        if (itemDataModifier) {
          cartModifier.options.forEach((cartOption: any) => {
            const itemDataOption = itemDataModifier.options.find(
              (opt: any) => opt._id === cartOption._id
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

  // Compute the total item price including modifiers
  const totalItemPrice = calculateItemTotalPrice(item, itemData);

  // Apply company contribution percentage
  const contributionPercentage =
    100 - (selectedCompanyData?.companyContributionPercentage || 0);
  const finalPrice = totalItemPrice * (contributionPercentage / 100);

  return (
    <View style={{ position: 'relative', marginBottom: 16 }}>
      {/* Red Background with Delete Icon */}
      <AnimatedReanimated.View style={[styles.deleteBackground, backgroundStyle]}>
        <AnimatedReanimated.View style={[styles.iconContainer, iconStyle]}>
          <Feather name="trash-2" size={24} color="#fff" />
        </AnimatedReanimated.View>
      </AnimatedReanimated.View>

      {/* Quantity Modal */}
      <Modal
        visible={isQuantityModalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={closeQuantityModal}
      >
        <TouchableWithoutFeedback onPress={closeQuantityModal}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <Animated.View
                style={[
                  styles.modalContainer,
                  {
                    opacity: quantityModalFadeAnim,
                    transform: [
                      {
                        translateY: quantityModalFadeAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [200, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <KeyboardAvoidingView
                  behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                  keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
                >
                  <View style={styles.modalContent}>
                    <Text style={tw`text-xl font-bold mb-4 text-center font-fredoka`}>
                      שנה כמות
                    </Text>
                    {/* Quantity adjustment controls */}
                    <View style={styles.quantityControls}>
                      <TouchableOpacity
                        onPress={() => handleQuantityChange(Math.max(1, item.quantity - 1))}
                      >
                        <Text style={styles.controlButton}>−</Text>
                      </TouchableOpacity>
                      <Text style={styles.quantityDisplay}>{item.quantity}</Text>
                      <TouchableOpacity onPress={() => handleQuantityChange(item.quantity + 1)}>
                        <Text style={styles.controlButton}>+</Text>
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.submitButton} onPress={closeQuantityModal}>
                      <Text style={tw`text-white font-fredoka`}>אישור</Text>
                    </TouchableOpacity>
                  </View>
                </KeyboardAvoidingView>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Swipeable Item */}
      <PanGestureHandler
        onGestureEvent={panGesture}
        activeOffsetX={[-15, 15]}
        failOffsetY={[-15, 15]}
      >
        <AnimatedReanimated.View style={[styles.orderItem, animatedStyle]}>
          {/* Wrap quantity box in TouchableOpacity */}
          <TouchableOpacity onPress={openQuantityModal}>
            <View style={styles.quantityBox}>
              <Text style={styles.quantityText}>{item.quantity}</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.orderItemDetails}>
            <Text style={styles.itemTitle}>{item.name}</Text>
            {!!modifiersString && <Text style={styles.itemSubtitle}>{modifiersString}</Text>}
            <Text style={styles.itemPrice}>₪{finalPrice.toFixed(2)}</Text>
          </View>
          {/* Replace with your own image source or leave it as is */}
          <Image source={{ uri: itemData.imageUrl }} style={styles.productImage} />
        </AnimatedReanimated.View>
      </PanGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  messageSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    marginBottom: 32,
  },
  icon: {
    marginRight: 16,
  },
  messageTextContainer: {
    flex: 1,
  },
  messageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'left',
  },
  messageSubtitle: {
    color: '#6B7280',
    fontSize: 16,
    textAlign: 'left',
  },
  chevronIcon: {
    marginRight: 16,
  },
  orderSection: {
    marginTop: 16,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 8,
    marginBottom: 16,
  },
  orderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
  },
  deleteBackground: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: '#FF0000',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 20,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityBox: {
    width: 48,
    height: 48,
    backgroundColor: '#FFF0E0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  orderItemDetails: {
    flex: 1,
    marginLeft: 16,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  itemSubtitle: {
    color: '#6B7280',
    marginVertical: 2,
    textAlign: 'left',
  },
  itemPrice: {
    color: '#fd8000',
    fontSize: 18,
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'left',
  },
  productImage: {
    width: 100,
    height: 80,
    borderRadius: 8,
    marginLeft: 16,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 16,
    paddingBottom: 32,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  modalContent: {},
  input: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    marginBottom: 16,
    textAlign: 'right',
    fontFamily: 'fredoka',
  },
  submitButton: {
    backgroundColor: '#fd8000',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  controlButton: {
    fontSize: 32,
    paddingHorizontal: 16,
    color: '#fd8000',
  },
  quantityDisplay: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  emptyCartButton: {
    position: 'absolute',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fd8000',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    gap: 8,
    left: 16,
    right: 16,
    bottom: 64,
    width: '90%',
    height: 60,
  },
  emptyCartButtonText: {
    flex: 1,
    flexDirection: 'row',
    color: '#fff',
    fontSize: 20,
    fontFamily: 'fredoka-semibold',
    textAlign: 'center',
  },
});

export default CartScreen;
