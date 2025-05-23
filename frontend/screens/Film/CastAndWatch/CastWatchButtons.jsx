import { View, TouchableOpacity, Text, ScrollView } from "react-native";
import Cast from "./Cast";
import WhereToWatch from "./WhereToWatch";
import { globalStyles } from "../../../globalStyles";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../../config";

export default function CastWatchButtons({ filmId }) {
  const [activeButton, setActiveButton] = useState("cast");
  const [cast, setCast] = useState([]);
  const [streaming, setStreaming] = useState([]);

  const handleButtonPress = (buttonName) => {
    setActiveButton(buttonName);
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

  useEffect(() => {
    fetchMovieDetailsCast();
    fetchMovieStreaming();
  }, []);

  return (
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
        {activeButton === "cast" ? (
          <Cast cast={cast} />
        ) : (
          <WhereToWatch streaming={streaming} />
        )}
      </ScrollView>
    </View>
  );
}

const styles = {
  castContainer: {
    marginTop: 20,
  },

  buttonOptions: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },

  buttonCast: {
    width: 70,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#323048",
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
  },

  buttonCastActive: {
    backgroundColor: "#9C4A8B",
  },

  buttonCastText: {
    fontSize: 14,
  },
};
