import axios from "axios";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useRoute } from "@react-navigation/native";
import { API_URL } from "../config";
import { globalStyles } from "../globalStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MainProfile from "./ProfileScreen/MainProfile";

export default function UserProfile({}) {
  const route = useRoute();
  const { userId } = route.params;

  const [otherUser, setOtherUser] = useState(null);
  const [favorites, setFavorites] = useState([]);

  const fetchUser = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await axios.get(`${API_URL}/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOtherUser(response.data);
    } catch (error) {
      console.log("Error fetching user:", error);
      alert("Error fetching user, please try again later");
    }
  };

  const fetchUserFavorites = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await axios.get(
        `${API_URL}/api/users/favorites/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setFavorites(response.data.favorites);
    } catch (error) {
      console.log("Error fetching user favorites:", error);
      alert("Error fetching user favorites, please try again later");
    }
  };

  useEffect(() => {
    fetchUser();
    fetchUserFavorites();
  });

  return (
    <View style={[globalStyles.container]}>
      <MainProfile
        profileInfo={otherUser}
        poster={otherUser?.poster}
        filledFavorites={favorites}
      />
    </View>
  );
}
