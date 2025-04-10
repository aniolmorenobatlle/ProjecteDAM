import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import CustomModal from "../components/CustomModal";
import { API_URL } from "../config";
import { globalStyles } from "../globalStyles";
import { useUserInfo } from "../hooks/useUserInfo";

export default function Film() {
  const route = useRoute();
  const { filmId } = route.params;
  const { userInfo, loading, error } = useUserInfo();

  const [dropdownList, setDropdownList] = useState([]);
  const [selectedListId, setSelectedListId] = useState(null);

  const navigation = useNavigation();
  const [activeButton, setActiveButton] = useState("cast");
  const [movieDetails, setMovieDetails] = useState({});
  const [year, setYear] = useState("");
  const [cast, setCast] = useState([]);
  const [director, setDirector] = useState({});
  const [expanded, setExpanded] = useState(false);
  const [streaming, setStreaming] = useState([]);
  const [review, setReview] = useState("");
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [modalWatchlist, setModalWatchlist] = useState(false);
  const [isWatched, setIsWatched] = useState(false);
  const [isLikes, setIsLikes] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [modalRate, setModalRate] = useState(false);
  const [rating, setRating] = useState(0);
  const [lastRatingClick, setLastRatingClick] = useState(0);
  const [modalList, setModalList] = useState(false);

  const fetchLists = async () => {
    const token = await AsyncStorage.getItem("authToken");
    const userId = userInfo.id;

    try {
      const response = await axios.get(
        `${API_URL}/api/lists?user_id=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const formattedData = response.data.lists.map((list) => ({
        label: list.name,
        value: list.id,
      }));

      setDropdownList(formattedData);
    } catch (error) {
      console.error("Error fetching the lists", error);
    }
  };

  const fetchMovieStatus = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/movies/${filmId}/status`,
        {
          params: { user_id: userInfo.id },
        }
      );

      if (response.data) {
        const {
          watched = false,
          likes = false,
          watchlist = false,
          rating = 0,
        } = response.data;
        setIsWatched(watched);
        setIsLikes(likes);
        setIsInWatchlist(watchlist);
        setRating(rating);
      } else {
        setIsWatched(false);
        setIsLikes(false);
        setIsInWatchlist(false);
        setRating(0);
      }
    } catch (error) {
      console.error("Error obtenint l'estat de la pel·lícula: " + error);
      setIsWatched(false);
      setIsLikes(false);
      setIsInWatchlist(false);
      setRating(0);
    }
  };

  const updateMovieStatus = async (newStatus) => {
    try {
      await axios.put(`${API_URL}/api/movies/${filmId}/status`, {
        user_id: userInfo.id,
        likes: newStatus.likes,
        watched: newStatus.watched,
        watchlist: newStatus.watchlist,
      });
    } catch (error) {
      Alert.alert(
        "Error",
        "There was an error updating the movie status. Please try again."
      );
      console.error(
        "Error actualitzant l'estat de la pel·lícula:",
        error.response?.data || error
      );
    }
  };

  const handleOpenModalWatchlist = () => {
    setModalWatchlist(true);
  };

  const handleIsWatched = () => {
    const newStatus = {
      watched: !isWatched,
      likes: isLikes,
      watchlist: !isInWatchlist,
    };
    setIsWatched(!isWatched);
    setIsInWatchlist(false);
    updateMovieStatus(newStatus);
  };

  const handleisLikes = () => {
    const newStatus = {
      watched: isWatched,
      likes: !isLikes,
      watchlist: isInWatchlist,
    };
    setIsLikes(!isLikes);
    updateMovieStatus(newStatus);
  };

  const handleIsInWatchlist = () => {
    const newStatus = {
      watched: !isWatched,
      likes: isLikes,
      watchlist: !isInWatchlist,
    };
    setIsInWatchlist(!isInWatchlist);
    setIsWatched(false);
    updateMovieStatus(newStatus);
  };

  const handleCloseModalWatchlist = () => {
    setModalWatchlist(false);
  };

  const handleOpenModalRate = () => {
    setModalRate(true);
  };

  const handleCloseModalRate = async () => {
    await updateMovieRate();
    setModalRate(false);
  };

  const updateMovieRate = async () => {
    try {
      await axios.put(`${API_URL}/api/movies/${filmId}/status/rate`, {
        user_id: userInfo.id,
        rate: rating,
      });
    } catch (error) {
      Alert.alert(
        "Error",
        "There was an error submitting your rating. Please try again."
      );
      console.error(
        "Error actualitzant la valoració de la pel·lícula: " + error
      );
    }
  };

  const handleAddRating = (rating) => {
    const currentTime = new Date().getTime();
    // Si fa doble click restablir el rating
    if (currentTime - lastRatingClick < 300) {
      setRating(0);
    } else {
      setRating(rating);
    }
    setLastRatingClick(currentTime);
  };

  const renderStars = () => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          activeOpacity={0.8}
          key={i}
          onPress={() => handleAddRating(i)}
        >
          <Icon
            name={i <= rating ? "star" : "star-outline"}
            color={i <= rating ? "gold" : "white"}
            size={50}
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  const handleOpenModalList = () => {
    setModalList(true);
  };

  const handleCloseModalList = () => {
    setModalList(false);
  };

  const handleAddToList = async () => {
    try {
      await axios.post(`${API_URL}/api/lists/addFilmToList`, {
        list_id: selectedListId,
        movie_id: filmId,
      });

      setModalList(false);
    } catch (error) {
      Alert.alert(
        "Error",
        "There was an error adding the movie to the list. Please try again."
      );
      console.error("Error afegint la pel·lícula a la llista: " + error);
    }
  };

  const handleButtonPress = (buttonName) => {
    setActiveButton(buttonName);
  };

  const handleAddComment = async () => {
    if (!review.trim()) {
      Alert.alert("Error", "The comment cannot be empty");
      return;
    }

    try {
      await axios.post(`${API_URL}/api/movies/${filmId}/comments`, {
        user_id: userInfo.id,
        content: review,
      });

      setReview("");
      fetchMovieComments();
    } catch (error) {
      Alert.alert(
        "Error",
        "There was an error submitting your comment. Please try again."
      );
    }
  };

  const fetchMovieDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/movies/${filmId}`);
      setMovieDetails(response.data);

      const date = response.data.release_year;
      const year = date.split("-")[0];
      setYear(year);
    } catch (error) {
      console.error("Error obtenint les dades de la pel·lícula: " + error);
    }
  };

  const fetchMovieDetailsCast = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/movies/${filmId}/credits/cast`
      );
      setCast(response.data.cast);
    } catch (error) {
      console.error(
        "Error obtenint els actors/actrius de la pel·lícula: " + error
      );
    }
  };

  const fetchMovieDetailsDirector = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/movies/${filmId}/credits/director`
      );
      setDirector(response.data.crew[0]);
    } catch (error) {
      console.error(
        "Error obtenint els actors/actrius de la pel·lícula: " + error
      );
    }
  };

  const fetchMovieStreaming = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/movies/${filmId}/streaming`
      );
      setStreaming(response.data);
    } catch (error) {
      console.error(
        "Error obtenint les plataformes d'streaming de la pel·lícula: " + error
      );
    }
  };

  const fetchMovieComments = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/movies/${filmId}/comments`
      );
      setReviews(response.data);
    } catch (error) {}
  };

  useEffect(() => {
    if (userInfo && userInfo.id) {
      fetchMovieStatus();
      fetchLists();
    }

    fetchMovieDetails();
    fetchMovieDetailsCast();
    fetchMovieDetailsDirector();
    fetchMovieStreaming();
    fetchMovieComments();
  }, [filmId, userInfo]);

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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        vertical={true}
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: "#1F1D36" }}
        contentContainerStyle={{ paddingBottom: 10, flexGrow: 1 }}
      >
        <ImageBackground
          source={{ uri: movieDetails.cover }}
          style={styles.imageBackground}
        >
          <SafeAreaView style={styles.overlay}>
            <View style={styles.backButton}>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.backArrow}>←</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </ImageBackground>

        <SafeAreaView style={[globalStyles.container, styles.mainContainer]}>
          <View style={[styles.filmHeader, expanded && { height: "auto" }]}>
            <View style={styles.bodyLeft}>
              <Image
                style={styles.poster}
                source={{ uri: movieDetails.poster }}
              />
              <View style={styles.buttons}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleOpenModalRate}
                >
                  <View style={styles.button}>
                    <Icon
                      name="star-outline"
                      size={20}
                      style={styles.buttonImage}
                    />
                    <Text style={[globalStyles.textBase, styles.buttonText]}>
                      Rate
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleOpenModalList}
                >
                  <View style={styles.button}>
                    <Icon
                      name="list-outline"
                      size={20}
                      style={styles.buttonImage}
                    />
                    <Text style={[globalStyles.textBase, styles.buttonText]}>
                      Add to List
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleOpenModalWatchlist}
                >
                  <View style={styles.button}>
                    <Icon
                      name="duplicate-outline"
                      size={20}
                      style={styles.buttonImage}
                    />
                    <Text style={[globalStyles.textBase, styles.buttonText]}>
                      More options
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.bodyRight}>
              <View style={styles.textContainer}>
                <Text style={[globalStyles.textBase, styles.filmTitle]}>
                  {movieDetails.title}{" "}
                  <Text style={styles.filmYear}>{year}</Text>
                </Text>
                <Text style={[globalStyles.textBase, styles.filmDirector]}>
                  Directed by{" "}
                  <Text style={{ fontWeight: "bold" }}>{director?.name}</Text>
                </Text>
              </View>
              <View style={styles.description}>
                <Text
                  style={[globalStyles.textBase, styles.descriptionText]}
                  numberOfLines={expanded ? 0 : 20}
                >
                  {movieDetails.synopsis}
                </Text>
                <Text
                  style={[
                    globalStyles.textBase,
                    styles.descriptionText,
                    { color: "#E9A6A6" },
                  ]}
                  onPress={() => setExpanded(!expanded)}
                >
                  {expanded ? "See less" : "See more"}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.castContainer}>
            <View style={styles.buttonOptions}>
              <TouchableOpacity
                activeOpacity={1}
                style={[
                  styles.buttonCast,
                  activeButton === "cast" && styles.buttonCastActive,
                ]}
                onPress={() => handleButtonPress("cast")}
              >
                <Text style={[globalStyles.textBase, styles.buttonCastText]}>
                  Cast
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={1}
                style={[
                  styles.buttonCast,
                  activeButton === "watch" && styles.buttonCastActive,
                ]}
                onPress={() => handleButtonPress("watch")}
              >
                <Text style={[globalStyles.textBase, styles.buttonCastText]}>
                  Watch
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              {activeButton === "cast" && (
                <View style={styles.cast}>
                  {cast.length > 0 ? (
                    cast.map((cast, index) => {
                      const nameParts = cast.name.split(" ");
                      const firstName = nameParts[0];
                      const lastName =
                        nameParts.length > 1
                          ? nameParts.slice(1).join(" ")
                          : "";

                      return (
                        <View
                          key={index}
                          style={{
                            flexDirection: "column",
                            alignItems: "center",
                          }}
                        >
                          <Image
                            style={styles.castImage}
                            source={{
                              uri: cast.profile_path,
                            }}
                          />
                          <View style={styles.castNameContainer}>
                            <Text
                              style={[globalStyles.textBase, styles.castName]}
                            >
                              {firstName}
                            </Text>
                            {lastName && (
                              <Text
                                style={[globalStyles.textBase, styles.castName]}
                              >
                                {lastName}
                              </Text>
                            )}
                          </View>
                        </View>
                      );
                    })
                  ) : (
                    <Text style={{ fontSize: 16, color: "gray" }}>
                      The cast is not available
                    </Text>
                  )}
                </View>
              )}

              {activeButton === "watch" && (
                <View style={{ flexDirection: "row", gap: 10 }}>
                  {streaming.length > 0 ? (
                    streaming.map((streaming, index) => (
                      <Image
                        key={index}
                        style={styles.streamingImage}
                        source={{ uri: streaming.logo }}
                      />
                    ))
                  ) : (
                    <Text
                      style={{
                        fontSize: 16,
                        color: "rgba(255, 255, 255, 0.5)",
                      }}
                    >
                      There's no streaming site yet!
                    </Text>
                  )}
                </View>
              )}
            </ScrollView>
          </View>

          <View style={styles.reviews}>
            <View style={styles.reviewTitles}>
              <Text style={[globalStyles.textBase]}>All reviews</Text>
              <Text
                style={[globalStyles.textBase, styles.seeAll]}
                onPress={() => setShowAllReviews(!showAllReviews)}
              >
                {showAllReviews ? "See less" : "See all"}
              </Text>
            </View>

            {(showAllReviews ? reviews : reviews.slice(0, 5)).map(
              (review, index) => (
                <View key={index} style={styles.reviewContainer}>
                  <View style={styles.reviewHeader}>
                    {review.image ? (
                      <Image
                        style={styles.reviewImageUser}
                        source={{ uri: review.image }}
                      />
                    ) : (
                      <Icon
                        name="person-circle-outline"
                        size={50}
                        style={styles.reviewImageUserNull}
                      />
                    )}

                    <Text style={[globalStyles.textBase, styles.reviewText]}>
                      Review by{" "}
                      <Text
                        style={[globalStyles.textBase, styles.reviewTextUser]}
                      >
                        {review.username}
                      </Text>
                    </Text>
                  </View>
                  <Text style={[globalStyles.textBase, styles.reviewResult]}>
                    {review.comment}
                  </Text>
                </View>
              )
            )}

            <View style={styles.addReview}>
              <TextInput
                style={[globalStyles.textBase, styles.textWriteReview]}
                placeholder="Write your review here"
                placeholderTextColor="#E9A6A6"
                multiline={true}
                maxLength={400}
                value={review}
                onChangeText={setReview}
              />
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.buttonAddReview}
                onPress={handleAddComment}
              >
                <Text style={[globalStyles.textBase, styles.buttonText]}>
                  Submit Review
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>

      <CustomModal visible={modalWatchlist} onClose={handleCloseModalWatchlist}>
        <Text style={styles.modalTitle}>Choose an Option</Text>
        <View style={styles.columnContainer}>
          <TouchableOpacity activeOpacity={0.8} onPress={handleIsWatched}>
            <View style={styles.optionContainer}>
              <Icon
                name={isWatched ? "eye" : "eye-outline"}
                size={60}
                color={isWatched ? "#a9c9ff" : "#D3D3D3"}
              />
              <Text style={styles.optionText}>
                {isWatched ? "Watched" : "Watch"}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.8} onPress={handleisLikes}>
            <View style={styles.optionContainer}>
              <Icon
                name={isLikes ? "heart" : "heart-outline"}
                size={60}
                color={isLikes ? "red" : "#D3D3D3"}
              />
              <Text style={styles.optionText}>
                {isLikes ? "Liked" : "Like"}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.8} onPress={handleIsInWatchlist}>
            <View style={styles.optionContainer}>
              <Icon
                name={isInWatchlist ? "time" : "time-outline"}
                size={60}
                color={isInWatchlist ? "#ff007f" : "#D3D3D3"}
              />
              <Text style={styles.optionText}>Watchlist</Text>
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleCloseModalWatchlist}
        >
          <Text style={styles.confirmButtonText}>Done</Text>
        </TouchableOpacity>
      </CustomModal>

      <CustomModal visible={modalList} onClose={handleCloseModalList}>
        <Text style={styles.modalTitle}>Delete a list</Text>

        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={dropdownList}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Select item"
          value={selectedListId}
          onChange={(item) => setSelectedListId(item.value)}
        />

        <View style={styles.buttonsContainerList}>
          <TouchableOpacity
            style={styles.confirmButtonList}
            onPress={handleAddToList}
          >
            <Text style={styles.confirmButtonText}>Done</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButtonList}
            onPress={handleCloseModalList}
          >
            <Text style={styles.confirmButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </CustomModal>

      <CustomModal visible={modalRate} onClose={handleCloseModalRate}>
        <Text style={styles.modalTitle}>Rate this movie</Text>
        <View style={styles.columnContainerRate}>{renderStars()}</View>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleCloseModalRate}
        >
          <Text style={styles.confirmButtonText}>Done</Text>
        </TouchableOpacity>
      </CustomModal>
    </KeyboardAvoidingView>
  );
}

const styles = {
  imageBackground: {
    height: 300,
    width: "100%",
    justifyContent: "flex-start",
  },

  overlay: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 15,
  },

  backButton: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -130,
  },

  backArrow: {
    color: "#fff",
    fontSize: 24,
  },

  mainContainer: {
    paddingHorizontal: 15,
  },

  filmHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    height: 270,
    transition: "height 0.3s",
  },

  bodyLeft: {
    flexDirection: "column",
    marginTop: -100,
    gap: 20,
  },

  bodyRight: {
    flex: 1,
    flexDirection: "column",
    marginTop: -30,
    gap: 15,
  },

  poster: {
    width: 150,
    height: 200,
    borderRadius: 10,
  },

  filmTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },

  filmYear: {
    fontSize: 14,
    fontWeight: "normal",
    color: "#aaa",
  },

  filmDirector: {
    fontSize: 12,
    marginTop: 5,
  },

  body: {
    flex: 1,
    flexDirection: "row",
  },

  buttons: {
    flex: 1,
    flexDirection: "column",
  },

  button: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#E9A6A6",
    width: 150,
    height: 40,
    borderRadius: 10,
  },

  buttonImage: {
    marginLeft: 10,
  },

  buttonText: {
    marginLeft: 8,
    color: "#000",
    fontSize: 12,
  },

  description: {
    flex: 1,
  },

  descriptionText: {
    fontSize: 14,
    color: "#fff",
    textAlign: "justify",
  },

  castContainer: {
    marginTop: 20,
  },

  castNameContainer: {
    marginTop: 5,
    alignItems: "center",
  },

  castName: {
    fontSize: 10,
  },

  streamingImage: {
    width: 60,
    height: 60,
    objectFit: "contain",
    borderRadius: 50,
  },

  buttonOptions: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },

  buttonCastActive: {
    width: 70,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#9C4A8B",
    padding: 8,
    borderRadius: 20,
  },

  buttonCast: {
    width: 70,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#323048",
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#fff",
    borderColor: "rgba(255, 255, 255, 0.5)",
  },

  buttonCastText: {
    fontSize: 14,
  },

  cast: {
    flexDirection: "row",
    gap: 15,
  },

  castImage: {
    width: 60,
    height: 60,
    borderRadius: 50,
  },

  reviewTitles: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  seeAll: {
    fontSize: 14,
    color: "#E9A6A6",
  },

  reviewContainer: {
    marginTop: 10,
    backgroundColor: "#323048",
    borderRadius: 10,
    padding: 10,
  },

  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  reviewImageUser: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },

  reviewImageUserNull: {
    color: "white",
    width: 50,
    height: 50,
    borderRadius: 50,
  },

  reviewText: {
    color: "rgba(255, 255, 255, 0.5)",
    marginLeft: 10,
    fontSize: 12,
  },

  reviewTextUser: {
    color: "#E9A6A6",
    opacity: 1,
    fontSize: 12,
  },

  reviewResult: {
    color: "#fff",
    marginLeft: 60,
    fontSize: 14,
    marginTop: -8,
  },

  textWriteReview: {
    marginTop: 10,
    backgroundColor: "#323048",
    borderRadius: 10,
    padding: 10,
    paddingVertical: 20,
    color: "white",
    fontSize: 14,
  },

  buttonAddReview: {
    backgroundColor: "#E9A6A6",
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    alignSelf: "flex-start",
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "white",
  },

  columnContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 40,
    marginTop: 20,
  },

  columnContainerRate: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginVertical: 20,
  },

  optionContainer: {
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },

  optionText: {
    fontSize: 12,
    paddingVertical: 10,
    color: "#D3D3D3",
    fontWeight: "bold",
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

  dropdown: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "white",
    padding: 10,
  },

  icon: {
    marginRight: 5,
  },

  placeholderStyle: {
    color: "white",
    fontSize: 16,
  },

  selectedTextStyle: {
    color: "white",
    fontSize: 16,
  },

  iconStyle: {
    width: 25,
    height: 25,
  },

  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },

  buttonsContainerList: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
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
