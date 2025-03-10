import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { useState } from "react";
import { Image, Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import ButtonConfirm from '../components/ButtonConfirm';
import InputLogin from '../components/InputLogin';
import { globalStyles } from "../globalStyles";

import lalaland from '../assets/films/lalaland.jpg';

export default function Register() {
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [incorrectUser, setIncorrectUser] = useState(false);
  const [incorrectEmail, setIncorrectEmail] = useState(false);
  const [incorrectPassword, setIncorrectPassword] = useState(false);

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/;
    return regex.test(password);
  }

  // Handle per registre
  const handleRegister = async () => {
    if (username.trim() === "") {
      setIncorrectUser(true);
      return;
    } else {
      setIncorrectUser(false); 
    }
  
    if (email.trim() === "") {
      setIncorrectEmail(true);
      return;
    } else {
      setIncorrectEmail(false);
    }

    if (!validatePassword(password)) {
      setIncorrectPassword(true);
      return;
    } else {
      setIncorrectPassword(false);
    }

    try {
      const response = await axios.post("http://172.20.10.2:3000/api/users/register", {
        name,
        username,
        email,
        password,
      })

      if (response.status === 200) {
        const { token } = response.data;

        // Guardar token a AsyncStorage
        await AsyncStorage.setItem('authToken', token);

        navigation.navigate('Login');
      } else {
        if (error.response) {
          const errorMessage = error.response.data.message;
          console.error("Error al servidor:", errorMessage);
  
          if (errorMessage.includes("username")) {
            setIncorrectUser(true);
            setIncorrectEmail(false);
          } else if (errorMessage.includes("email")) {
            setIncorrectEmail(true);
            setIncorrectUser(false);
          } else {
            setIncorrectUser(true);
            setIncorrectEmail(true);
          }
        }
      }
    } catch (error) {
      console.error("Error en la petició de registre", error);
    }
  }
  
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View style={globalStyles.container}>
            <Image style={styles.image} source={lalaland} />

            <View style={styles.main}>
              <View style={styles.signUp}>
                <Text style={[globalStyles.textBase, styles.signUpText]}>Sign Up</Text>
                <Text style={[globalStyles.textBase, styles.signUpTextCreate]}>Create your account for free!</Text>
              </View>

              <View style={styles.buttonsSign}>
                <InputLogin
                  text="Name"
                  icon="person-circle-outline"
                  type="default"
                  value={name}
                  onChange={setName}
                />

                <InputLogin
                  text="Username"
                  icon="person-circle-outline"
                  type="default"
                  value={username}
                  onChange={setUsername}
                />
                {incorrectUser && (
                  <Text style={[globalStyles.textBase, styles.incorrectInfo]}>
                    {username.trim() === "" ? "Username is required!" : "This username is already in use!"}
                  </Text>
                )}

                <InputLogin
                  text="Email"
                  icon="mail-outline"
                  type="email-address"
                  value={email}
                  onChange={setEmail}
                />
                {incorrectEmail && (
                  <Text style={[globalStyles.textBase, styles.incorrectInfo]}>
                    {email.trim() === "" ? "Email is required!" : "This email is already in use!"}
                  </Text>
                )}
                
                {incorrectEmail && (
                  <Text style={[globalStyles.textBase, styles.incorrectInfo]}>
                    This email is already in use!
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
                    Password must be at least 8 characters long, with 1 uppercase, 1 lowercase, 1 number, and 1 special character!
                  </Text>
                )}
                <TouchableOpacity activeOpacity={0.8} onPress={handleRegister}>
                  <ButtonConfirm text="Register" />
                </TouchableOpacity>
              </View>

              <Text style={styles.haveAccount}>
                Already have an account? Go to the {" "}
                <Text
                  style={styles.loginLink}
                  onPress={() => navigation.navigate('Login')}
                >
                  Login page.
                </Text>
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
    color: '#E9A6A6',
    marginTop: -10,
  },

  haveAccount: {
    fontSize: 12,
    color: '#E9A6A6',
  },

  loginLink: {
    color: '#9C4A8B',
  },
};
