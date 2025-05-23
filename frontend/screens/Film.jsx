import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  ScrollView,
  Text,
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
import FilmHeader from "./Film/FilmHeader";
import Reviews from "./Film/Reviews";
import CastWatchButtons from "./Film/CastAndWatch/CastWatchButtons";

export default function Film() {
  const route = useRoute();
  const { filmId } = route.params;
  const { userInfo, loading, error } = useUserInfo();

  const [dropdownList, setDropdownList] = useState([]);
  const [selectedListId, setSelectedListId] = useState(null);

  const navigation = useNavigation();
  const [movieDetails, setMovieDetails] = useState({});
  const [year, setYear] = useState("");
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
      // Fetch normal lists
      const normalListsResponse = await axios.get(
        `${API_URL}/api/lists?user_id=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Fetch shared lists
      const sharedListsResponse = await axios.get(
        `${API_URL}/api/lists/shared/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Format normal lists
      const normalLists =
        normalListsResponse.data?.lists?.map((list) => ({
          label: list.name,
          value: list.id,
          type: "normal",
        })) || [];

      // Format shared lists
      const sharedLists =
        sharedListsResponse.data?.sharedLists?.map((list) => ({
          label: `${list.list_name} (${list.user_username})`,
          value: list.list_id,
          type: "shared",
          owner: list.user_username,
        })) || [];

      // Combinar les dos llistes
      const allLists = [...normalLists, ...sharedLists].sort((a, b) =>
        a.label.localeCompare(b.label)
      );

      setDropdownList(allLists);
    } catch (error) {
      console.error("Error fetching the lists:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
      Alert.alert(
        "Error",
        "There was an error fetching your lists. Please try again."
      );
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

  const handleOpenModalWatchlist = () => {
    setModalWatchlist(true);
  };

  const handleIsWatched = () => {
    const newStatus = { watched: !isWatched };
    setIsWatched(!isWatched);
    updateMovieStatus(newStatus);
  };

  const handleIsLikes = () => {
    const newStatus = { likes: !isLikes };
    setIsLikes(!isLikes);
    updateMovieStatus(newStatus);
  };

  const handleIsInWatchlist = () => {
    const newStatus = { watchlist: !isInWatchlist };
    setIsInWatchlist(!isInWatchlist);
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

  const updateMovieStatus = async (newStatus) => {
    try {
      const statusToSend = {
        watched:
          newStatus.watched !== undefined ? newStatus.watched : isWatched,
        likes: newStatus.likes !== undefined ? newStatus.likes : isLikes,
        watchlist:
          newStatus.watchlist !== undefined
            ? newStatus.watchlist
            : isInWatchlist,
      };

      await axios.put(`${API_URL}/api/movies/${filmId}/status`, {
        user_id: userInfo.id,
        ...statusToSend,
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

  const handleOpenModalList = () => {
    setModalList(true);
  };

  const handleCloseModalList = () => {
    setModalList(false);
  };

  const handleAddToList = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");

      // Comprovar si ja existeix
      const checkResponse = await axios.get(
        `${API_URL}/api/lists/${selectedListId}/movies/${filmId}/check`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (checkResponse.data.exists) {
        Alert.alert("Warning", "This movie is already in the selected list!");
        return;
      }

      // Si no, l'afegim
      await axios.post(`${API_URL}/api/lists/addFilmToList`, {
        list_id: selectedListId,
        movie_id: filmId,
      });

      setModalList(false);
    } catch (error) {
      console.error("Error checking/adding movie to list:", error);
      Alert.alert(
        "Error",
        "There was an error adding the movie to the list. Please try again."
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

  useEffect(() => {
    if (userInfo && userInfo.id) {
      fetchMovieStatus();
      fetchLists();
    }

    fetchMovieDetails();
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
    <KeyboardAvoidingView style={{ flex: 1 }}>
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
                <Icon
                  name="arrow-back-outline"
                  size={24}
                  style={styles.backArrow}
                />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </ImageBackground>

        <SafeAreaView style={[globalStyles.container, styles.mainContainer]}>
          <FilmHeader
            movieDetails={movieDetails}
            year={year}
            handleOpenModalRate={handleOpenModalRate}
            handleOpenModalList={handleOpenModalList}
            handleOpenModalWatchlist={handleOpenModalWatchlist}
          />

          <CastWatchButtons filmId={filmId} />

          <Reviews filmId={filmId} />
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

          <TouchableOpacity activeOpacity={0.8} onPress={handleIsLikes}>
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
        <Text style={styles.modalTitle}>Add to a list</Text>

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
  },

  mainContainer: {
    paddingHorizontal: 15,
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
