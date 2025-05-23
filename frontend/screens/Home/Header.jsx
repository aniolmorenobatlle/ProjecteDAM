import { View, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { API_URL } from "../../config";

export default function Header({ onMenuPress, userInfo }) {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <TouchableOpacity activeOpacity={0.8} onPress={onMenuPress}>
        <Icon name="menu" size={50} color="white" />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
        <Image
          style={styles.menuIconAvatar}
          source={{
            uri: userInfo?.avatar
              ? `${userInfo?.avatar}&nocache=${Date.now()}`
              : `${API_URL}/api/users/${userInfo?.id}/avatar?nocache=${Date.now()}`,
          }}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = {
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  menuIconAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "white",
  },
};
