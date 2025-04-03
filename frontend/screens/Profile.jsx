import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Modalize } from "react-native-modalize";
import Icon from "react-native-vector-icons/Ionicons";
import { API_URL } from "../config";
import { globalStyles } from "../globalStyles";
import { useUserInfo } from "../hooks/useUserInfo";
import AvatarTabModalize from "./profile/AvatarTabModalize";
import MainTabModalize from "./profile/MainTabModalize";

const lists = [
  { title: "Watchlist", number: 10 },
  { title: "Watched", number: 30 },
  { title: "Films", number: 330 },
  { title: "Reviews", number: 30 },
  { title: "Likes", number: 302 },
  { title: "Friends", number: 5 },
];

const screenHeight = Dimensions.get("window").height;

export default function Profile({ setIsModalizeOpen }) {
  const { userInfo, loading, error } = useUserInfo();
  const [showLoading, setShowLoading] = useState(true);
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

  useEffect(() => {
    if (userInfo) {
      setNewName(userInfo.name);
      setNewUsername(userInfo.username);
      setPoster(userInfo.poster);
      setShowLoading(false);
    }
  }, [userInfo]);

  const openModalize = () => {
    modalizeRef.current?.open();
    setIsModalOpen(true);
    setIsModalizeOpen(true);
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

  if (loading || showLoading)
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

  if (error)
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#1F1D36",
        }}
      >
        <Text style={{ color: "white" }}>Error: {error}</Text>
      </View>
    );

  return (
    <View style={[globalStyles.container, styles.mainContainer]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        scrollEnabled={!isModalOpen}
      >
        <Image source={{ uri: poster }} style={styles.backgroundImage} />

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={openModalize}
          style={styles.editProfile}
        >
          <Icon name="cog-outline" size={40} />
        </TouchableOpacity>

        <View style={styles.contentContainer}>
          <View style={styles.avatarContainer}>
            {userInfo.avatar ? (
              <Image style={styles.avatar} source={{ uri: userInfo.avatar }} />
            ) : (
              <Icon
                name="person-circle-outline"
                size={100}
                style={styles.menuIconAvatarNone}
              />
            )}
            <Text style={[globalStyles.textBase, styles.name]}>
              {" "}
              {newName ? newName : userInfo.name}
            </Text>
            <Text style={[globalStyles.textBase, styles.username]}>
              @{newUsername ? newUsername : userInfo.username}
            </Text>
          </View>

          <View style={styles.stats}>
            <View style={styles.statsContainer}>
              <Text
                style={[globalStyles.textBase, styles.statsTotalFilmsNumber]}
              >
                445
              </Text>
              <Text style={[globalStyles.textBase, styles.statsTotalFilms]}>
                Total Films
              </Text>
            </View>
            <View style={styles.statsContainer}>
              <Text
                style={[
                  globalStyles.textBase,
                  styles.statsTotalFilmsYearNumber,
                ]}
              >
                33
              </Text>
              <Text style={[globalStyles.textBase, styles.statsTotalFilms]}>
                Films This Year
              </Text>
            </View>
            <View style={styles.statsContainer}>
              <Text
                style={[globalStyles.textBase, styles.statsTotalReviewNumber]}
              >
                30
              </Text>
              <Text style={[globalStyles.textBase, styles.statsTotalFilms]}>
                Review
              </Text>
            </View>
          </View>

          <View style={styles.favoritesContainer}>
            <Text style={[globalStyles.textBase, styles.favoritesTitle]}>
              {userInfo.name.split(" ")[0]}'s Top Favorite Films
            </Text>

            <View style={styles.favorites}>
              {filledFavorites.filter((favorite) => favorite !== null).length >
              0 ? (
                filledFavorites.map(
                  (favorite) =>
                    favorite && (
                      <Image
                        style={styles.favoritesImage}
                        source={{ uri: favorite.poster }}
                        key={favorite.id_api}
                      />
                    )
                )
              ) : (
                <Text style={[globalStyles.textBase, styles.noFavoritesText]}>
                  User didn't put any as favorite
                </Text>
              )}
            </View>
          </View>

          <View style={styles.line}></View>

          <View contentContainerStyle={{ alignItems: "center" }}>
            {lists.map((list, index) => (
              <View key={index} style={{ width: "100%" }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <Text style={[globalStyles.textBase, styles.listInfoTitle]}>
                    {list.title}
                  </Text>
                  <Text style={[globalStyles.textBase, styles.listInfoNumber]}>
                    {list.number}
                  </Text>
                </View>

                <View
                  style={{
                    width: "100%",
                    height: 1,
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    marginVertical: 10,
                  }}
                ></View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <Modalize
        modalStyle={styles.modalize}
        ref={modalizeRef}
        modalHeight={screenHeight * 0.85}
        panGestureEnabled={false}
        onOpened={() => {
          setIsModalizeOpen(true);
          setIsModalOpen(true);
        }}
        onClosed={() => {
          setIsModalizeOpen(false);
          setIsModalOpen(false);
          setIndex(0);
        }}
        // HeaderComponent={
        //   <>
        //     <View style={styles.headerModal}>
        //       <TouchableOpacity
        //         style={styles.btnCloseContainer}
        //         activeOpacity={0.8}
        //         onPress={() => {
        //           modalizeRef.current?.close();
        //         }}
        //       >
        //         <Text style={styles.cancel}>Cancel</Text>
        //       </TouchableOpacity>
        //       <Text style={styles.searchFilm}>Edit your Profile</Text>
        //       <Image
        //         source={{ uri: userInfo.avatar }}
        //         style={styles.searchAvatar}
        //       />
        //     </View>
        //   </>
        // }
        withHandle={false}
      >
        <View>
          <View style={styles.headerModal}>
            <TouchableOpacity
              style={styles.btnCloseContainer}
              activeOpacity={0.8}
              onPress={() => {
                modalizeRef.current?.close();
              }}
            >
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.searchFilm}>Edit your Profile</Text>
            <Image
              source={{ uri: userInfo.avatar }}
              style={styles.searchAvatar}
            />
          </View>
          {index === 0 ? (
            <MainTabModalize
              userInfo={userInfo}
              newName={newName}
              setNewName={setNewName}
              newUsername={newUsername}
              setNewUsername={setNewUsername}
              poster={poster}
              filledFavorites={filledFavorites}
              setFavorites={setFavorites}
              setIndex={setIndex}
            />
          ) : (
            <AvatarTabModalize
              userInfo={userInfo}
              selectedPoster={selectedPoster}
              setSelectedPoster={setSelectedPoster}
              setPoster={setPoster}
              setIndex={setIndex}
            />
          )}
        </View>
      </Modalize>
    </View>
  );
}

const styles = {
  mainContainer: {
    flex: 1,
  },

  backgroundImage: {
    flex: 1,
    justifyContent: "center",
    height: 250,
    width: "100%",
  },

  editProfile: {
    position: "absolute",
    top: 50,
    right: 15,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 50,
  },

  modalize: {
    backgroundColor: "#1F1D36",
  },

  headerModal: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },

  cancel: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 16,
  },

  searchFilm: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  searchAvatar: {
    width: 35,
    height: 35,
    borderRadius: 50,
  },

  contentContainer: {
    paddingHorizontal: 15,
    marginTop: 60,
  },

  avatarContainer: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "white",
    position: "absolute",
    top: -110,
  },

  menuIconAvatarNone: {
    color: "white",
    position: "absolute",
    top: -110,
  },

  name: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#E9A6A6",
  },

  username: {
    fontSize: 12,
  },

  stats: {
    marginVertical: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 30,
  },

  statsContainer: {
    justifyContent: "center",
    alignItems: "center",
  },

  statsTotalFilmsNumber: {
    fontSize: 30,
    color: "#E9A6A6",
    fontWeight: "bold",
  },

  statsTotalFilmsYearNumber: {
    fontSize: 30,
    color: "#9C4A8B",
    fontWeight: "bold",
  },

  statsTotalReviewNumber: {
    fontSize: 30,
    color: "#9C4A8B",
    fontWeight: "bold",
  },

  statsTotalFilms: {
    fontSize: 12,
  },

  favoritesContainer: {
    alignItems: "center",
    paddingHorizontal: 15,
  },

  favoritesTitle: {
    fontSize: 20,
    fontWeight: "bold",
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

  noFavoritesText: {
    color: "gray",
    fontSize: 16,
    marginTop: 20,
  },

  line: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginVertical: 20,
    marginHorizontal: -15,
  },

  shortLine: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginVertical: 10,
  },

  listInfoNumber: {
    color: "#9C4A8B",
  },
};
