import { useState, useEffect } from "react";
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
import { globalStyles } from "../../../globalStyles";

export default function FriendsInfoProfile({
  selectedList,
  setSelectedList,
  userInfo,
}) {
  const navigation = useNavigation();
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const token = await AsyncStorage.getItem("authToken");

    try {
      const response = await axios.get(`${API_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Fetched users:", response.data.users);

      setUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      Alert.alert("Error", "Error fetching reviews, please try again later");
    }
  };

  useEffect(() => {
    fetchUsers();
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

      {users.length === 0 ? (
        <Text style={styles.emptyMessage}>
          There are no films on this list yet
        </Text>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(user) => user.id_api}
          renderItem={({ item: user }) => (
            <View style={styles.listGrid}>
              <View style={styles.listItem}>
                <Image
                  source={{
                    uri: user.avatar
                      ? `${user.avatar}`
                      : `${API_URL}/api/users/${user.id}/avatar`,
                  }}
                  style={styles.listImage}
                />
              </View>
              <View style={styles.line}></View>
            </View>
          )}
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

  emptyMessage: {
    textAlign: "center",
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 16,
    marginTop: 10,
  },

  listGrid: {
    flexDirection: "column",
  },

  listItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    width: "100%",
  },

  listImage: {
    width: 60,
    height: 80,
    borderRadius: 10,
    objectFit: "cover",
  },

  listTitle: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 16,
    marginTop: 10,
  },

  comment: {
    textAlign: "justify",
    fontSize: 14,
  },

  date: {
    color: "gray",
    fontSize: 12,
  },

  line: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginVertical: 10,
  },
};
