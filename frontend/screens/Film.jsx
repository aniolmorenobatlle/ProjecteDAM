import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Image, ImageBackground, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from 'react-native-vector-icons/Ionicons';
import { globalStyles } from "../globalStyles";

const thebatmanBackground = "https://image.tmdb.org/t/p/w500/rvtdN5XkWAfGX6xDuPL6yYS2seK.jpg"
const thebatmanPoster = "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg"


const paulDano = "https://image.tmdb.org/t/p/w500/zEJJsm0z07EPNl2Pi1h67xuCmcA.jpg"
const zoeKravitz = "https://image.tmdb.org/t/p/w500/tiQ3TBSvU4YAyrWMmVk6MTrKBAi.jpg"
const robertPattinson = "https://image.tmdb.org/t/p/w500/8A4PS5iG7GWEAVFftyqMZKl3qcr.jpg"

import axios from "axios";
import appleTv from '../assets/sites/appletv.png';
import disneyPlus from '../assets/sites/disney-plus.png';
import max from '../assets/sites/max.png';
import netflix from '../assets/sites/netflix.png';
import primeVideo from '../assets/sites/prime.png';

const reviews = [
  { name: "David", image: robertPattinson, review: "The Batman is a great movie. I loved the action scenes and the plot. The actors were amazing and the soundtrack was perfect." },
  { name: "David", image: robertPattinson, review: "The Batman is a great movie. I loved the action scenes and the plot. The actors were amazing and the soundtrack was perfect." },
  { name: "David", image: robertPattinson, review: "The Batman is a great movie. I loved the action scenes and the plot. The actors were amazing and the soundtrack was perfect." },
  { name: "David", image: robertPattinson, review: "The Batman is a great movie. I loved the action scenes and the plot. The actors were amazing and the soundtrack was perfect." },
  { name: "David", image: robertPattinson, review: "The Batman is a great movie. I loved the action scenes and the plot. The actors were amazing and the soundtrack was perfect." }
]

