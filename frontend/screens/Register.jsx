import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import React, { useState } from "react";
import {
  Alert,
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
import { API_URL } from "../config";
import { globalStyles } from "../globalStyles";

import lalaland from "../assets/films/lalaland.jpg";

const CLOUNDINARY_URL =
  "https://res.cloudinary.com/dwe0on2fw/image/upload/recommendme-cover";

const posters = [
  "toyStory",
  "interstellar",
  "whiplash",
  "spiderman",
  "lotr",
  "walle",
  "topGun",
  "theBatman",
  "lionKing",
  "pp",
  "noah",
  "hp",
];

export default function Register() {
  const navigation = useNavigation();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("");

  const checkUsernameAvailability = async (username) => {
    try {
      await axios.get(`${API_URL}/api/users/check-username/${username}`);
      return true;
    } catch (error) {
      return false;
    }
  };

  const checkEmailAvailability = async (email) => {
    try {
      await axios.get(`${API_URL}/api/users/check-email/${email}`);
      return true;
    } catch (error) {
      return false;
    }
  };

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/;
    return regex.test(password);
  };

  const getRandomLightColor = () => {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return `${randomColor.padStart(6, "0")}`;
  };

  const getAvatarUrl = (name) => {
    if (!name) return "";

    const onlyNamePart = name.split(" ")[0];
    const backgroundColor = getRandomLightColor();
    return `https://ui-avatars.com/api/?length=1&name=${onlyNamePart}&size=128&bold=true&background=${backgroundColor}`;
  };

  const getRandomPoster = () => {
    const randomIndex = Math.floor(Math.random() * posters.length);
    return `${CLOUNDINARY_URL}/${posters[randomIndex]}.jpg`;
  };

  const handleNameChange = (name) => {
    setName(name);
    setAvatar(getAvatarUrl(name));
  };

  const handleRegister = async () => {
    if (username.trim() === "") {
      Alert.alert("Error", "Username is required!");
      return;
    }

    if (username.length < 4) {
      Alert.alert("Error", "Username must be at least 4 characters long!");
      return;
    }

    const isUsernameAvailable = await checkUsernameAvailability(username);
    if (!isUsernameAvailable) {
      Alert.alert("Error", "Username is already taken!");
      return;
    }

    const isEmailAvailable = await checkEmailAvailability(email);
    if (!isEmailAvailable) {
      Alert.alert("Error", "Email is already taken!");
      return;
    }

    if (email.trim() === "") {
      Alert.alert("Error", "Email is required!");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      Alert.alert("Error", "Email is not valid!");
      return;
    }

    if (!validatePassword(password)) {
      Alert.alert(
        "Error",
        "Password must be at least 8 characters long, with 1 uppercase, 1 lowercase, 1 number, and 1 special character!"
      );
      return;
    }

    const randomPoster = getRandomPoster();

    try {
      const response = await axios.post(`${API_URL}/api/users/register`, {
        name,
        username,
        email,
        password,
        avatar,
        poster: randomPoster,
      });

      if (response.status === 200) {
        navigation.navigate("Login");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={globalStyles.container}>
            <Image style={styles.image} source={lalaland} />

            <View style={styles.main}>
              <View style={styles.signUp}>
                <Text style={[globalStyles.textBase, styles.signUpText]}>
                  Sign Up
                </Text>
                <Text style={[globalStyles.textBase, styles.signUpTextCreate]}>
                  Create your account for free!
                </Text>
              </View>

              <View style={styles.buttonsSign}>
                <InputLogin
                  text="Full Name"
                  icon="person-circle-outline"
                  type="default"
                  value={name}
                  onChange={handleNameChange}
                />

                <InputLogin
                  text="Username"
                  icon="person-circle-outline"
                  type="default"
                  value={username}
                  onChange={setUsername}
                />

                <InputLogin
                  text="Email"
                  icon="mail-outline"
                  type="email-address"
                  autoComplete="email"
                  value={email}
                  onChange={setEmail}
                />

                <InputLogin
                  text="Password"
                  icon="lock-closed-outline"
                  type="password"
                  value={password}
                  onChange={setPassword}
                />

                <TouchableOpacity activeOpacity={0.8} onPress={handleRegister}>
                  <ButtonConfirm text="Register" />
                </TouchableOpacity>
              </View>

              <Text style={styles.haveAccount}>
                Already have an account? Go to the{" "}
                <Text
                  style={styles.loginLink}
                  onPress={() => navigation.navigate("Login")}
                >
                  Login page.
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = {
  image: {
    width: 720,
    height: 320,
    transform: [{ translateX: -260 }],
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
    alignItems: "center",
    justifyContent: "center",
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
