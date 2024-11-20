import React, { useState } from "react";
import { View, Modal, StyleSheet, Dimensions, I18nManager } from "react-native";
import { SwipeButton } from "react-native-expo-swipe-button";
import { MaterialIcons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import { router } from "expo-router";

interface SwipeToOrderButtonProps {
  createOrder: () => Promise<void>;
}

const SwipeToOrderButton: React.FC<SwipeToOrderButtonProps> = ({
  createOrder,
}) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [animationSource, setAnimationSource] = useState<any>(
    require("../../assets/lottie/loading.json"),
  );
  const [animationKey, setAnimationKey] = useState<number>(0); // To force re-render of LottieView

  const handleSwipeComplete = async () => {
    setIsModalVisible(true);
    setAnimationSource(require("../../assets/lottie/loading.json"));
    setAnimationKey((prevKey) => prevKey + 1);

    try {
      const order = await createOrder();

      // On success
      setAnimationSource(require("../../assets/lottie/success.json"));
      setTimeout(() => {
        setIsModalVisible(false);
        router.replace("/");
      }, 2000);
    } catch (error) {
      // On error
      setAnimationSource(require("../../assets/lottie/error.json"));
    } finally {
      // Force re-render of LottieView
      setAnimationKey((prevKey) => prevKey + 1);
    }
  };

  return (
    <View
      style={{
        width: "100%",
        direction: "ltr",
      }}
    >
      <SwipeButton
        Icon={
          <MaterialIcons name="keyboard-arrow-right" size={50} color="white" />
        }
        onComplete={handleSwipeComplete}
        circleBackgroundColor="#fd8000"
        title="החלק כדי להזמין"
        borderRadius={50}
        titleStyle={{ color: "white", fontSize: 18 }}
        underlayTitle="שחרר כדי להזמין"
        containerStyle={{
          backgroundColor: "#fcb16a",
        }}
        underlayStyle={{
          backgroundColor: "#fd8000",
        }}
        underlayTitleStyle={{
          color: "white",
          fontSize: 18,
        }}
        goBackToStart
      />

      {/* Modal */}
      <Modal
        visible={isModalVisible}
        transparent={false}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <LottieView
            key={animationKey}
            source={animationSource}
            autoPlay
            loop={
              animationSource === require("../../assets/lottie/loading.json")
            }
            style={styles.lottie}
            onAnimationFinish={() => {
              if (
                animationSource !== require("../../assets/lottie/loading.json")
              ) {
                // Close modal after success or error animation finishes
                setTimeout(() => {
                  setIsModalVisible(false);
                }, 2000);
              }
            }}
          />
        </View>
      </Modal>
    </View>
  );
};

export default SwipeToOrderButton;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  lottie: {
    width: Dimensions.get("window").width * 0.8,
    height: Dimensions.get("window").width * 0.8,
  },
});
