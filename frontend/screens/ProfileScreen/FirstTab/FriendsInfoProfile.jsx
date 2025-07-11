import { useState, useCallback, useRef } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  FlatList,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { API_URL } from "../../../config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { globalStyles } from "../../../globalStyles";
import SearchModalize from "./SearchModalize";

export default function FriendsInfoProfile({
  selectedList,
  setSelectedList,
  profileInfo,
  editable,
}) {
  editable = editable || false;

  const navigation = useNavigation();

  const { id: profileId } = profileInfo || {};

  const [friends, setFriends] = useState([]);

  const modalizeRef = useRef(null);

  const onOpen = () => {
    modalizeRef.current?.open();
  };

  const fetchFriends = async () => {
    const token = await AsyncStorage.getItem("authToken");

    try {
      const response = await axios.get(
        `${API_URL}/api/users/friends/${profileInfo.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFriends(response.data.friends);
    } catch (error) {
      console.log("Error fetching friends:", error);
      Alert.alert("Error", "Error fetching friends, please try again later");
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (profileId) {
        fetchFriends();
      }
    }, [profileId])
  );

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 15, paddingBottom: 50 }}>
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setSelectedList(null)}
        >
          <Icon name="arrow-back-outline" size={30} style={styles.headerIcon} />
        </TouchableOpacity>
        <Text style={styles.listName}>{selectedList}</Text>

        {editable ? (
          <TouchableOpacity onPress={onOpen}>
            <Icon
              name="add-circle-outline"
              size={30}
              style={{ color: "white" }}
            />
          </TouchableOpacity>
        ) : (
          <View />
        )}
      </View>

      <View style={{ flex: 1 }}>
        {friends.length === 0 ? (
          <Text style={styles.emptyMessage}>
            No friends yet, add some friends to see them here!
          </Text>
        ) : (
          <FlatList
            data={friends}
            keyExtractor={(friend) => friend.id}
            renderItem={({ item: friend }) => (
              <View style={styles.listGrid}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("UserProfile", {
                      userId: friend.friend_id,
                    })
                  }
                  activeOpacity={0.8}
                  style={styles.listItem}
                >
                  <Image
                    source={{
                      uri: friend.avatar
                        ? `${friend.avatar}&nocache=${Date.now()}`
                        : `${API_URL}/api/users/${friend.friend_id}/avatar?nocache=${Date.now()}`,
                    }}
                    style={styles.listImage}
                  />

                  <View style={styles.names}>
                    <Text style={[globalStyles.textBase, styles.username]}>
                      {friend.username}
                    </Text>
                    <Text style={[globalStyles.textBase, styles.name]}>
                      {friend.name}
                    </Text>
                  </View>
                </TouchableOpacity>
                <View style={styles.line}></View>
              </View>
            )}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      <SearchModalize
        navbar={true}
        title="Search a Friend"
        profileInfo={profileInfo}
        modalizeRef={modalizeRef}
        onSearch={async (query) => {
          const token = await AsyncStorage.getItem("authToken");
          const res = await axios.get(`${API_URL}/api/users?query=${query}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          return res.data.users.filter((user) => user.id !== profileInfo.id);
        }}
        renderItem={(user) => (
          <>
            <View style={styles.listItems}>
              <Image
                source={{
                  uri: user.avatar
                    ? `${user.avatar}&nocache=${Date.now()}`
                    : `${API_URL}/api/users/${user.id}/avatar?nocache=${Date.now()}`,
                }}
                style={styles.userAvatar}
              />
              <View style={styles.searchprofileInfo}>
                <Text style={styles.searchUsername}>{user.username}</Text>
                <Text style={styles.searchName}>{user.name}</Text>
              </View>
            </View>

            <View style={styles.separator} />
          </>
        )}
        onItemPress={(user) => {
          navigation.navigate("UserProfile", { userId: user.id });
          modalizeRef.current?.close();
        }}
      />
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
    height: 60,
    borderRadius: 60,
    objectFit: "cover",
  },

  names: {
    flexDirection: "column",
    justifyContent: "center",
    gap: 5,
  },

  username: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },

  name: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 14,
  },

  line: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginVertical: 10,
  },

  listItems: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    paddingBottom: 0,
  },

  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 60,
    objectFit: "cover",
    marginRight: 10,
  },

  searchUsername: {
    flexDirection: "column",
    justifyContent: "center",
    gap: 20,
  },

  searchUsername: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  searchName: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 14,
  },

  separator: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginTop: 10,
  },
};
