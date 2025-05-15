import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { API_URL } from "../../../config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function ListInfoProfile({
  selectedList,
  setSelectedList,
  profileInfo,
}) {
  const navigation = useNavigation();
  const [movies, setMovies] = useState([]);

  const formatListName = (listName) => {
    if (listName === "Watched This Year") {
      return "watchedThisYear";
    } else if (listName === "Total Reviews") {
      return "reviews";
    }
    return listName.charAt(0).toLowerCase() + listName.slice(1); // Convertir la primera a minuscula
  };

  const fetchMovies = async () => {
    const token = await AsyncStorage.getItem("authToken");
    const formattedListName = formatListName(selectedList);

    try {
      const response = await axios.get(
        `${API_URL}/api/users/${formattedListName}/${profileInfo.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 && response.data.movies.length === 0) {
        setMovies([]);
        return;
      }

      setMovies(response.data.movies);
    } catch (error) {
      console.error("Error fetching movies:", error);
      Alert.alert("Error", "Error fetching movies, please try again later");
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <SafeAreaView style={{ paddingHorizontal: 15, paddingBottom: 50 }}>
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setSelectedList(null)}
        >
          <Icon name="arrow-back-outline" size={30} style={styles.headerIcon} />
        </TouchableOpacity>

        <Text style={styles.listName}>{selectedList}</Text>
      </View>

      {movies.length === 0 ? (
        <Text style={styles.emptyMessage}>
          There are no films on this list yet
        </Text>
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item) => item.id_api.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              key={item.id_api}
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate("Film", { filmId: item.id_api })
              }
            >
              <View style={styles.listItem}>
                <Image source={{ uri: item.poster }} style={styles.listImage} />
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listGrid}
          showsHorizontalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = {
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },

  listName: {
    flex: 1,
    textAlign: "center",
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },

  headerIcon: {
    flex: 1,
    textAlign: "left",
    color: "white",
  },

  listGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
  },

  listItem: {
    width: 110,
  },

  listImage: {
    width: "100%",
    height: 170,
    borderRadius: 10,
  },

  listTitle: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 16,
    marginTop: 10,
  },

  emptyMessage: {
    textAlign: "center",
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 16,
    marginTop: 10,
  },
};
