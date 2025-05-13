import { useState, useEffect, useRef } from "react";
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
import SearchModalize from "./SearchModalize";
import { Menu, Provider } from "react-native-paper";

export default function FriendsInfoProfile({
  selectedList,
  setSelectedList,
  userInfo,
  editable,
}) {
  editable = editable || false;

  const navigation = useNavigation();

  const [visible, setVisible] = useState(false);
  const [users, setUsers] = useState([]);

  const modalizeRef = useRef(null);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const onOpen = () => {
    modalizeRef.current?.open();
  };

  const fetchUsers = async () => {
    const token = await AsyncStorage.getItem("authToken");

    try {
      const response = await axios.get(`${API_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(response.data.users);
    } catch (error) {
      console.log("Error fetching reviews:", error);
      Alert.alert("Error", "Error fetching reviews, please try again later");
    }
  };

  useEffect(() => {
    fetchUsers();
  });

  return (
    <Provider>
      <SafeAreaView style={{ paddingHorizontal: 15, paddingBottom: 50 }}>
        <View style={styles.header}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setSelectedList(null)}
          >
            <Icon
              name="arrow-back-outline"
              size={30}
              style={styles.headerIcon}
            />
          </TouchableOpacity>
          <Text style={styles.listName}>{selectedList}</Text>

          {editable ? (
            <Menu
              style={{ marginTop: 40 }}
              visible={visible}
              onDismiss={closeMenu}
              anchor={
                <TouchableOpacity onPress={openMenu}>
                  <Icon
                    name="ellipsis-vertical"
                    size={30}
                    style={{ color: "white" }}
                  />
                </TouchableOpacity>
              }
            >
              <Menu.Item onPress={onOpen} title="Add a friend" />
              <Menu.Item
                onPress={() => console.log("delete film")}
                title="Delete a friend"
              />
            </Menu>
          ) : (
            <View />
          )}
        </View>

        {users.length === 0 ? (
          <Text style={styles.emptyMessage}>
            There are no films on this list yet
          </Text>
        ) : (
          <FlatList
            data={users}
            keyExtractor={(user) => user.id}
            renderItem={({ item: user }) => (
              <View style={styles.listGrid}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("UserProfile", { userId: user.id })
                  }
                  activeOpacity={0.8}
                  style={styles.listItem}
                >
                  <Image
                    source={{
                      uri: user.avatar
                        ? `${user.avatar}&nocache=true`
                        : `${API_URL}/api/users/${user.id}/avatar`,
                    }}
                    style={styles.listImage}
                  />

                  <Text style={globalStyles.textBase}>{user.name}</Text>
                </TouchableOpacity>
                <View style={styles.line}></View>
              </View>
            )}
          />
        )}
      </SafeAreaView>

      <SearchModalize
        title="Search a Friend"
        userInfo={userInfo}
        modalizeRef={modalizeRef}
        onSearch={async (query) => {
          const token = await AsyncStorage.getItem("authToken");
          const res = await axios.get(`${API_URL}/api/users?query=${query}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          return res.data.users;
        }}
        renderItem={(user) => (
          <View>
            <View style={styles.listItems}>
              <Image
                source={{ uri: `${user.avatar}&nocache=true` }}
                style={styles.userAvatar}
              />
              <View style={styles.searchUserInfo}>
                <Text style={styles.searchUsername}>{user.username}</Text>
                <Text style={styles.searchName}>{user.name}</Text>
              </View>
            </View>

            <View style={styles.separator} />
          </View>
        )}
        // onItemPress={(user) => {
        //   navigation.navigate("UserProfile", { userId: user.id });
        //   modalizeRef.current?.close();
        // }}
      />
    </Provider>
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
