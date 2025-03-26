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
import { Dropdown } from "react-native-element-dropdown";
import { Menu, Provider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import CustomModal from "../components/CustomModal";
import { API_URL } from "../config";
import { globalStyles } from "../globalStyles";
import { useUserInfo } from "../hooks/useUserInfo";

export default function ListInfo() {
  const route = useRoute();
  const { listId, listName } = route.params;
  const navigation = useNavigation();
  const { loading, error } = useUserInfo();
  const [visible, setVisible] = useState(false);
  const [listFilms, setListFilms] = useState([]);
  const [modalDeleteList, setModalDeleteList] = useState(false);
  const [dropdownList, setDropdownList] = useState([]);
  const [selectedFilmId, setSelectedFilmId] = useState(null);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const fetchListInfo = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/lists/listInfo/${listId}`
      );

      const dropdownList = response.data.listInfo.map((list) => ({
        label: list.title,
        value: list.id_api,
      }));

      setDropdownList(dropdownList);
      setListFilms(response.data.listInfo);
    } catch (error) {
      console.error("Error fetching list info", error);
    }
  };

  const handleOpenModalDeleteList = () => {
    closeMenu();
    setModalDeleteList(true);
  };

  const handleCloseModalDeleteList = () => {
    setModalDeleteList(false);
  };

  const handleDeleteFilmFromList = async () => {
    try {
      await axios.post(`${API_URL}/api/lists/deleteFilmFromList`, {
        movie_id: selectedFilmId,
        list_id: listId,
      });

      handleCloseModalDeleteList();
      fetchListInfo();
    } catch (error) {
      console.error("Error deleting film from list", error);
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

            <Text style={styles.listName}>{listName}</Text>

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
              <Menu.Item
                onPress={handleOpenModalDeleteList}
                title="Delete film"
              />
            </Menu>
          </View>

          {listFilms.length === 0 ? (
            <Text style={styles.emptyMessage}>
              There are no films on this list yet
            </Text>
          ) : (
            <View style={styles.listGrid} key={listId}>
              {listFilms.map((list, index) => (
                <TouchableOpacity
                  key={list.id_api}
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
              ))}
            </View>
          )}
        </ScrollView>

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
            search
            searchPlaceholder="Search"
            labelField="label"
            valueField="value"
            placeholder="Select item"
            value={selectedFilmId}
            onChange={(item) => {
              setSelectedFilmId(item.value);
            }}
          />

          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleDeleteFilmFromList}
            >
              <Text style={styles.confirmButtonText}>Done</Text>
            </TouchableOpacity>

            <TouchableOpacity
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
  },

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

  addList: {
    color: "white",
  },

  listGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
  },

  listItem: {
    width: 110,
  },

  listImage: {
    width: "100%",
    height: 170,
    borderRadius: 10,
  },

  listTitle: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 16,
    marginTop: 10,
  },

  emptyMessage: {
    textAlign: "center",
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 16,
    marginTop: 10,
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
