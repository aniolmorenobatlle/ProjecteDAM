import { useRef } from "react";
import EditProfile from "./FirstTab/EditProfile";
import SearchModalize from "./FirstTab/SearchModalize";
import { API_URL } from "../../config";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, Image } from "react-native";

export default function FirstTabModalize({
  userInfo,
  newName,
  setNewName,
  newUsername,
  setNewUsername,
  poster,
  setIndex,
  setIsModalOpen,
  setIsModalizeOpen,
  modalizeRef,
  filledFavorites,
  fetchFavorites,
}) {
  const modalizeRef2 = useRef(null);

  const onOpen = () => {
    modalizeRef2.current?.open();
  };

  const handleClose = () => {
    modalizeRef.current?.close();
    setIsModalizeOpen(false);
    setIsModalOpen(false);
    setIndex(0);
  };

  return (
    <>
      <EditProfile
        userInfo={userInfo}
        newName={newName}
        setNewName={setNewName}
        newUsername={newUsername}
        setNewUsername={setNewUsername}
        poster={poster}
        filledFavorites={filledFavorites}
        setIndex={setIndex}
        onOpen={onOpen}
        fetchFavorites={fetchFavorites}
        handleClose={handleClose}
      />

      <SearchModalize
        title="Search a Film"
        userInfo={userInfo}
        modalizeRef={modalizeRef2}
        onSearch={async (query) => {
          const res = await axios.get(
            `${API_URL}/api/movies/search?query=${query}`
          );
          return res.data.movies.map((movie) => ({
            ...movie,
            release_year: movie.release_year.split("-")[0],
          }));
        }}
        renderItem={(movie) => (
          <View>
            <View style={styles.listItem}>
              <Image source={{ uri: movie.poster }} style={styles.listPoster} />
              <View style={styles.listSearchTextsContainer}>
                <Text style={styles.listSearchListTitle}>{movie.title} </Text>
                <Text style={styles.listSearchListYear}>
                  {movie.release_year}, directed by{" "}
                </Text>
                <Text style={styles.listSearchListDirector}>
                  {movie.director_name}
                </Text>
              </View>
            </View>

            <View style={styles.separator} />
          </View>
        )}
        onItemPress={async (movie) => {
          const token = await AsyncStorage.getItem("authToken");
          await axios.post(
            `${API_URL}/api/users/addFavorite`,
            { movieId: movie.id_api },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          fetchFavorites();
          modalizeRef2.current?.close();
        }}
      />
    </>
  );
}

const styles = {
  listItem: {
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

  listSearchTextsContainer: {
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

  separator: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginTop: 10,
  },
};
