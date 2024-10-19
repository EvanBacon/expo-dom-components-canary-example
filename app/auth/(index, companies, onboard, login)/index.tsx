import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import LottieView from "lottie-react-native";
import { router } from "expo-router";

const GrubSetupScreen = () => {
  return (
    <>
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>בוא נתחיל עם גרב!</Text>
      <Text style={styles.subtitle}>
        אנא בחרו כיצד תרצו להמשיך בהגדרת החשבון שלכם
        אנא בקרו ב-
        <Text
          style={styles.link}
          onPress={() => Linking.openURL("https://grubapp.co/privacy")}
        >
          {" "}הצהרת הפרטיות של גרב{" "}
        </Text>
        למידע על עיבוד הנתונים האישיים שלכם.
      </Text>

      {/* Lottie Animation */}

      {/* Button */}
    </SafeAreaView>
    <LottieView
    source={require("@/assets/lottie/order.json")}
    autoPlay
    loop
    style={styles.lottie}
    />
    <TouchableOpacity style={styles.button} onPress={() => router.navigate("/auth/companies")}>
    <Text style={styles.buttonText}>בחר חברה</Text>
    </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginHorizontal: 20,
    top: "10%",
    textAlign: "left",
    height: "100%",
  },
  title: {
    fontSize: 28,
    fontFamily: "fredoka-bold",
    color: "#333",
    textAlign: "left",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#333",
    textAlign: "left",
    marginBottom: 10,
  },
  link: {
    color: "#FD8000",
    fontFamily: "fredoka-semibold",
  },
  lottie: {
      position: "absolute",
      alignSelf: "center",
      top: "20%",
      bottom: "20%",
    width: 370,
    height: 370,
    marginVertical: 20,
  },
  button: {
      position: "absolute",
    bottom: "10%",
    backgroundColor: "#FD8000",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "90%",
    alignSelf: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "fredoka-bold",
  },
});

export default GrubSetupScreen;
