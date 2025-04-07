import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Modalize } from "react-native-modalize";
import Icon from "react-native-vector-icons/Ionicons";
import { API_URL } from "../../../config";
import { globalStyles } from "../../../globalStyles";

export default function SearchModalize({
  userInfo,
  modalizeRef,
  fetchFavorites,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchMovies = async () => {
    if (!searchQuery) return;

    setLoading(true);

    try {
      const response = await axios.get(
        `${API_URL}/api/movies/search?query=${searchQuery}`
      );

      const updatedMovies = response.data.movies.map((movie) => {
        const releaseYear = movie.release_year.split("-")[0];
        return {
          ...movie,
          release_year: releaseYear,
        };
      });

      setMovies(updatedMovies);
    } catch (error) {
      console.error("Error searching movies: " + error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFavorite = async (movieId) => {
    try {
      const token = await AsyncStorage.getItem("authToken");

      await axios.post(
        `${API_URL}/api/users/addFavorite`,
        { movieId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchFavorites();

      modalizeRef.current?.close();

      setSearchQuery("");
      setMovies([]);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          Alert.alert("Info", "Movie already in favorites");
        } else {
          Alert.alert("Error", "Error adding movie to favorites");
        }
      }
    }
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    searchMovies();
  };

  return (
    <Modalize
      ref={modalizeRef}
      panGestureEnabled={false}
      withHandle={false}
      modalStyle={styles.modalize}
    >
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={styles.headerModal}>
          <TouchableOpacity
            style={styles.btnCloseContainer}
            activeOpacity={0.8}
            onPress={() => modalizeRef.current?.close()}
          >
            <Text style={styles.cancel}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.searchFilm}>Search a Film</Text>
          <Image
            source={{ uri: userInfo.avatar }}
            style={styles.searchAvatar}
          />
        </View>

        <View style={styles.shortLine} />

        <View style={styles.searchContainer}>
          <View style={styles.inputContainer}>
            <Icon
              name="search-outline"
              size={20}
              color="rgba(255, 255, 255, 0.7)"
              style={styles.inputSearchIcon}
            />
            <TextInput
              style={[globalStyles.textBase, styles.input]}
              placeholder="Search a film"
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus={true}
              value={searchQuery}
              onChangeText={handleSearch}
            />
            <Icon
              name="close-circle-outline"
              size={20}
              color="rgba(255, 255, 255, 0.7)"
              style={styles.inputDeleteIcon}
              onPress={() => {
                setSearchQuery("");
                setMovies([]);
              }}
            />
          </View>
          <View style={styles.separator} />
        </View>

        {loading ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator size="large" color="white" />
          </View>
        ) : (
          movies.slice(0, 10).map((item, index) => (
            <View key={index} style={styles.listItem}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleAddFavorite.bind(this, item.id_api)}
                style={styles.listSearchContainer}
              >
                <Image
                  source={{ uri: item.poster }}
                  style={styles.listPoster}
                />
                <View style={styles.listSearcTextsContainer}>
                  <Text style={styles.listSearchListTitle}>{item.title} </Text>
                  <Text style={styles.listSearchListYear}>
                    {item.release_year}, directed by{" "}
                  </Text>
                  <Text style={styles.listSearchListDirector}>
                    {item.director_name}
                  </Text>
                </View>
              </TouchableOpacity>
              <View style={styles.separator} />
            </View>
          ))
        )}
      </ScrollView>
    </Modalize>
  );
}

const styles = {
  modalize: {
    backgroundColor: "#2A2745",
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

  searchContainer: {
    padding: 10,
    paddingBottom: 0,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 10,
    height: 40,
  },

  input: {
    flex: 1,
    color: "white",
    paddingHorizontal: 10,
  },

  inputSearchIcon: {
    marginLeft: 10,
  },

  inputDeleteIcon: {
    marginRight: 10,
  },

  separator: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginTop: 10,
  },

  listSearchContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    paddingBottom: 0,
  },

  listPoster: {
    width: 60,
    height: 90,
    borderRadius: 10,
  },

  listSearcTextsContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "baseline",
    paddingLeft: 10,
  },

  listSearchListTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  listSearchListYear: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
  },

  listSearchListDirector: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
    fontWeight: "bold",
  },
};