export default function Film() {
  const route = useRoute();
  const { filmId } = route.params;
  const navigation = useNavigation();
  const [activeButton, setActiveButton] = useState("casts");
  const [movieDetails, setMovieDetails] = useState({});
  const [year, setYear] = useState('');
  const [casts, setCasts] = useState([]);
  const [director, setDirector] = useState({});

  const handleButtonPress = (buttonName) => {
    setActiveButton(buttonName);
  }

  const fetchMovieDetails = async () => {
    try {
      const response = await axios.get(`http://172.20.10.2:3000/api/movies/${filmId}`);
      setMovieDetails(response.data);

      const date = response.data.release_year;
      const year = date.split("-")[0];
      setYear(year);
    } catch (error) {
      console.error("Error obtenint les dades de la pel·lícula: " + error);
    }
  }

  const fetchMovieDetailsCast = async () => {
    try {
      const response = await axios.get(`http://172.20.10.2:3000/api/movies/${filmId}/credits/cast`)
      const sortedCasts = response.data.cast.sort((a, b) => a.order - b.order);
      setCasts(sortedCasts);
    } catch (error) {
      console.error("Error obtenint els actors/actrius de la pel·lícula: " + error);
    }
  }

  const fetchMovieDetailsDirector = async () => {
    try {
      const response = await axios.get(`http://172.20.10.2:3000/api/movies/${filmId}/credits/director`)
      setDirector(response.data.crew[0]);
    } catch (error) {
      console.error("Error obtenint els actors/actrius de la pel·lícula: " + error);
    }
  }


  useEffect(() => {
    fetchMovieDetails();
    fetchMovieDetailsCast();
    fetchMovieDetailsDirector();
  }, [filmId])

  return (
    <ScrollView vertical={true} showsVerticalScrollIndicator={false} style={{ backgroundColor: "#1F1D36" }} contentContainerStyle={{ paddingBottom: 10}}>
      <ImageBackground source={{ uri: movieDetails.cover }} style={styles.imageBackground}>
        <SafeAreaView style={styles.overlay}>
          <View style={styles.backButton}>
            <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.goBack()}>
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ImageBackground>

      <SafeAreaView style={[globalStyles.container, styles.mainContainer]}>
        <View style={styles.filmHeader}>
          <View style={styles.bodyLeft}>
            <Image style={styles.poster} source={{ uri: movieDetails.poster }} />
            <View style={styles.buttons}>
              <View style={styles.button}>
                <Icon name="duplicate-outline" size={20} style={styles.buttonImage} />
                <Text style={[globalStyles.textBase, styles.buttonText]}>Rate</Text>
              </View>
              <View style={styles.button}>
                <Icon name="list-outline" size={20} style={styles.buttonImage} />
                <Text style={[globalStyles.textBase, styles.buttonText]}>Add to Lists</Text>
              </View>
              <View style={styles.button}>
                <Icon name="document-outline" size={20} style={styles.buttonImage} />
                <Text style={[globalStyles.textBase, styles.buttonText]}>Add to Watchlist</Text>
              </View>
            </View>
          </View>

          <View style={styles.bodyRight}>
            <View style={styles.textContainer}>
              <Text style={[globalStyles.textBase, styles.filmTitle]}>
                {movieDetails.title}{" "}
                <Text style={styles.filmYear}>
                  {year}
                </Text>
              </Text>
              <Text style={[globalStyles.textBase, styles.filmDirector]}>
                Directed by <Text style={{ fontWeight: "bold" }}>{director?.name}</Text>
              </Text>
            </View>
            <View style={styles.description}>
              <Text style={[globalStyles.textBase, styles.descriptionText]} numberOfLines={10}>
                {movieDetails.synopsis}
              </Text>
            </View>
          </View>  
        </View>

        <View style={styles.castContainer}>
          <View style={styles.buttonOptions}>
            <TouchableOpacity
              activeOpacity={1}
              style={[styles.buttonCast, activeButton === 'casts' && styles.buttonCastActive]}
              onPress={() => handleButtonPress('casts')}
            >
              <Text style={[globalStyles.textBase, styles.buttonCastText]}>Casts</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={1}
              style={[styles.buttonCast, activeButton === 'watch' && styles.buttonCastActive]}
              onPress={() => handleButtonPress('watch')}
            >
              <Text style={[globalStyles.textBase, styles.buttonCastText]}>Watch</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {activeButton === "casts" && 
              <View style={styles.cast}>
                {casts.map((cast, index) => {
                  const nameParts = cast.name.split(" ");
                  const firstName = nameParts[0];
                  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

                  return (
                    <View key={index} style={{ flexDirection: "column", alignItems: "center" }}>
                      <Image style={styles.castImage} source={{ uri: cast.profile_path }} />
                      <View style={styles.castNameContainer}>
                        <Text style={[globalStyles.textBase, styles.castName]}>{firstName}</Text>
                        {lastName && <Text style={[globalStyles.textBase, styles.castName]}>{lastName}</Text>}
                      </View>
                    </View>
                  );
                })}
              </View>
            }

            {activeButton === "watch" && (
              <View style={{ flexDirection: "row", gap: 10 }}>
                <Image style={styles.streamingImage} source={netflix}/>
                <Image style={styles.streamingImage} source={primeVideo}/>
                <Image style={styles.streamingImage} source={disneyPlus}/>
                <Image style={styles.streamingImage} source={max}/>
                <Image style={styles.streamingImage} source={appleTv}/>
              </View>
            )}
          </ScrollView>
        </View>

        <View style={styles.reviews}>
          <View style={styles.reviewTitles}>
            <Text style={[globalStyles.textBase]}>All reviews</Text>
            <Text style={[globalStyles.textBase, styles.seeAll]}>See all</Text>
          </View>

          {reviews.map((review, index) => (
            <View key={index} style={styles.reviewContainer}>
              <View style={styles.reviewHeader}>
                <Image style={styles.reviewImageUser} source={{uri: review.image}}/>
                <Text style={[globalStyles.textBase, styles.reviewText]}>Review by <Text style={[globalStyles.textBase, styles.reviewTextUser]}>{review.name}</Text></Text>
              </View>
              <Text style={[globalStyles.textBase, styles.reviewResult]}>{review.review}</Text>
            </View>
          ))}
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = {
  imageBackground: {
    height: 300,
    width: '100%',
    justifyContent: 'flex-start',
  },

  overlay: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 15,
  },

  backButton: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -130,
  },

  backArrow: {
    color: "#fff",
    fontSize: 24,
  },

  mainContainer: {
    paddingHorizontal: 15,
  },

  filmHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15
  },

  bodyLeft: {
    flexDirection: "column",
    marginTop: -100,
    gap: 20
  },

  bodyRight: {
    flex: 1,
    flexDirection: "column",
    marginTop: -10,
    gap: 15
  },

  poster: {
    width: 150,
    height: 200,
    borderRadius: 10,
  },

  filmTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },

  filmYear: {
    fontSize: 14,
    fontWeight: "normal",
    color: "#aaa",
  },

  filmDirector: {
    fontSize: 12,
    marginTop: 5
  },

  body: {
    flex: 1,
    flexDirection: "row",
  },

  buttons: {
    flex: 1,
    flexDirection: "column",
  },

  button: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#E9A6A6",
    width: 150,
    height: 40,
    borderRadius: 10,
  },

  buttonImage: {
    marginLeft: 10,
  },

  buttonText: {
    marginLeft: 8,
    color: "#000",
    fontSize: 12,
  },

  description: {
    flex: 1,
  },
  
  descriptionText: {
    fontSize: 14,
    color: "#fff",
    textAlign: "justify",
  },

  castContainer: {
    marginTop: 20,
  },

  castNameContainer: {
    marginTop: 5,
    alignItems: "center",
  },

  castName: {
    fontSize: 10
  },

  streamingImage: {
    width: 60,
    height: 60,
    objectFit: "contain",
  },

  buttonOptions: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },

  buttonCastActive: {
    width: 70,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#9C4A8B",
    padding: 8,
    borderRadius: 20,
  },

  buttonCast: {
    width: 70,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#323048",
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#fff",
    borderColor: "rgba(255, 255, 255, 0.5)",
  },

  buttonCastText: {
    fontSize: 14,
  },

  cast: {
    flexDirection: "row",
    gap: 15
  },

  castImage: {
    width: 60,
    height: 60,
    borderRadius: 50,
  },

  reviews: {
    marginTop: 20,
  },

  reviewTitles: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  seeAll: {
    fontSize: 14,
    color: "#E9A6A6",
  },

  reviewContainer: {
    marginTop: 10,
    backgroundColor: "#323048",
    borderRadius: 10,
    padding: 10,
  },

  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  reviewImageUser: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },

  reviewText: {
    color: "rgba(255, 255, 255, 0.5)",
    marginLeft: 10,
    fontSize: 12
  },

  reviewTextUser: {
    color: "#E9A6A6",
    opacity: 1,
    fontSize: 12
  },

  reviewResult: {
    color: "#fff",
    marginLeft: 60,
    fontSize: 14,
    marginTop: -8,
  }
};
