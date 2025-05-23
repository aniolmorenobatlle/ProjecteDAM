import { View, Text, Image, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { globalStyles } from "../../globalStyles";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../config";

export default function FilmHeader({
  movieDetails,
  year,
  handleOpenModalRate,
  handleOpenModalList,
  handleOpenModalWatchlist,
}) {
  const [expanded, setExpanded] = useState(false);
  const [director, setDirector] = useState({});

  const fetchMovieDetailsDirector = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/movies/${movieDetails.id_api}/credits/director`
      );
      setDirector(response.data.crew[0]);
    } catch (error) {
      console.error(
        "Error obtenint els actors/actrius de la pel·lícula: " + error
      );
    }
  };

  useEffect(() => {
    if (movieDetails.id_api) {
      fetchMovieDetailsDirector();
    }
  }, [movieDetails.id_api]);

  return (
    <View style={styles.header}>
      <View style={styles.bodyLeft}>
        <Image style={styles.poster} source={{ uri: movieDetails.poster }} />
        <View style={styles.buttons}>
          <TouchableOpacity activeOpacity={0.8} onPress={handleOpenModalRate}>
            <View style={styles.button}>
              <Icon name="star-outline" size={20} style={styles.buttonImage} />
              <Text style={[globalStyles.textBase, styles.buttonText]}>
                Rate
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.8} onPress={handleOpenModalList}>
            <View style={styles.button}>
              <Icon name="list-outline" size={20} style={styles.buttonImage} />
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
          <Text style={[globalStyles.textBase, styles.title]}>
            {movieDetails.title} <Text style={styles.year}>{year}</Text>
          </Text>
          <Text style={[globalStyles.textBase, styles.director]}>
            Directed by{" "}
            <Text style={{ fontWeight: "bold" }}>{director?.name}</Text>
          </Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text
            style={[globalStyles.textBase, styles.descriptionText]}
            numberOfLines={expanded ? undefined : 5}
            ellipsizeMode="tail"
            onPress={() => setExpanded(!expanded)}
          >
            {movieDetails.synopsis}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = {
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
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

  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },

  year: {
    fontSize: 14,
    fontWeight: "normal",
    color: "#aaa",
  },

  director: {
    fontSize: 12,
    marginTop: 5,
  },

  descriptionText: {
    fontSize: 14,
    color: "#fff",
    textAlign: "justify",
  },
};
