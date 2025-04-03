import React from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { globalStyles } from "../../../globalStyles";

export default function EditProfile({
  userInfo,
  newName,
  setNewName,
  newUsername,
  setNewUsername,
  poster,
  filledFavorites,
  setIndex,
  handleSaveChangesProfile,
  onOpen,
  handleDeleteFavorite,
}) {
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
            {/* Full Name */}
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

            {/* Username */}
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

            {/* Email */}
            <View style={styles.profileInfoContainer}>
              <Text style={[globalStyles.textBase, styles.listInfoTitle]}>
                Email
              </Text>

              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
              >
                <Text style={[globalStyles.textBase, styles.listInfoResult]}>
                  {userInfo.email}
                </Text>
              </View>
            </View>

            <View style={styles.profileLineSeparator}></View>

            {/* Avatar */}
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
                <Image
                  source={{ uri: userInfo.avatar }}
                  style={{ width: 50, height: 50, borderRadius: 50 }}
                />
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
                      onPress={() => handleDeleteFavorite(favorite.id_api)}
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
  },

  posterImage: {
    height: 170,
    width: "100%",
    paddingHorizontal: 20,
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
};
