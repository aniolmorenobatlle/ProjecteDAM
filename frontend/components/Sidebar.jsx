import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, Image, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const robertPattinson = "https://image.tmdb.org/t/p/w500/8A4PS5iG7GWEAVFftyqMZKl3qcr.jpg"

const { width, height } = Dimensions.get("window");

export default function Sidebar({ isOpen, closeMenu }) {
  const navigation = useNavigation();
  const translateX = useRef(new Animated.Value(-width * 0.6)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

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
    } else {
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
    }
  }, [isOpen]);

  if (!isOpen && overlayOpacity._value === 0) return null;

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("authToken");

      closeMenu();

      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      })
      
    } catch (error) {
      console.error("Error fent logout:", error);
    }
  }

  return (
    <TouchableWithoutFeedback onPress={closeMenu}>
      <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
        <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
          <Animated.View style={[styles.container, { transform: [{ translateX }] }]}>
            <TouchableOpacity onPress={closeMenu} style={styles.closeButton}>
              <Icon name="close" size={30} color="white" />
            </TouchableOpacity>

            <View style={styles.avatar}>
              <Image style={styles.menuIconAvatar} source={{ uri: robertPattinson }} />
              <View style={styles.avatarTexts}>
                <Text style={[styles.username, { color: "#e9a6a6" }]}>Robert</Text>
                <Text style={styles.handle}>@robert_pattinson</Text>
              </View>
            </View>

            <View style={styles.menu}>
              <TouchableOpacity style={styles.menuItem} onPress={closeMenu}>
                <Icon name="home-outline" size={24} color="white" style={styles.icon} />
                <Text style={styles.menuText}>Home</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={closeMenu}>
                <Icon name="film-outline" size={24} color="white" style={styles.icon} />
                <Text style={styles.menuText}>Films</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={closeMenu}>
                <Icon name="book-outline" size={24} color="white" style={styles.icon} />
                <Text style={styles.menuText}>Diary</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={closeMenu}>
                <Icon name="heart-outline" size={24} color="white" style={styles.icon} />
                <Text style={styles.menuText}>Likes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                <Icon name="log-out-outline" size={24} color="white" style={styles.icon} />
                <Text style={styles.menuText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </TouchableWithoutFeedback>
      </Animated.View>
    </TouchableWithoutFeedback>
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
    borderColor: 'white',
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
