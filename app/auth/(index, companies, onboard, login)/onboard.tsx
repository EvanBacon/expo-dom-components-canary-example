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
import { useCompanyStore } from "@/lib/store/companyStore";

const OnboardScreen = () => {
    const { selectedCompany } = useCompanyStore();
  return (
    <>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>ברוכים הבאים לגרב!</Text>
        <Text style={styles.subtitle}>
          לקבלת אישור גישה, אנא פנו למנהלים שלכם ב-״{
              <Text style={{fontFamily: "fredoka-bold" }}>{selectedCompany?.name}</Text>
          }״ לקבלת פרטי התחברות.
          לא בטוחים איך להתחבר?
          <Text
            style={styles.link}
            onPress={() => Linking.openURL("https://grubapp.co/how-to-login")}
          >
            {" "}לחצו כאן{" "}
          </Text>
        </Text>

        {/* Lottie Animation */}
      </SafeAreaView>
      <LottieView
        source={require("@/assets/lottie/onboard.json")}
        autoPlay
        loop
        style={styles.lottie}
      />

      {/* Continue to Login Button */}
      <TouchableOpacity style={styles.button} onPress={() => router.navigate("/auth/login")}>
        <Text style={styles.buttonText}>המשך להתחברות</Text>
      </TouchableOpacity>

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>לא בחרתי החברה שלי</Text>
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
    top: "25%",
    width: 400,
    height: 400,
    marginVertical: 20,
  },
  button: {
    position: "absolute",
    bottom: "15%",
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
  backButton: {
    position: "absolute",
    bottom: "7%",
    alignSelf: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: "#F1F1F1",
    width: "90%",
    alignItems: "center",
  },
  backButtonText: {
    color: "#333",
    fontSize: 18,
    fontFamily: "fredoka-semibold",
  },
});

export default OnboardScreen;
