import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { API_URL } from "../config";
import { globalStyles } from "../globalStyles";
import { useUserInfo } from "../hooks/useUserInfo";
import CustomModalize from "./ProfileScreen/CustomModalize";
import FirstTabModalize from "./ProfileScreen/FirstTabModalize";
import MainProfile from "./ProfileScreen/MainProfile";
import SecondTabModalize from "./ProfileScreen/SecondTabModalize";

export default function Profile({ setIsModalizeOpen }) {
  const { userInfo, loading, error } = useUserInfo();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalizeRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [newName, setNewName] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [poster, setPoster] = useState(userInfo?.poster);
  const [favoritesLoading, setFavoritesLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [filledFavorites, setFilledFavorites] = useState([]);

  const fetchFavorites = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");

      const response = await axios.get(
        `${API_URL}/api/users/favorites/${userInfo.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        setFavorites(response.data.favorites);
      }
    } catch (error) {
      Alert.alert("Error", "Error fetching favorites, please try again later");
    } finally {
      setFavoritesLoading(false);
    }
  };

  const openModalize = () => {
    modalizeRef.current?.open();
    setIsModalOpen(true);
    setIsModalizeOpen(true);
  };

  useEffect(() => {
    if (userInfo) {
      setNewName(userInfo.name);
      setNewUsername(userInfo.username);
      setPoster(userInfo.poster);
      fetchFavorites();
    }
  }, [userInfo]);

  useEffect(() => {
    if (!favoritesLoading) {
      const filled = [...favorites, ...Array(4 - favorites.length).fill(null)];
      setFilledFavorites(filled.slice(0, 4));
    }
  }, [favorites, favoritesLoading]);

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
    <View style={[globalStyles.container, { flex: 1 }]}>
      <MainProfile
        profileInfo={userInfo}
        openModalize={openModalize}
        isModalOpen={isModalOpen}
        poster={poster}
        newName={newName}
        newUsername={newUsername}
        filledFavorites={filledFavorites}
        fetchFavorites={fetchFavorites}
        editable={true}
      />

      <CustomModalize
        userInfo={userInfo}
        modalizeRef={modalizeRef}
        setIsModalOpen={setIsModalOpen}
        setIsModalizeOpen={setIsModalizeOpen}
        setIndex={setIndex}
        title="Edit your Profile"
      >
        {index === 0 ? (
          <FirstTabModalize
            userInfo={userInfo}
            newName={newName}
            setNewName={setNewName}
            newUsername={newUsername}
            setNewUsername={setNewUsername}
            poster={poster}
            setIsModalOpen={setIsModalOpen}
            setIsModalizeOpen={setIsModalizeOpen}
            modalizeRef={modalizeRef}
            setIndex={setIndex}
            filledFavorites={filledFavorites}
            fetchFavorites={fetchFavorites}
          />
        ) : (
          <SecondTabModalize
            userInfo={userInfo}
            selectedPoster={selectedPoster}
            setSelectedPoster={setSelectedPoster}
            setPoster={setPoster}
            setIndex={setIndex}
          />
        )}
      </CustomModalize>
    </View>
  );
}
