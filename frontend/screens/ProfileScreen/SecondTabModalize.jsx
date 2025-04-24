import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { API_URL } from "../../config";
import { globalStyles } from "../../globalStyles";

const CLOUNDINARY_URL =
  "https://res.cloudinary.com/dwe0on2fw/image/upload/recommendme-cover";

const posters = [
  "toyStory",
  "interstellar",
  "whiplash",
  "spiderman",
  "lotr",
  "walle",
  "topGun",
  "theBatman",
  "lionKing",
  "pp",
  "noah",
  "hp",
];

export default function SecondTabModalize({
  userInfo,
  selectedPoster,
  setSelectedPoster,
  setPoster,
  setIndex,
}) {
  const [image, setImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (userInfo && !selectedPoster) {
      setSelectedPoster(userInfo.poster);
    }
  }, [userInfo, selectedPoster, setSelectedPoster]);

  const handleChangePoster = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");

      await axios.post(
        `${API_URL}/api/users/editProfilePoster`,
        { poster: selectedPoster },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPoster(selectedPoster);
      setIndex(0);
    } catch (error) {
      Alert.alert("Error", "Failed to change poster. Please try again.");
      console.error("Error changing poster:", error);
    }
  };

  const handlePosterSelection = (poster) => {
    setSelectedPoster(`${CLOUNDINARY_URL}/${poster}.jpg`);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission denied",
        "We need camera roll permissions to make this work!"
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "Images",
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
      base64: false,
    });

    if (!result.canceled) {
      const extension = result.assets[0].uri.split(".").pop();
      let mimeType = "image/jpeg";
      if (extension === "png") mimeType = "image/png";

      setImage({
        uri: result.assets[0].uri,
        mimeType: mimeType,
      });
    }
  };

  const handleChangeAvatar = async () => {
    if (!image) {
      Alert.alert("No hi ha cap imatge per pujar");
      return;
    }

    setIsUploading(true);

    try {
      // Convertir imatge a base64
      const base64 = await FileSystem.readAsStringAsync(image.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const response = await axios.post(
        `${API_URL}/api/users/editProfileAvatar`,
        { avatar: base64, mimeType: image.mimeType },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = response.data;

      console.log("Resposta:", result);

      if (response.status === 200) {
        Alert.alert("Avatar actualitzat correctament!");
      } else {
        Alert.alert("Error actualitzant l'avatar");
      }
    } catch (error) {
      console.error("Error pujant la imatge:", error);
      Alert.alert("Error pujant la imatge");
    }

    setIsUploading(false);
  };

  return (
    <ScrollView
      style={{ flex: 1, marginBottom: 20 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.panelContent}>
        <View>
          <View style={styles.profileTitleContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setIndex(0)}
              style={styles.profileBackContainer}
            >
              <Icon
                name="chevron-back-outline"
                size={25}
                style={styles.goBackIcon}
              />

              <Text style={styles.profileTitle}>Avatar</Text>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.8} onPress={handleChangeAvatar}>
              <Text style={[globalStyles.textBase, styles.btnSave]}>Save</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.longLine}></View>

          <View style={styles.galeryContainer}>
            {image ? (
              <Image source={{ uri: image.uri }} style={styles.avatarPreview} />
            ) : (
              <Image
                source={{ uri: userInfo.avatar_binary || userInfo.avatar }}
                style={styles.avatarPreview}
              />
            )}

            <View style={{ flexDirection: "column", gap: 10 }}>
              <TouchableOpacity activeOpacity={0.8} onPress={pickImage}>
                <Text style={[globalStyles.textBase, styles.btnChoose]}>
                  Choose from gallery
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View>
            <View style={styles.profileTitleContainer}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setIndex(0)}
                style={styles.profileBackContainer}
              >
                <Icon
                  name="chevron-back-outline"
                  size={25}
                  style={styles.goBackIcon}
                />

                <Text style={styles.profileTitle}>Poster</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleChangePoster}
              >
                <Text style={[globalStyles.textBase, styles.btnSave]}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.longLine}></View>

            <View style={styles.posterContainer}>
              {posters.map((poster, index) => (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.8}
                  onPress={() => handlePosterSelection(poster)}
                  style={styles.posterButton}
                >
                  <Image
                    source={{ uri: `${CLOUNDINARY_URL}/${poster}.jpg` }}
                    style={[
                      styles.posterImage,
                      selectedPoster === `${CLOUNDINARY_URL}/${poster}.jpg` &&
                        styles.selectedPoster,
                    ]}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = {
  profileTitleContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    paddingTop: 10,
    paddingBottom: 5,
  },

  profileBackContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  goBackIcon: {
    color: "rgba(255, 255, 255, 0.8)",
  },

  btnSave: {
    fontSize: 14,
    padding: 10,
    backgroundColor: "#9B4D94",
    borderRadius: 10,
  },

  profileTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },

  longLine: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    marginTop: 5,
  },

  galeryContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },

  avatarPreview: {
    width: 120,
    height: 120,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: "white",
    marginBottom: 20,
  },

  btnChoose: {
    fontSize: 14,
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    borderRadius: 10,
    color: "white",
    textAlign: "center",
  },

  posterContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginHorizontal: 10,
  },

  posterButton: {
    width: "48%",
    marginTop: 10,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  posterImage: {
    height: 120,
    width: "100%",
    borderRadius: 10,
  },

  selectedPoster: {
    borderWidth: 4,
    borderColor: "white",
  },
};
