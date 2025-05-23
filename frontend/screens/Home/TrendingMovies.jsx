import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { globalStyles } from "../../globalStyles";
import axios from "axios";
import { API_URL } from "../../config";

export default function TrendingMovies() {
  const navigation = useNavigation();

  const [films, setFilms] = useState([]);

  const getPopularFilms = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/movies/trending`);
      setFilms(response.data.movies);
    } catch (error) {
      console.error("Error en obtenir les pel·lícules populars: " + error);
    }
  };

  useEffect(() => {
    getPopularFilms();
  }, []);

  return (
    <View>
      <Text style={[globalStyles.textBase, styles.title]}>
        Trending this week
      </Text>

      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <View style={styles.films}>
          {films.slice(0, 10).map((film, index) => (
            <View key={index} style={styles.filmsCard}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() =>
                  navigation.navigate("Film", { filmId: film.id_api })
                }
              >
                <Image
                  style={styles.filmCardImage}
                  source={{ uri: film.poster }}
                />
              </TouchableOpacity>
              <Text style={[globalStyles.textBase, styles.filmCardName]}>
                {film.title}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = {
  title: {
    fontSize: 22,
    fontWeight: "bold",
    paddingBottom: 10,
  },

  films: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
  },

  filmCardImage: {
    height: 225,
    width: 150,
    borderRadius: 10,
  },

  filmCardName: {
    fontSize: 14,
    marginTop: 10,
    width: 150,
  },
};
