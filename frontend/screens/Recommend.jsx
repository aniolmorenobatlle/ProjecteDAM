import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { globalStyles } from "../globalStyles";

const theGorge =
  "https://image.tmdb.org/t/p/w500/7iMBZzVZtG0oBug4TfqDb9ZxAOa.jpg";
const theBatman =
  "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg";
const babyDriver =
  "https://image.tmdb.org/t/p/w500/dN9LbVNNZFITwfaRjl4tmwGWkRg.jpg";
const avatar =
  "https://image.tmdb.org/t/p/w500/6EiRUJpuoeQPghrs3YNktfnqOVh.jpg";

const marks = [
  {
    name: "Watch",
    image: "eye-outline",
    activeImage: "eye",
    color: "#D3D3D3",
    colorActive: "#a9c9ff",
  },
  {
    name: "Like",
    image: "heart-outline",
    activeImage: "heart",
    color: "#D3D3D3",
    colorActive: "red",
  },
  {
    name: "Rate",
    image: "star-outline",
    activeImage: "star",
    color: "#D3D3D3",
    colorActive: "gold",
  },
  {
    name: "Watchlist",
    image: "time-outline",
    activeImage: "time",
    color: "#D3D3D3",
    colorActive: "#ff007f",
  },
];

const films = [
  { title: "Baby Driver", year: "2017", image: babyDriver },
  { title: "Avatar", year: "2009", image: avatar },
  { title: "The Gorge", year: "1994", image: theGorge },
  { title: "The Batman", year: "2022", image: theBatman },
];

const { width } = Dimensions.get("window");
const carouselWidth = width - 30;

export default function Recommend() {
  const navigation = useNavigation();

  const [activeMarks, setActiveMarks] = useState({});

  const handlePress = (name) => {
    setActiveMarks((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  return (
    <SafeAreaView style={[globalStyles.container, styles.mainContainer]}>
      <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.goBack()}>
        <Text style={styles.closeButton}>×</Text>
      </TouchableOpacity>

      <Carousel
        width={width}
        height={580}
        data={films}
        renderItem={({ index }) => (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate("Film", {
                title: films[index].title,
              })
            }
          >
            <View style={[styles.header, { width: carouselWidth }]}>
              <View style={styles.filmInfo}>
                <Text style={[globalStyles.textBase, styles.headerTitle]}>
                  {films[index].title}
                </Text>
                <Text style={[globalStyles.textBase, styles.headerYear]}>
                  {films[index].year}
                </Text>
              </View>
              <Image
                style={styles.filmImage}
                source={{ uri: films[index].image }}
              />
            </View>
          </TouchableOpacity>
        )}
      />

      <View style={styles.marks}>
        {marks.map((mark, index) => (
          <View key={index} style={styles.mark}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handlePress(mark.name)}
              key={mark.name}
            >
              <Icon
                name={activeMarks[mark.name] ? mark.activeImage : mark.image}
                size={50}
                color={activeMarks[mark.name] ? mark.colorActive : mark.color}
              />
            </TouchableOpacity>
            <Text style={[globalStyles.textBase, styles.markName]}>
              {mark.name}
            </Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = {
  mainContainer: {
    paddingHorizontal: 15,
  },

  header: {
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
  },

  closeButton: {
    fontSize: 30,
    color: "#D3D3D3",
    marginBottom: 10,
    alignSelf: "flex-end",
  },

  filmInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },

  headerTitle: {
    fontSize: 18,
  },

  headerYear: {
    fontSize: 18,
  },

  filmImage: {
    width: "100%",
    height: 530,
    borderRadius: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#D3D3D3",
  },

  marks: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },

  mark: {
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
  },

  markName: {
    fontSize: 14,
  },
};
