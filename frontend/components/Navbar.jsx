import { useNavigation } from "@react-navigation/native";
import { Platform, TouchableOpacity, SafeAreaView } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export default function Navbar({ currentPage }) {
  const navigation = useNavigation();

  const handleIconClick = (page) => {
    navigation.navigate(page);
  };

  return (
    <SafeAreaView style={styles.navbar}>
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
    </SafeAreaView>
  );
}

const styles = {
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: Platform.OS === "ios" ? 85 : 70,
    backgroundColor: "#1F1D36",
    borderTopWidth: 1,
    borderTopColor: "#2A2634",
  },
};
