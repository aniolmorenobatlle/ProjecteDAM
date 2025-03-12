import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Dimensions, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from 'react-native-vector-icons/Ionicons';
import { globalStyles } from "../globalStyles";

const numColumns = 4;
const screenWidth = Dimensions.get("window").width;
const itemSize = screenWidth / numColumns - 10;

export default function Search() {
  const navigation = useNavigation();
  const [movies, setMovies] = useState([]);

  // const clearStoredMovies = async () => {
  //   try {
  //     await AsyncStorage.removeItem("mostPopularMovies");
  //     await AsyncStorage.removeItem("moviesTimestamp");
  //     console.log("Dades esborrades. Es tornaran a carregar.");
  //   } catch (error) {
  //     console.error("Error en esborrar les dades: ", error);
  //   }
  // };
  
  const getPopularFilms = async () => {
    try {
      const storedMovies = await AsyncStorage.getItem("mostPopularMovies");
      const storedTimestamp = await AsyncStorage.getItem("moviesTimestamp");
  
      const now = Date.now();
      const oneDay = 24 * 60 * 60 * 1000;
  
      if (storedMovies && storedTimestamp && now - Number(storedTimestamp) < oneDay) {
        setMovies(JSON.parse(storedMovies));
        return;
      }
    
      const response = await axios.get(`http://172.20.10.2:3000/api/movies/most_popular`);
      const films = response.data.movies;
  
      setMovies(films);
  
      await AsyncStorage.setItem("mostPopularMovies", JSON.stringify(films));
      await AsyncStorage.setItem("moviesTimestamp", JSON.stringify(now));
    } catch (error) {
      console.error("Error getting popular films: " + error);
    }
  };
  
  useEffect(() => {
    getPopularFilms()
  }, [])

  return (
    <SafeAreaView style={[globalStyles.container, styles.mainContainer]}>
      <View style={styles.header}>
        <Text style={[globalStyles.textBase, styles.headerTitle]}>Search</Text>

        <View style={styles.searchBar}>
          <Icon name="search-outline" color="#c3c3c3" size={20} style={styles.searchIcon} />
          <Text style={[globalStyles.textBase, styles.searchText]}>Search for a movie</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Text style={[globalStyles.textBase, styles.popularTitle]}>Most popular</Text>

        <View style={styles.movieGrid}>
          {movies.map((item, index) => (
            <View key={index} style={[styles.movieItem, { width: itemSize, height: itemSize * 1.5 }]}>
              <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate("Film", { filmId: item.id })}>
                <Image source={{ uri: item.poster }} style={styles.movieImage} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = {
  mainContainer: {
    paddingHorizontal: 15,
  },

  header: {
    alignItems: "center",
    paddingBottom: 10,
  },

  headerTitle: {
    fontSize: 25,
    fontWeight: "bold",
  },

  searchBar: {
    width: "100%",
    height: 40,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginTop: 10,
    justifyContent: "center",
  },

  searchIcon: {
    position: "absolute",
    left: 10,
  },

  searchText: {
    color: "#c3c3c3",
    fontSize: 15,
    marginLeft: 40,
  },

  popularTitle: {
    fontSize: 18,
    paddingBottom: 10,
    marginTop: 10,
  },

  movieGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  movieItem: {
    alignItems: "center",
  },

  movieImage: {
    width: 80,
    height: 120,
    borderRadius: 10,
  },
};
