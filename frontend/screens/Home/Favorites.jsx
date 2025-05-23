import { View, Text, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { globalStyles } from "../../globalStyles";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../config";

export default function Favorites({ userInfo }) {
  const navigation = useNavigation();
  const [favoriteMovies, setFavoriteMovies] = useState([]);

  const getFavoritesMovies = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/movies/favorites/${userInfo.id}`
      );
      setFavoriteMovies(response.data.movies);
    } catch (error) {
      console.error("Error en obtenir les pel·lícules favorites: " + error);
    }
  };

  useEffect(() => {
    if (userInfo && userInfo.id) {
      getFavoritesMovies();
    }
  }, [userInfo]);

  return (
    <View>
      <Text style={[globalStyles.textBase, styles.title]}>Favorites</Text>

      <View>
        {favoriteMovies.length === 0 ? (
          <Text style={styles.noFavoritesText}>
            You don't have any favorite movies yet
          </Text>
        ) : (
          favoriteMovies.slice(0, 5).map((film, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate("Film", { filmId: film.movie_id })
              }
            >
              <View key={index} style={styles.card}>
                <Image style={styles.cardImage} source={{ uri: film.poster }} />
                <View style={styles.cardInfo}>
                  <Text style={[globalStyles.textBase, styles.cardInfoTitle]}>
                    {film.title}
                  </Text>
                  <Text
                    style={[globalStyles.textBase, styles.cardInfoSynopsis]}
                    numberOfLines={2}
                  >
                    {film.synopsis}
                  </Text>
                  <View style={styles.cardInfoRelease}>
                    <Icon
                      name="calendar-outline"
                      color="white"
                      size={20}
                      style={styles.cardInfoReleaseClock}
                    />
                    <Text
                      style={[
                        globalStyles.textBase,
                        styles.cardInfoReleaseText,
                      ]}
                    >
                      {film.release_year.split("-")[0]}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>
    </View>
  );
}

const styles = {
  title: {
    fontSize: 22,
    fontWeight: "bold",
    paddingBottom: 10,
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#2c2942",
    padding: 15,
    paddingLeft: 20,
    borderRadius: 25,
    marginBottom: 10,
  },

  cardImage: {
    height: 140,
    width: 90,
    borderRadius: 10,
  },

  cardInfo: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    marginLeft: 15,
  },

  cardInfoTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },

  cardInfoSynopsis: {
    fontSize: 14,
    fontWeight: "semibold",
    color: "#aba9b3",
  },

  cardInfoRelease: {
    flexDirection: "row",
    alignItems: "center",
  },

  cardInfoReleaseClock: {
    marginRight: 5,
  },

  cardInfoReleaseText: {
    fontSize: 14,
    fontWeight: "semibold",
  },

  noFavoritesText: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
  },
};
