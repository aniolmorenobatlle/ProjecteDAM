import { globalStyles } from "../globalStyles";
import {
  View,
  Text,
  Alert,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "../config";
import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";

export default function ActorInfo({ route }) {
  const { actorId, name } = route.params;
  const navigation = useNavigation();
  const [movies, setMovies] = useState(null);
  const [loading, setLoading] = useState(true);

  const screenWidth = Dimensions.get("window").width;
  const itemGap = 15;
  const numColumns = 3;
  const totalGapWidth = itemGap * (numColumns - 1);
  const itemWidth = (screenWidth - totalGapWidth - 20) / numColumns;

  const fetchActorMovies = async (actorId) => {
    setLoading(true);
    setMovies([]);

    const token = await AsyncStorage.getItem("authToken");

    try {
      const response = await axios.get(
        `${API_URL}/api/movies/actor/${actorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMovies(response.data.movies);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching actor movies:", error);
      Alert.alert(
        "Error",
        "Error fetching actor movies, please try again later"
      );

      setLoading(false);
    }
  };

  useEffect(() => {
    if (actorId) {
      fetchActorMovies(actorId);
    }
  }, [actorId]);

  const styles = createStyles(itemGap, itemWidth);

  return (
    <SafeAreaView style={[globalStyles.container, { padding: 15 }]}>
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back-outline" size={30} style={styles.headerIcon} />
        </TouchableOpacity>

        <Text style={styles.listName}>{name}'s Films</Text>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#fff"
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        />
      ) : !movies || movies.length === 0 ? (
        <Text style={styles.emptyMessage}>
          There are no films for this actor yet
        </Text>
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item) => item.id_api.toString()}
          numColumns={3}
          contentContainerStyle={styles.listContainer}
          columnWrapperStyle={styles.listRow}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Film", { filmId: item.id_api })
              }
              style={styles.listItemContainer}
              activeOpacity={0.8}
            >
              <Image source={{ uri: item.poster }} style={styles.listImage} />
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const createStyles = (itemGap, itemWidth) => ({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },

  emptyMessage: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
    marginTop: 20,
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

  listRow: {
    justifyContent: "flex-start",
    marginBottom: itemGap,
    gap: 10,
  },

  listItemContainer: {
    width: itemWidth,
  },

  listImage: {
    width: "100%",
    height: 170,
    borderRadius: 10,
  },
});
