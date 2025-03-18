import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import React, { useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import ButtonConfirm from "../components/ButtonConfirm";
import InputLogin from "../components/InputLogin";
import { globalStyles } from "../globalStyles";

import lionKing from "../assets/films/lionking.jpg";

const API_URL = "http://172.20.10.2:3000";

export default function Login() {
  const navigation = useNavigation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [incorrectUser, setIncorrectUser] = useState(false);
  const [incorrectPassword, setIncorrectPassword] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/api/users/login`,
        {
          username,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        // Recuperar token
        const { token } = response.data;

        // Guardar token a AsyncStorage
        await AsyncStorage.setItem("authToken", token);

        setIncorrectUser(false);
        setIncorrectPassword(false);

        navigation.navigate("Home");
      } else {
        console.error("Error en el login", response.data);
      }
    } catch (error) {
      if (error.response.status === 401) {
        const errorMesage = error.response.data.message;

        if (errorMesage.includes("username")) {
          setIncorrectUser(true);
          setIncorrectPassword(false);
        } else if (errorMesage.includes("password")) {
          setIncorrectUser(false);
          setIncorrectPassword(true);
        } else {
          setIncorrectUser(true);
          setIncorrectPassword(true);
        }
      } else {
        console.error("Error en el login:", error);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={globalStyles.container}>
            <Image style={styles.image} source={lionKing} />

            <View style={styles.main}>
              <Text style={styles.text}>RecomendMe</Text>

              <View style={styles.signUp}>
                <Text style={[globalStyles.textBase, styles.signUpText]}>
                  Sign In
                </Text>
                <Text style={[globalStyles.textBase, styles.signUpTextCreate]}>
                  Please sign in to continue.
                </Text>
              </View>

              <View style={styles.buttonsSign}>
                <InputLogin
                  text="Username"
                  icon="person-circle-outline"
                  type="default"
                  value={username}
                  onChange={setUsername}
                />
                {incorrectUser && (
                  <Text style={[globalStyles.textBase, styles.incorrectInfo]}>
                    Incorrect username
                  </Text>
                )}
                <InputLogin
                  text="Password"
                  icon="lock-closed-outline"
                  type="password"
                  value={password}
                  onChange={setPassword}
                />
                {incorrectPassword && (
                  <Text style={[globalStyles.textBase, styles.incorrectInfo]}>
                    Incorrect password
                  </Text>
                )}
                <TouchableOpacity activeOpacity={0.8} onPress={handleLogin}>
                  <ButtonConfirm text="Log In" />
                </TouchableOpacity>
              </View>

              <Text style={styles.haveAccount}>
                Don't have an account? Please{" "}
                <Text
                  style={styles.loginLink}
                  onPress={() => navigation.navigate("Register")}
                >
                  Sign up
                </Text>{" "}
                first.
              </Text>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = {
  image: {
    width: 720,
    height: 350,
    transform: [{ translateX: -40 }],
  },

  main: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  text: {
    color: "#fff",
    fontSize: 40,
    fontWeight: "bold",
  },

  signUp: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
  },

  signUpText: {
    fontSize: 30,
    fontWeight: "bold",
  },

  signUpTextCreate: {
    marginTop: 10,
    fontSize: 13,
  },

  buttonsSign: {
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    marginBottom: 20,
  },

  incorrectInfo: {
    alignSelf: "flex-start",
    marginLeft: 10,
    fontSize: 12,
    color: "#E9A6A6",
    marginTop: -10,
  },

  haveAccount: {
    fontSize: 12,
    color: "#E9A6A6",
  },

  loginLink: {
    color: "#9C4A8B",
  },
};
