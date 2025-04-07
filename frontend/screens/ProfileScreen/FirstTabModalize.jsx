import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import { API_URL } from "../../config";
import EditProfile from "./FirstTab/EditProfile";
import SearchModalize from "./FirstTab/SearchModalize";

export default function FirstTabModalize({
  userInfo,
  newName,
  setNewName,
  newUsername,
  setNewUsername,
  poster,
  setIndex,
}) {
  const modalizeRef = useRef(null);
  const [favoritesLoading, setFavoritesLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [filledFavorites, setFilledFavorites] = useState([]);

  const onOpen = () => {
    modalizeRef.current?.open();
  };

  const fetchFavorites = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");

      const response = await axios.get(`${API_URL}/api/users/favorites`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setFavorites(response.data.favorites);
      }
    } catch (error) {
      Alert.alert("Error", "Error fetching favorites, please try again later");
      console.error("Error fetching favorites:", error);
    } finally {
      setFavoritesLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo) {
      fetchFavorites();
    }
  }, [userInfo]);

  useEffect(() => {
    if (!favoritesLoading) {
      const filled = [...favorites, ...Array(4 - favorites.length).fill(null)];
      setFilledFavorites(filled.slice(0, 4));
    }
  }, [favorites, favoritesLoading]);

  return (
    <>
      <EditProfile
        userInfo={userInfo}
        newName={newName}
        setNewName={setNewName}
        newUsername={newUsername}
        setNewUsername={setNewUsername}
        poster={poster}
        filledFavorites={filledFavorites}
        setIndex={setIndex}
        onOpen={onOpen}
        fetchFavorites={fetchFavorites}
      />

      <SearchModalize
        modalizeRef={modalizeRef}
        fetchFavorites={fetchFavorites}
        userInfo={userInfo}
      />
    </>
  );
}
