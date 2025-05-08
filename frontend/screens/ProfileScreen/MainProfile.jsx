import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { API_URL } from "../../config";
import { globalStyles } from "../../globalStyles";
import ListInfoProfile from "./FirstTab/ListInfoProfile";

export default function MainProfile({
  userInfo,
  openModalize,
  isModalOpen,
  poster,
  newName,
  newUsername,
  filledFavorites,
}) {
  const navigation = useNavigation();
  const [selectedList, setSelectedList] = useState(null);
  const [totalFilms, setTotalFilms] = useState(0);
  const [totalFilmsYear, setTotalFilmsYear] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [totalWatchlist, setTotalWatchlist] = useState(0);
  const [totalFavorites, setTotalFavorites] = useState(0);
  const [totalRates, setTotalRates] = useState(0);
  const [totalFriends, setTotalFriends] = useState(0);

  const lists = [
    { title: "Watchlist", number: totalWatchlist },
    { title: "Watched", number: totalFilms },
    { title: "Watched This Year", number: totalFilmsYear },
    { title: "Likes", number: totalFavorites },
    { title: "Ratings", number: totalRates },
    { title: "Total Reviews", number: totalReviews },
    { title: "Friends", number: totalFriends },
  ];

  const fetchCounts = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");

      const response = await axios.get(`${API_URL}/api/users/userCounts`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setTotalFilms(response.data.counts.totalFilms);
        setTotalFilmsYear(response.data.counts.totalFilmsYear);
        setTotalReviews(response.data.counts.totalReviews);
        setTotalWatchlist(response.data.counts.totalWatchlist);
        setTotalFavorites(response.data.counts.totalFavorites);
        setTotalRates(response.data.counts.totalRates);
        setTotalFriends(response.data.counts.totalFriends);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    if (userInfo) {
      fetchCounts();
    }
  }, [userInfo]);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      scrollEnabled={!isModalOpen}
    >
      {selectedList === null ? (
        <>
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
              {userInfo.avatar_binary ? (
                <Image
                  style={styles.avatar}
                  source={{ uri: userInfo.avatar_binary }}
                />
              ) : userInfo.avatar ? (
                <Image
                  style={styles.avatar}
                  source={{ uri: userInfo.avatar }}
                />
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
                  {totalFilms}
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
                  {totalFilmsYear}
                </Text>
                <Text style={[globalStyles.textBase, styles.statsTotalFilms]}>
                  Films This Year
                </Text>
              </View>
              <View style={styles.statsContainer}>
                <Text
                  style={[globalStyles.textBase, styles.statsTotalReviewNumber]}
                >
                  {totalReviews}
                </Text>
                <Text style={[globalStyles.textBase, styles.statsTotalFilms]}>
                  Reviews
                </Text>
              </View>
            </View>

            <View style={styles.favoritesContainer}>
              <Text style={[globalStyles.textBase, styles.favoritesTitle]}>
                {userInfo.name.split(" ")[0]}'s Top Favorite Films
              </Text>

              <View style={styles.favorites}>
                {filledFavorites.filter((favorite) => favorite !== null)
                  .length > 0 ? (
                  filledFavorites.map(
                    (favorite) =>
                      favorite && (
                        <TouchableOpacity
                          activeOpacity={0.8}
                          key={favorite.id_api}
                          onPress={() =>
                            navigation.navigate("Film", {
                              filmId: favorite.id_api,
                            })
                          }
                        >
                          <Image
                            style={styles.favoritesImage}
                            source={{ uri: favorite.poster }}
                          />
                        </TouchableOpacity>
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

            <View style={{ alignItems: "center" }}>
              {lists.map((list, index) => (
                <>
                  <TouchableOpacity
                    key={index}
                    onPress={() => setSelectedList(list.title)}
                    style={{ width: "100%" }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      <Text
                        style={[globalStyles.textBase, styles.listInfoTitle]}
                      >
                        {list.title}
                      </Text>
                      <Text
                        style={[globalStyles.textBase, styles.listInfoNumber]}
                      >
                        {list.number}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <View
                    style={{
                      width: "100%",
                      height: 1,
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      marginVertical: 10,
                    }}
                  ></View>
                </>
              ))}
            </View>
          </View>
        </>
      ) : selectedList != "Friends" ? (
        <ListInfoProfile
          selectedList={selectedList}
          setSelectedList={setSelectedList}
          userInfo={userInfo}
        />
      ) : null}
    </ScrollView>
  );
}

const styles = {
  backgroundImage: {
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

  listInfoNumber: {
    color: "#9C4A8B",
  },
};
