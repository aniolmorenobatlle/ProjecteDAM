import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Menu, Provider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { API_URL } from "../config";
import { globalStyles } from "../globalStyles";
import { useUserInfo } from "../hooks/useUserInfo";

export default function ListInfo() {
  const route = useRoute();
  const { listId } = route.params;
  const navigation = useNavigation();
  const { userInfo, loading, error } = useUserInfo();
  const [visible, setVisible] = useState(false);
  const [listFilms, setListFilms] = useState([]);

  const fetchListInfo = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/lists/listInfo/${listId}`
      );

      setListFilms(response.data.listInfo);
    } catch (error) {
      console.error("Error fetching list info", error);
    }
  };

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const handleDeleteList = async () => {
    try {
      await axios.post(`${API_URL}/api/lists/deleteList`, {
        list_id: listId,
      });

      navigation.goBack();
    } catch (error) {
      console.error("Error deleting the list", error);
    }
  };

  useEffect(() => {
    fetchListInfo();
  }, [listId]);

  if (loading)
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#1F1D36",
        }}
      >
        <ActivityIndicator size="large" color="white" />
      </View>
    );

  if (error)
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#1F1D36",
        }}
      >
        <Text style={{ color: "white" }}>
          Error: {error?.message || "Error desconegut"}
        </Text>
      </View>
    );

  return (
    <Provider>
      <SafeAreaView style={[globalStyles.container, styles.mainContainer]}>
        <ScrollView
          style={globalStyles.container}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Icon
                name="arrow-back-outline"
                size={30}
                style={styles.addList}
              />
            </TouchableOpacity>

            <Menu
              visible={visible}
              onDismiss={closeMenu}
              anchor={
                <TouchableOpacity onPress={openMenu}>
                  <Icon
                    name="ellipsis-vertical"
                    size={30}
                    style={styles.addList}
                  />
                </TouchableOpacity>
              }
            >
              <Menu.Item
                onPress={() => navigation.navigate("Search")}
                title="Add film"
              />
              <Menu.Item onPress={handleDeleteList} title="Delete list" />
            </Menu>
          </View>

          <View style={styles.listGrid}>
            {listFilms.length === 0 ? (
              <Text style={styles.emptyMessage}>
                There are no films on this list yet
              </Text>
            ) : (
              listFilms.map((list, index) => (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() =>
                    navigation.navigate("Film", { filmId: list.id_api })
                  }
                >
                  <View style={styles.listItem} key={index}>
                    <Image
                      source={{ uri: list.poster }}
                      style={styles.listImage}
                    />
                    <Text style={styles.listTitle}>{list.title}</Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Provider>
  );
}

const styles = {
  mainContainer: {
    paddingHorizontal: 15,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
  },

  addList: {
    color: "white",
  },

  listGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  listItem: {
    width: "30%",
    marginBottom: 20,
  },

  listImage: {
    width: "100%",
    height: 180,
    borderRadius: 10,
  },

  listTitle: {
    color: "white",
    fontSize: 16,
    marginTop: 10,
  },

  emptyMessage: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 16,
    marginTop: 10,
  },
};
