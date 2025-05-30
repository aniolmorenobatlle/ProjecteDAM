import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { API_URL } from "../../config";
import { globalStyles } from "../../globalStyles";
import ListInfoProfile from "./FirstTab/ListInfoProfile";
import ReviewsInfoProfile from "./FirstTab/ReviewsInfoProfile";
import FriendsInfoProfile from "./FirstTab/FriendsInfoProfile";
import { useUserInfo } from "../../hooks/useUserInfo";

export default function MainProfile({
  profileInfo,
  openModalize,
  isModalOpen,
  poster,
  newName,
  newUsername,
  newEmail,
  filledFavorites,
  avatarUri,
  editable,
}) {
  editable = editable || false;

  const navigation = useNavigation();

  const { userInfo } = useUserInfo();

  const { id: userId } = userInfo || {};
  const { id: profileId } = profileInfo || {};

  const [imageReady, setImageReady] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [followStatus, setFollowStatus] = useState(null);
  const [selectedList, setSelectedList] = useState(null);
  const [totalFilms, setTotalFilms] = useState(0);
  const [totalFilmsYear, setTotalFilmsYear] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [totalWatchlist, setTotalWatchlist] = useState(0);
  const [totalFavorites, setTotalFavorites] = useState(0);
  const [totalRates, setTotalRates] = useState(0);
  const [totalFriends, setTotalFriends] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);

  const lists = [
    { title: "Watchlist", number: totalWatchlist },
    { title: "Watched", number: totalFilms },
    { title: "Watched This Year", number: totalFilmsYear },
    { title: "Likes", number: totalFavorites },
    { title: "Ratings", number: totalRates },
    { title: "Reviews", number: totalReviews },
    { title: "Friends", number: totalFriends },
  ];

  const fetchCounts = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");

      const response = await axios.get(
        `${API_URL}/api/users/userCounts/${profileInfo.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

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

  const handleFriendshipStatus = async () => {
    try {
      setIsLoadingInitial(true);
      const token = await AsyncStorage.getItem("authToken");

      const response = await axios.get(`${API_URL}/api/users/friends/status`, {
        params: { userId: userInfo.id, friendId: profileInfo.id },
        headers: { Authorization: `Bearer ${token}` },
      });

      setFollowStatus(response.data.is_friend);
    } catch (error) {
      console.error(
        "Error getting friendship status:",
        error?.message || error
      );
      Alert.alert(
        "Error",
        "Error getting friendship status, please try again later"
      );
    } finally {
      setIsLoadingInitial(false);
    }
  };

  const setFriendRequest = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        console.error("No auth token found");
        return false;
      }

      console.log("Sending request with:", {
        // Debug log
        userId: userInfo.id,
        friendId: profileInfo.id,
      });

      const response = await axios.post(
        `${API_URL}/api/users/friends/send-request`,
        {
          userId: userInfo.id,
          friendId: profileInfo.id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Server response:", response.data); // Debug log

      if (response.status === 200) {
        return true;
      }
      return false;
    } catch (error) {
      console.error("Full error object:", error); // Debug log
      console.error("Error response:", error.response?.data); // Debug log
      Alert.alert(
        "Error",
        error.response?.data?.message || "Error sending friend request"
      );
      return false;
    }
  };

  const deleteFriend = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");

      const response = await axios.post(
        `${API_URL}/api/users/friends/delete-friend`,
        {
          userId: userInfo.id,
          friendId: profileInfo.id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return response.status === 200;
    } catch (error) {
      console.error("Error deleting friend:", error?.message || error);
      Alert.alert("Error", "Error deleting friend, please try again later");
      return false;
    }
  };

  const getFollowButtonColor = (status) => {
    if (status === true) {
      return "#8E4A65";
    } else if (status === false) {
      return "#9C4A8B";
    } else {
      return "#E9A6A6";
    }
  };

  const getFollowButtonLabel = (status) => {
    if (status === true) {
      return "Unfollow";
    } else if (status === false) {
      return "Follow requested";
    } else {
      return "Follow";
    }
  };

  const handleFollowStatus = async () => {
    if (isLoadingInitial) return;

    try {
      console.log("Current follow status:", followStatus);

      if (followStatus === null) {
        setIsProcessing(true);
        const result = await setFriendRequest();
        console.log("Friend request result:", result);

        if (result) {
          setFollowStatus(false);
        }
      } else if (followStatus === false || followStatus === true) {
        setIsProcessing(true);
        const result = await deleteFriend();
        console.log("Delete friend result:", result);

        if (result) {
          setFollowStatus(null);
        }
      }
    } catch (error) {
      console.error("Error handling follow status:", error);
      Alert.alert(
        "Error",
        "Something went wrong while updating follow status. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (profileInfo && profileInfo.id) {
      fetchCounts();
    }
  }, [profileInfo]);

  useEffect(() => {
    if (userId && profileId && !editable && userId !== profileId) {
      handleFriendshipStatus();
    }
  }, [userId, profileId, editable]);

  useEffect(() => {
    const checkImage = async () => {
      const uri = profileInfo?.avatar
        ? `${profileInfo.avatar}&nocache=${Date.now()}`
        : `${API_URL}/api/users/${profileInfo?.id}/avatar?nocache=${Date.now()}`;

      try {
        const response = await axios.head(uri);
        if (response.status === 200) {
          setImageUri(uri);
          setImageReady(true);
        }
      } catch (err) {
        console.log("La imatge encara no està disponible:", err.message);
        setTimeout(checkImage, 500);
      }
    };

    if (profileInfo?.id) {
      checkImage();
    }
  }, [profileInfo]);

  return (
    <>
      {selectedList === null ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          scrollEnabled={!isModalOpen}
        >
          <Image source={{ uri: poster }} style={styles.backgroundImage} />

          {editable ? (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={openModalize}
              style={styles.editProfile}
            >
              <Icon name="cog-outline" size={40} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.goBack()}
              style={styles.goBack}
            >
              <Icon name="arrow-back-outline" size={30} />
            </TouchableOpacity>
          )}

          <View style={styles.contentContainer}>
            <View style={styles.avatarContainer}>
              {imageReady ? (
                <Image style={styles.avatar} source={{ uri: imageUri }} />
              ) : (
                <Image
                  style={styles.avatar}
                  source={{
                    uri: avatarUri
                      ? `${avatarUri}?nocache=${Date.now()}`
                      : `${API_URL}/api/users/${profileInfo?.id}/avatar?nocache=${Date.now()}`,
                  }}
                />
              )}

              <Text style={[globalStyles.textBase, styles.name]}>
                {newName ? newName : profileInfo?.name}
              </Text>
              <Text style={[globalStyles.textBase, styles.username]}>
                @{newUsername ? newUsername : profileInfo?.username}
              </Text>
            </View>

            {!editable && (
              <View style={styles.followContainer}>
                <TouchableOpacity
                  style={[
                    styles.follow,
                    { backgroundColor: getFollowButtonColor(followStatus) },
                    (isProcessing || isLoadingInitial) && { opacity: 0.7 },
                  ]}
                  activeOpacity={0.8}
                  disabled={isProcessing || isLoadingInitial}
                  onPress={handleFollowStatus}
                >
                  <Text style={globalStyles.textBase}>
                    {isLoadingInitial
                      ? "Loading..."
                      : isProcessing
                        ? "Processing..."
                        : getFollowButtonLabel(followStatus)}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

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
                {profileInfo?.name.split(" ")[0]}'s Top Favorite Films
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
                    User don't have any favorites yet
                  </Text>
                )}
              </View>
            </View>

            <View style={styles.line}></View>

            <View style={{ alignItems: "center" }}>
              {lists.map((list, index) => (
                <View key={index} style={{ width: "100%" }}>
                  <TouchableOpacity
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
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      ) : selectedList != "Friends" && selectedList != "Reviews" ? (
        <ListInfoProfile
          selectedList={selectedList}
          setSelectedList={setSelectedList}
          profileInfo={profileInfo}
        />
      ) : selectedList === "Reviews" ? (
        <ReviewsInfoProfile
          selectedList={selectedList}
          setSelectedList={setSelectedList}
          profileInfo={profileInfo}
        />
      ) : (
        selectedList === "Friends" && (
          <FriendsInfoProfile
            selectedList={selectedList}
            setSelectedList={setSelectedList}
            profileInfo={profileInfo}
            editable={editable}
          />
        )
      )}
    </>
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

  goBack: {
    position: "absolute",
    top: 50,
    left: 15,
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

  followContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },

  follow: {
    width: "80%",
    height: 30,
    backgroundColor: "#E9A6A6",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
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
