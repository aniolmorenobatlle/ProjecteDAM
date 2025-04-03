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
  const [favoritesLoading, setFavoritesLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [filledFavorites, setFilledFavorites] = useState([]);

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

  const modalizeRef = useRef(null);

  const onOpen = () => {
    modalizeRef.current?.open();
  };

  const onClose = () => {
    modalizeRef.current?.close();
  };

  const onSearch = (query) => {
    // setSearchQuery(query);
  };

  const handleSaveChangesProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");

      const response = await axios.post(
        `${API_URL}/api/users/editProfile`,
        {
          name: newName,
          username: newUsername,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        setNewName(response.data.name);
        setNewUsername(response.data.username);
        setIsModalOpen(false);
        setIsModalizeOpen(false);
        modalizeRef.current?.close();
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          Alert.alert(
            "Error",
            "Username already in use, please choose another one"
          );
        } else {
          Alert.alert(
            "Error",
            "Error updating profile, please try again later"
          );
        }
      } else {
        Alert.alert("Error", "Network error, please try again");
      }
    }
  };

  const handleDeleteFavorite = async (favoriteId) => {
    try {
      const token = await AsyncStorage.getItem("authToken");

      const response = await axios.post(
        `${API_URL}/api/users/deleteFavorite`,
        {
          movieId: favoriteId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        setFavorites((prevFavorites) =>
          prevFavorites.filter((fav) => fav.id_api != favoriteId)
        );
      }
    } catch (error) {
      Alert.alert("Error", "Error deleting favorite, please try again later");
      console.error("Error deleting favorite:", error);
    }
  };

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
        handleSaveChangesProfile={handleSaveChangesProfile}
        onOpen={onOpen}
        handleDeleteFavorite={handleDeleteFavorite}
      />

      <SearchModalize
        modalizeRef={modalizeRef}
        onClose={onClose}
        onSearch={onSearch}
        userInfo={userInfo}
      />
    </>
  );
}
