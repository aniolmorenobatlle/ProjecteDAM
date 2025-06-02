import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { API_URL } from "../../../config";
import { globalStyles } from "../../../globalStyles";
import CustomModal from "../../../components/CustomModal";
import { useState } from "react";

export default function EditProfile({
  userInfo,
  newName,
  setNewName,
  newUsername,
  setNewUsername,
  newEmail,
  setNewEmail,
  poster,
  filledFavorites,
  setIndex,
  avatarUri,
  onOpen,
  fetchFavorites,
  handleClose,
}) {
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedFavoriteId, setSelectedFavoriteId] = useState(null);

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  const handleSaveChangesProfile = async () => {
    if (newEmail && !validateEmail(newEmail)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("authToken");

      const response = await axios.post(
        `${API_URL}/api/users/editProfile`,
        {
          name: newName,
          username: newUsername,
          email: newEmail,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        setNewName(response.data.name);
        setNewUsername(response.data.username);
        setNewEmail(response.data.email);

        handleClose();
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          Alert.alert(
            "Error",
            "Email or Username already in use, please choose another one"
          );
        } else {
          Alert.alert(
            "Error",
            "Error updating profile, please try again later"
          );
        }
      } else {
        console.error("Network error:", error);
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
        handleCloseModalDelete();
        fetchFavorites();
      }
    } catch (error) {
      Alert.alert("Error", "Error deleting favorite, please try again later");
      console.error("Error deleting favorite:", error);
    }
  };

  const handleOpenModalDelete = (favoriteId) => {
    setSelectedFavoriteId(favoriteId);
    setDeleteModal(true);
  };

  const handleCloseModalDelete = () => {
    setDeleteModal(false);
    setSelectedFavoriteId(null);
  };

  return (
    <ScrollView
      style={{ flex: 1, paddingBottom: 20 }}
      showsVerticalScrollIndicator={false}
    >
      <View>
        <View style={styles.profileTitleContainer}>
          <Text style={styles.profileTitle}>Profile</Text>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleSaveChangesProfile}
          >
            <Text style={[globalStyles.textBase, styles.btnSave]}>Save</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.longLine}></View>

        <View
          style={styles.listInfoContainer}
          contentContainerStyle={{ alignItems: "center" }}
        >
          <View style={{ width: "100%" }}>
            <View style={styles.profileInfoContainer}>
              <Text style={[globalStyles.textBase, styles.listInfoTitle]}>
                Full Name
              </Text>

              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
              >
                <TextInput
                  style={[globalStyles.textBase, styles.listInfoResult]}
                  value={newName}
                  onChangeText={(text) => setNewName(text)}
                />
              </View>
            </View>

            <View style={styles.profileLineSeparator}></View>

            <View style={styles.profileInfoContainer}>
              <Text style={[globalStyles.textBase, styles.listInfoTitle]}>
                Username
              </Text>

              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
              >
                <TextInput
                  style={[globalStyles.textBase, styles.listInfoResult]}
                  value={newUsername}
                  onChangeText={(text) => setNewUsername(text)}
                />
              </View>
            </View>

            <View style={styles.profileLineSeparator}></View>

            <View style={styles.profileInfoContainer}>
              <Text style={[globalStyles.textBase, styles.listInfoTitle]}>
                Email
              </Text>

              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
              >
                <TextInput
                  style={[globalStyles.textBase, styles.listInfoResult]}
                  value={newEmail}
                  onChangeText={(text) => setNewEmail(text)}
                />
              </View>
            </View>

            <View style={styles.profileLineSeparator}></View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setIndex(1)}
              style={styles.profileInfoContainer}
            >
              <Text style={[globalStyles.textBase, styles.listInfoTitle]}>
                Avatar
              </Text>

              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
              >
                {avatarUri ? (
                  <Image
                    source={{
                      uri: `${avatarUri}&nocache=${Date.now()}`,
                    }}
                    style={{ width: 50, height: 50, borderRadius: 50 }}
                  />
                ) : (
                  <Image
                    source={{ uri: userInfo.avatar_binary }}
                    style={{ width: 50, height: 50, borderRadius: 50 }}
                  />
                )}

                <Icon
                  name="chevron-forward-outline"
                  size={15}
                  color="rgba(255, 255, 255, 0.7)"
                />
              </View>
            </TouchableOpacity>

            <View style={styles.profileLineSeparator}></View>
          </View>
        </View>
      </View>

      <View>
        <Text style={styles.posterTitle}>Poster</Text>

        <View style={styles.longLine}></View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setIndex(1)}
          style={styles.posterContainer}
        >
          <Image source={{ uri: poster }} style={styles.posterImage} />
          <Icon
            name="swap-horizontal-outline"
            size={30}
            style={styles.posterImageSwitch}
          />
        </TouchableOpacity>
      </View>

      <View>
        <Text style={styles.favoriteTitle}>Favorite Films Of All Time</Text>

        <View style={styles.longLine}></View>

        <View style={styles.favoritesContainer}>
          <View style={styles.favorites}>
            {filledFavorites.map((favorite, index) => (
              <View key={favorite ? favorite.id_api : `empty-${index}`}>
                {favorite ? (
                  <View>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => handleOpenModalDelete(favorite.id_api)}
                      style={styles.favoriteFilmDelete}
                    >
                      <Icon name="close-outline" size={20} />
                    </TouchableOpacity>
                    <Image
                      style={styles.favoritesImage}
                      source={{ uri: favorite.poster }}
                    />
                  </View>
                ) : (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => onOpen()}
                    style={styles.noFavorite}
                  >
                    <Icon
                      name="add-outline"
                      size={35}
                      style={styles.noFavoriteIcon}
                    />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        </View>
      </View>

      <CustomModal visible={deleteModal} onClose={handleCloseModalDelete}>
        <Text style={styles.modalTitle}>
          Are you sure you want to delete this film?
        </Text>

        <View style={styles.buttonsContainerList}>
          <TouchableOpacity
            style={styles.confirmButtonList}
            onPress={() => handleDeleteFavorite(selectedFavoriteId)}
          >
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButtonList}
            onPress={handleCloseModalDelete}
          >
            <Text style={styles.confirmButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </CustomModal>
    </ScrollView>
  );
}

const styles = {
  profileTitleContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    paddingTop: 10,
    paddingBottom: 5,
  },

  btnSave: {
    fontSize: 14,
    padding: 10,
    backgroundColor: "#9B4D94",
    borderRadius: 10,
  },

  profileTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },

  profileInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },

  profileLineSeparator: {
    width: "100%",
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginVertical: 10,
  },

  posterTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  favoriteTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  longLine: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    marginTop: 5,
  },

  listInfoContainer: {
    padding: 20,
    paddingBottom: 0,
  },

  listInfoResult: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 16,
  },

  posterContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  posterImage: {
    height: 170,
    width: "100%",
    marginTop: 10,
    borderRadius: 10,
    objectFit: "cover",
    opacity: 0.8,
  },

  posterImageSwitch: {
    position: "absolute",
    top: "42%",
    left: "45%",
    width: 40,
    height: 40,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 50,
    textAlign: "center",
    lineHeight: 40,
  },

  favoriteFilmDelete: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    top: 2,
    right: 2,
    width: 25,
    height: 25,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 50,
    zIndex: 1,
  },

  noFavorite: {
    width: 82,
    height: 130,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },

  noFavoriteIcon: {
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    lineHeight: 130,
  },

  favoritesContainer: {
    alignItems: "center",
    paddingHorizontal: 15,
  },

  favorites: {
    flexDirection: "row",
    marginVertical: 10,
    gap: 10,
    justifyContent: "space-between",
  },

  favoritesImage: {
    width: 82,
    height: 130,
    borderRadius: 10,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "white",
  },

  buttonsContainerList: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },

  confirmButton: {
    width: "100%",
    padding: 10,
    backgroundColor: "#E9A6A6",
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },

  confirmButtonText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
  },

  confirmButtonList: {
    width: "48%",
    padding: 10,
    backgroundColor: "#E9A6A6",
    borderRadius: 10,
    alignItems: "center",
  },

  cancelButtonList: {
    width: "48%",
    padding: 10,
    backgroundColor: "#9C4A8B",
    borderRadius: 10,
    alignItems: "center",
  },
};
