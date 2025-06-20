import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { Menu, Provider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import CustomModal from "../components/CustomModal";
import { API_URL } from "../config";
import { globalStyles } from "../globalStyles";
import { useUserInfo } from "../hooks/useUserInfo";

export default function Lists() {
  const navigation = useNavigation();
  const { userInfo, loading, error } = useUserInfo();
  const [modalAddList, setModalAddList] = useState(false);
  const [modalDeleteList, setModalDeleteList] = useState(false);
  const [name, setName] = useState("");
  const [lists, setLists] = useState([]);
  const [visible, setVisible] = useState(false);
  const [dropdownList, setDropdownList] = useState([]);
  const [selectedListId, setSelectedListId] = useState(null);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const fetchLists = async () => {
    const token = await AsyncStorage.getItem("authToken");
    const userId = userInfo.id;

    try {
      // Obtenir les llistes pròpies
      const response = await axios.get(
        `${API_URL}/api/lists?user_id=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Format per les llistes pròpies al dropdown
      const ownListsFormatted = response.data.lists.map((list) => ({
        label: list.name,
        value: list.id,
        isShared: false,
      }));

      // Obtenir les llistes compartides
      const sharedResponse = await axios.get(
        `${API_URL}/api/lists/shared/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Format per les llistes compartides al dropdown
      const sharedListsFormatted = sharedResponse.data.sharedLists.map(
        (shared) => ({
          label: `${shared.list_name} (${shared.user_username})`,
          value: shared.list_id,
          isShared: true,
        })
      );

      // Combinar les dues llistes pel dropdown
      setDropdownList([...ownListsFormatted, ...sharedListsFormatted]);

      return response.data.lists.map((list) => ({
        id: list.id,
        name: list.name,
        owner: userInfo.username,
        movie_count: list.movie_count,
      }));
    } catch (error) {
      console.log("Error fetching the lists", error);
      return [];
    }
  };

  const fetchSharedLists = async () => {
    const token = await AsyncStorage.getItem("authToken");
    const userId = userInfo.id;

    try {
      const response = await axios.get(
        `${API_URL}/api/lists/shared/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.sharedLists.map((shared) => ({
        id: shared.list_id,
        name: shared.list_name,
        owner: shared.user_username,
        movie_count: shared.movie_count,
      }));
    } catch (error) {
      console.log("Error fetching the shared lists", error);
      return [];
    }
  };

  const refreshAllLists = async () => {
    const ownLists = await fetchLists();
    const sharedLists = await fetchSharedLists();

    const combined = [...ownLists, ...sharedLists];
    const uniqueLists = Object.values(
      combined.reduce((acc, list) => {
        acc[list.id] = list;
        return acc;
      }, {})
    );
    setLists(uniqueLists);
  };

  const handleOpenModalAddList = () => {
    closeMenu();
    setModalAddList(true);
  };

  const handleCloseModalAddList = () => {
    setModalAddList(false);
    setName("");
  };

  const handleAddList = async () => {
    if (name !== "") {
      try {
        await axios.post(`${API_URL}/api/lists/addList`, {
          name,
          user_id: userInfo.id,
        });

        setModalAddList(false);
        setName("");
        refreshAllLists();
      } catch (error) {
        console.error("Error creating the list", error);
        Alert.alert("Error", "Error creating the list");
      }
    } else {
      setModalAddList(false);
    }
  };

  const handleListClick = (listId, listName, isShared) => {
    navigation.navigate("ListInfo", { listId, listName, isShared });
  };

  const handleOpenModalDeleteList = () => {
    closeMenu();
    setModalDeleteList(true);
  };

  const handleCloseModalDeleteList = () => {
    setModalDeleteList(false);
  };

  const handleDeleteList = async () => {
    try {
      const selectedList = dropdownList.find(
        (list) => list.value === selectedListId
      );

      if (!selectedList) {
        Alert.alert("Error", "Please select a list");
        return;
      }

      const token = await AsyncStorage.getItem("authToken");

      if (selectedList.isShared) {
        // Delete shared list access
        await axios.delete(
          `${API_URL}/api/lists/${selectedList.value}/shared/${userInfo.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        // Delete owned list
        await axios.post(
          `${API_URL}/api/lists/deleteList`,
          {
            list_id: selectedListId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      setModalDeleteList(false);
      refreshAllLists();
    } catch (error) {
      console.error("Error deleting the list", error);
      Alert.alert(
        "Error",
        selectedList?.isShared
          ? "Error removing shared list access"
          : "Error deleting the list"
      );
    }
  };

  useEffect(() => {
    if (userInfo && userInfo.id) {
      refreshAllLists();
    }
  }, [userInfo]);

  if (loading) {
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
  }

  if (error) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#1F1D36",
        }}
      >
        <Text style={{ color: "white", fontSize: 16 }}>
          {error?.message === "401"
            ? "Unauthorized: Redirecting to login..."
            : `Error: ${error?.message || "Error desconegut"}`}
        </Text>
      </View>
    );
  }

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
              style={{ marginTop: 40 }}
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
              <Menu.Item onPress={handleOpenModalAddList} title="Add list" />
              <Menu.Item
                onPress={handleOpenModalDeleteList}
                title="Delete list"
              />
            </Menu>
          </View>

          <View style={styles.listInfo}>
            <View
              style={styles.listInfoContainer}
              contentContainerStyle={{ alignItems: "center" }}
            >
              {lists.length === 0 ? (
                <Text style={[globalStyles.textBase, styles.noList]}>
                  No lists yet
                </Text>
              ) : (
                lists.map((list, index) => (
                  <View key={index} style={{ width: "100%", marginTop: 10 }}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() =>
                        handleListClick(
                          list.id,
                          list.name,
                          list.owner && list.owner !== userInfo.username
                        )
                      }
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        <Text
                          style={[globalStyles.textBase, styles.listInfoTitle]}
                        >
                          {list.name}
                          {list.owner && list.owner !== userInfo.username && (
                            <Text
                              style={{
                                color: "gray",
                                fontSize: 12,
                                fontStyle: "italic",
                              }}
                            >
                              {" "}
                              ({list.owner})
                            </Text>
                          )}
                        </Text>
                        <Text
                          style={[globalStyles.textBase, styles.listInfoNumber]}
                        >
                          {list.movie_count}
                        </Text>
                      </View>
                    </TouchableOpacity>

                    <View
                      style={{
                        width: "100%",
                        height: 1,
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        marginVertical: 10,
                      }}
                    />
                  </View>
                ))
              )}
            </View>
          </View>
        </ScrollView>

        <CustomModal
          visible={modalAddList}
          onClose={() => setModalAddList(false)}
        >
          <Text style={styles.modalTitle}>Add a new list</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Name of the list"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={name}
              onChangeText={setName}
            />
          </View>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.confirmButton}
              onPress={handleAddList}
            >
              <Text style={styles.confirmButtonText}>Done</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.cancelButton}
              onPress={handleCloseModalAddList}
            >
              <Text style={styles.confirmButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </CustomModal>

        <CustomModal
          visible={modalDeleteList}
          onClose={() => setModalDeleteList(false)}
        >
          <Text style={styles.modalTitle}>Delete a list</Text>

          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={dropdownList}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Select item"
            value={selectedListId}
            onChange={(item) => {
              setSelectedListId(item.value);
            }}
          />

          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.confirmButton}
              onPress={handleDeleteList}
            >
              <Text style={styles.confirmButtonText}>Done</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.cancelButton}
              onPress={handleCloseModalDeleteList}
            >
              <Text style={styles.confirmButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </CustomModal>
      </SafeAreaView>
    </Provider>
  );
}

