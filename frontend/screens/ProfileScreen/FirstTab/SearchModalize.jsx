import { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Modalize } from "react-native-modalize";
import Icon from "react-native-vector-icons/Ionicons";

export default function SearchModalize({
  modalizeRef,
  title,
  userInfo,
  onSearch,
  renderItem,
  onItemPress,
  navbar,
}) {
  navbar = navbar || false;
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch(searchQuery);
      } else {
        setResults([]);
      }
    }, 300); // evitar crides constants

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleSearch = async (query) => {
    setLoading(true);
    try {
      const data = await onSearch(query);
      setResults(data);
    } catch (error) {
      console.error("Error during search:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setResults([]);
  };

  return (
    <Modalize
      ref={modalizeRef}
      panGestureEnabled={false}
      withHandle={false}
      modalStyle={[styles.modalize, { marginTop: navbar ? 100 : 0 }]}
    >
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={styles.headerModal}>
          <TouchableOpacity
            style={styles.btnCloseContainer}
            onPress={() => modalizeRef.current?.close()}
          >
            <Text style={styles.cancel}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.searchFilm}>{title}</Text>
          {userInfo?.avatar && (
            <Image
              source={{ uri: userInfo.avatar }}
              style={styles.searchAvatar}
            />
          )}
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.inputContainer}>
            <Icon name="search-outline" size={20} color="white" />
            <TextInput
              style={styles.input}
              placeholder={`Search...`}
              placeholderTextColor="white"
              value={searchQuery}
              onChangeText={(text) => setSearchQuery(text)}
            />
            <Icon
              name="close-circle-outline"
              size={20}
              color="white"
              onPress={clearSearch}
            />
          </View>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="white" />
        ) : (
          results.map((item, index) => (
            <TouchableOpacity key={index} onPress={() => onItemPress(item)}>
              {renderItem(item)}
            </TouchableOpacity>
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
    paddingHorizontal: 10,
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
