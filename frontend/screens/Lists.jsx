import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { API_URL } from "../config";
import { globalStyles } from "../globalStyles";
import { useUserInfo } from "../hooks/useUserInfo";

// const lists = [
//   { title: "Best films", number: 10 },
//   { title: "Favorites of all time", number: 30 },
//   { title: "Romance", number: 30 },
//   { title: "Terror", number: 30 },
// ];

export default function Lists() {
  const navigation = useNavigation();
  const { userInfo, loading, error } = useUserInfo();
  const [modalAddList, setModalAddList] = useState(false);
  const [name, setName] = useState("");
  const [lists, setLists] = useState([]);

  const fetchLists = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/lists/${userInfo.id}`);

      setLists(response.data.lists);
    } catch (error) {
      console.error("Error fetching the lists", error);
    }
  };

  const handleOpenModalAddList = () => {
    setModalAddList(true);
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
        fetchLists();
      } catch (error) {
        console.error("Error creating the list", error);
        Alert.alert("Error", "Error creating the list");
      }
    } else {
      setModalAddList(false);
    }
  };

  useEffect(() => {
    if (userInfo && userInfo.id) {
      fetchLists();
    }
  }, [userInfo]);

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
            <Icon name="arrow-back-outline" size={30} style={styles.addList} />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleOpenModalAddList}
          >
            <Icon name="add-circle-outline" size={45} style={styles.addList} />
          </TouchableOpacity>
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
                <View key={index} style={{ width: "100%" }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <Text style={[globalStyles.textBase, styles.listInfoTitle]}>
                      {list.name}
                    </Text>
                    <Text
                      style={[globalStyles.textBase, styles.listInfoNumber]}
                    >
                      10
                    </Text>
                  </View>

                  <View
                    style={{
                      width: "100%",
                      height: 1,
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      marginVertical: 10,
                    }}
                  ></View>
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={modalAddList}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setModalAddList(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
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

            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleAddList}
            >
              <Text style={styles.confirmButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
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

  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  modalContainer: {
    width: "90%",
    backgroundColor: "#323048",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    elevation: 5, // Ombra en Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84, // Ombra en iOS
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
    marginVertical: 5,
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

  confirmButton: {
    width: "100%",
    padding: 10,
    backgroundColor: "#E9A6A6",
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },

  confirmButtonText: {
    fontSize: 14,
    color: "#000",
    fontWeight: "bold",
  },
};
