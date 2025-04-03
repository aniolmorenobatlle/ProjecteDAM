import React from "react";
import {
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Modalize } from "react-native-modalize";
import Icon from "react-native-vector-icons/Ionicons";
import { globalStyles } from "../../../globalStyles";

const list = [
  {
    poster: "https://image.tmdb.org/t/p/w500/lurEK87kukWNaHd0zYnsi3yzJrs.jpg",
    title: "Mufasa: The Lion King",
    director: "Berry Jenkins",
    year: 2024,
  },
  {
    poster: "https://image.tmdb.org/t/p/w500/lurEK87kukWNaHd0zYnsi3yzJrs.jpg",
    title: "Mufasa: The Lion King",
    director: "Berry Jenkins",
    year: 2024,
  },
  {
    poster: "https://image.tmdb.org/t/p/w500/lurEK87kukWNaHd0zYnsi3yzJrs.jpg",
    title: "Mufasa: The Lion King",
    director: "Berry Jenkins",
    year: 2024,
  },
  {
    poster: "https://image.tmdb.org/t/p/w500/lurEK87kukWNaHd0zYnsi3yzJrs.jpg",
    title: "Mufasa: The Lion King",
    director: "Berry Jenkins",
    year: 2024,
  },
  {
    poster: "https://image.tmdb.org/t/p/w500/lurEK87kukWNaHd0zYnsi3yzJrs.jpg",
    title: "Mufasa: The Lion King",
    director: "Berry Jenkins",
    year: 2024,
  },
  {
    poster: "https://image.tmdb.org/t/p/w500/lurEK87kukWNaHd0zYnsi3yzJrs.jpg",
    title: "Mufasa: The Lion King",
    director: "Berry Jenkins",
    year: 2024,
  },
  {
    poster: "https://image.tmdb.org/t/p/w500/lurEK87kukWNaHd0zYnsi3yzJrs.jpg",
    title: "Mufasa: The Lion King",
    director: "Berry Jenkins",
    year: 2024,
  },
  {
    poster: "https://image.tmdb.org/t/p/w500/lurEK87kukWNaHd0zYnsi3yzJrs.jpg",
    title: "Mufasa: The Lion King",
    director: "Berry Jenkins",
    year: 2024,
  },
  {
    poster: "https://image.tmdb.org/t/p/w500/lurEK87kukWNaHd0zYnsi3yzJrs.jpg",
    title: "Mufasa: The Lion King",
    director: "Berry Jenkins",
    year: 2024,
  },
  {
    poster: "https://image.tmdb.org/t/p/w500/lurEK87kukWNaHd0zYnsi3yzJrs.jpg",
    title: "Mufasa: The Lion King",
    director: "Berry Jenkins",
    year: 2024,
  },
  {
    poster: "https://image.tmdb.org/t/p/w500/lurEK87kukWNaHd0zYnsi3yzJrs.jpg",
    title: "Mufasa: The Lion King",
    director: "Berry Jenkins",
    year: 2024,
  },
  {
    poster: "https://image.tmdb.org/t/p/w500/lurEK87kukWNaHd0zYnsi3yzJrs.jpg",
    title: "Mufasa: The Lion King",
    director: "Berry Jenkins",
    year: 2024,
  },
];

export default function SearchModalize({
  modalizeRef,
  onClose,
  onSearch,
  userInfo,
}) {
  return (
    <Modalize
      ref={modalizeRef}
      modalStyle={styles.modalize}
      panGestureEnabled={false}
      HeaderComponent={
        <>
          <View style={styles.headerModal}>
            <TouchableOpacity
              style={styles.btnCloseContainer}
              activeOpacity={0.8}
              onPress={() => {
                modalizeRef.current?.close();
              }}
            >
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.searchFilm}>Search a Film</Text>
            <Image
              source={{ uri: userInfo.avatar }}
              style={styles.searchAvatar}
            />
          </View>
          <View style={styles.shortLine}></View>
        </>
      }
      withHandle={false}
    >
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
          />
          <Icon
            name="close-circle-outline"
            size={20}
            color="rgba(255, 255, 255, 0.7)"
            style={styles.inputDeleteIcon}
          />
        </View>
        <View style={styles.separator} />
      </View>

      <FlatList
        style={{ paddingBottom: 120 }}
        data={list}
        nestedScrollEnabled={true}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <View style={styles.listSearchContainer}>
              <Image source={{ uri: item.poster }} style={styles.listPoster} />
              <View style={styles.listSearcTextsContainer}>
                <Text style={styles.listSearchListTitle}>{item.title}</Text>
                <Text style={styles.listSearchListYear}>
                  {item.year}, directed by{" "}
                </Text>
                <Text style={styles.listSearchListDirector}>
                  {item.director}
                </Text>
              </View>
            </View>
            <View style={styles.separator} />
          </View>
        )}
      />
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
