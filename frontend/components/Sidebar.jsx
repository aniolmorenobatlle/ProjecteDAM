import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useUserInfo } from "../hooks/useUserInfo";

const { width, height } = Dimensions.get("window");

export default function Sidebar({ isOpen, closeMenu }) {
  const navigation = useNavigation();
  const translateX = useRef(new Animated.Value(-width * 0.6)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const { userInfo, loading, error } = useUserInfo();

  useEffect(() => {
    if (isOpen) {
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isOpen]);

  const closeSidebar = () => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: -width * 0.6,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      closeMenu();
    }, 300);
  };

  if (!isOpen && overlayOpacity._value === 0) return null;

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("authToken");

      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      console.error("Error fent logout:", error);
    }
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#1F1D36",
        }}
      >
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#1F1D36",
        }}
      >
        <Text style={{ color: "white", fontSize: 16 }}>
          {error?.message === "401"
            ? "Unauthorized: Redirecting to login..."
            : `Error: ${error?.message || "Error desconegut"}`}
        </Text>
      </View>
    );
  }

  return (
    !!isOpen && (
      <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
        <Animated.View
          style={[styles.container, { transform: [{ translateX }] }]}
        >
          <TouchableOpacity onPress={closeSidebar} style={styles.closeButton}>
            <Icon name="close" size={30} color="white" />
          </TouchableOpacity>

          <View style={styles.avatar}>
            {userInfo.avatar ? (
              <Image
                style={styles.menuIconAvatar}
                source={{ uri: userInfo.avatar }}
              />
            ) : (
              <Image
                style={styles.menuIconAvatar}
                source={{ uri: userInfo.avatar_binary }}
              />
            )}
            <View style={styles.avatarTexts}>
              <Text style={[styles.username, { color: "#e9a6a6" }]}>
                {userInfo.name.split(" ")[0]}
              </Text>
              <Text style={styles.handle}>@{userInfo.username}</Text>
            </View>
          </View>

          <View style={styles.menu}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.menuItem}
              onPress={closeSidebar}
            >
              <Icon
                name="home-outline"
                size={24}
                color="white"
                style={styles.icon}
              />
              <Text style={styles.menuText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.menuItem}
              onPress={() => {
                closeSidebar();
                navigation.navigate("Search");
              }}
            >
              <Icon
                name="film-outline"
                size={24}
                color="white"
                style={styles.icon}
              />
              <Text style={styles.menuText}>Films</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.menuItem}
              onPress={() => {
                closeSidebar();
                navigation.navigate("Lists");
              }}
            >
              <Icon
                name="list-outline"
                size={24}
                color="white"
                style={styles.icon}
              />
              <Text style={styles.menuText}>Lists</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <Icon
                name="log-out-outline"
                size={24}
                color="white"
                style={styles.icon}
              />
              <Text style={styles.menuText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    )
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    width: width,
    height: height,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 99,
    justifyContent: "flex-start",
  },

  container: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#1f1d36",
    width: width * 0.6,
    height: "100%",
    zIndex: 100,
    position: "absolute",
    left: 0,
  },

  closeButton: {
    alignSelf: "flex-end",
    marginBottom: 20,
    marginTop: 30,
  },

  avatar: {
    gap: 10,
  },

  menuIconAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "white",
  },

  menuIconAvatarNone: {
    color: "white",
    width: 80,
    height: 80,
  },

  username: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
  },

  handle: {
    color: "#aaa",
    marginBottom: 20,
  },

  menu: {
    marginTop: 20,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },

  menuText: {
    color: "white",
    fontSize: 18,
    marginLeft: 10,
  },

  icon: {
    width: 30,
  },
});