const styles = {
  mainContainer: {
    paddingHorizontal: 15,
    paddingTop: 10,
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

  noList: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
  },

  listGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  listInfoTitle: {
    fontSize: 18,
  },

  listInfoNumber: {
    color: "#9C4A8B",
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "white",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginVertical: 10,
    marginBottom: 20,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: "white",
  },

  columnContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 40,
    marginTop: 20,
  },

  columnContainerRate: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginVertical: 20,
  },

  optionContainer: {
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },

  optionText: {
    fontSize: 12,
    paddingVertical: 10,
    color: "#D3D3D3",
    fontWeight: "bold",
  },

  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },

  confirmButton: {
    width: "48%",
    padding: 10,
    backgroundColor: "#E9A6A6",
    borderRadius: 10,
    alignItems: "center",
  },

  cancelButton: {
    width: "48%",
    padding: 10,
    backgroundColor: "#9C4A8B",
    borderRadius: 10,
    alignItems: "center",
  },

  confirmButtonText: {
    fontSize: 14,
    color: "#000",
    fontWeight: "bold",
  },

  dropdown: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "white",
    padding: 10,
  },

  icon: {
    marginRight: 5,
  },

  placeholderStyle: {
    color: "white",
    fontSize: 16,
  },

  selectedTextStyle: {
    color: "white",
    fontSize: 16,
  },

  iconStyle: {
    width: 25,
    height: 25,
  },

  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
};
