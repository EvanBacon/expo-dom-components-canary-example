import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  Dimensions,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { LogOut } from "lucide-react-native";
import { useAuth } from "@/components/providers/auth-provider";

const { width, height } = Dimensions.get("window");

const LogoutButton = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const modalTranslateY = useSharedValue(300);
  const { logout } = useAuth();

  const animatedModalStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: modalTranslateY.value }],
  }));

  const handlePress = () => {
    setIsModalVisible(true);
    modalTranslateY.value = withSpring(0, { damping: 20, stiffness: 150 });
  };

  const handleCancel = () => {
    modalTranslateY.value = withSpring(300, { damping: 20, stiffness: 150 });
    setIsModalVisible(false); // Hide modal immediately, overlay will disappear
  };

  const handleLogout = () => {
    setIsModalVisible(false);
    logout();
  };

  return (
    <View style={styles.container}>
      {/* Original Logout Button */}
      <Pressable style={styles.logoutButton} onPress={handlePress}>
        <LogOut
          size={20}
          strokeWidth={2.5}
          color="white"
          style={styles.logoutIcon}
        />
        <Text style={styles.logoutText}>התנתק</Text>
      </Pressable>

      {/* Modal with Animation */}
      {isModalVisible && (
        <Modal transparent visible={isModalVisible} animationType="none">
          <View style={styles.modalOverlay}>
            <Animated.View style={[styles.modalContainer, animatedModalStyle]}>
              <Text style={styles.modalTitle}>האם אתה בטוח?</Text>
              <Text style={styles.modalInfo}>אתה עומד להתנתק מהחשבון שלך.</Text>
              <View style={styles.buttonContainer}>
                <Pressable style={styles.cancelButton} onPress={handleCancel}>
                  <Text style={styles.buttonText}>לא</Text>
                </Pressable>
                <Pressable style={styles.confirmButton} onPress={handleLogout}>
                  <Text style={styles.buttonText}>כן</Text>
                </Pressable>
              </View>
            </Animated.View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#FF5733",
    borderRadius: 8,
    overflow: "hidden",
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    color: "white",
    fontSize: 20,
    fontFamily: "fredoka-semibold",
    textAlign: "left",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalContainer: {
    width: width * 0.9,
    height: height * 0.25, // Slightly longer height
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 40, // More rounded corners
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    width: "100%",
    fontSize: 22,
    fontFamily: "fredoka",
    fontWeight: "bold",
    textAlign: "left",
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  modalInfo: {
    width: "100%",
    fontSize: 16,
    fontFamily: "fredoka",
    color: "#666", // Light grey color for description
    textAlign: "left",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    position: "absolute",
    bottom: 20,
    paddingHorizontal: 10,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: "#FF5733",
    paddingVertical: 12,
    borderRadius: 15,
    marginLeft: 10,
    alignItems: "center",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#BBB", // Lighter grey color for "No" button
    paddingVertical: 12,
    borderRadius: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontFamily: "fredoka-semibold",
  },
});

export default LogoutButton;
