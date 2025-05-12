import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Platform, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export default function Navbar({ currentPage }) {
  const navigation = useNavigation();

  const handleIconClick = (page) => {
    navigation.navigate(page);
  };

  return (
    <View style={styles.navbar}>
      <TouchableOpacity onPress={() => handleIconClick("Home")}>
        <Icon
          name="home-outline"
          color={currentPage === "Home" ? "#E9A6A6" : "white"}
          size={35}
          style={styles.navbarIcon}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleIconClick("Search")}>
        <Icon
          name="search-outline"
          color={currentPage === "Search" ? "#E9A6A6" : "white"}
          size={35}
          style={styles.navbarIcon}
        />
      </TouchableOpacity>

      {/* <TouchableOpacity onPress={() => handleIconClick("Recommend")}>
        <Icon
          name="star-outline"
          color={currentPage === "Recommend" ? "#E9A6A6" : "white"}
          size={35}
          style={styles.navbarIcon}
        />
      </TouchableOpacity> */}

      <TouchableOpacity onPress={() => handleIconClick("Notifications")}>
        <Icon
          name="notifications-outline"
          color={currentPage === "Notifications" ? "#E9A6A6" : "white"}
          size={35}
          style={styles.navbarIcon}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleIconClick("Profile")}>
        <Icon
          name="person-outline"
          color={currentPage === "Profile" ? "#E9A6A6" : "white"}
          size={35}
          style={styles.navbarIcon}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = {
  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: Platform.OS === "ios" ? 80 : 70,
    width: "100%",
    backgroundColor: "#1F1D36",
    paddingHorizontal: 30,
    paddingBottom: Platform.OS === "ios" ? 30 : 0,
    borderTopWidth: 1,
    borderTopColor: "#2A2634",
  },
};
