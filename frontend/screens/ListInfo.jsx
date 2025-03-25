import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { globalStyles } from "../globalStyles";
import { useUserInfo } from "../hooks/useUserInfo";

const theGorge =
  "https://image.tmdb.org/t/p/w500/7iMBZzVZtG0oBug4TfqDb9ZxAOa.jpg";
const theBatman =
  "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg";
const babyDriver =
  "https://image.tmdb.org/t/p/w500/dN9LbVNNZFITwfaRjl4tmwGWkRg.jpg";
const avatar =
  "https://image.tmdb.org/t/p/w500/6EiRUJpuoeQPghrs3YNktfnqOVh.jpg";

const lists = [
  { title: "The Gorge", image: theGorge },
  { title: "The Batman", image: theBatman },
  { title: "Baby Driver", image: babyDriver },
  { title: "Avatar", image: avatar },
];

export default function ListInfo() {
  const navigation = useNavigation();
  const { userInfo, loading, error } = useUserInfo();

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
        </View>
        <View style={styles.listGrid}>
          {lists.map((list, index) => (
            <View style={styles.listItem} key={index}>
              <Image source={{ uri: list.image }} style={styles.listImage} />
              <Text style={styles.listTitle}>{list.title}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
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
};
