import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from 'react-native-vector-icons/Ionicons';
import Sidebar from '../components/Sidebar';
import { globalStyles } from "../globalStyles";


const theGorge = "https://image.tmdb.org/t/p/w500/7iMBZzVZtG0oBug4TfqDb9ZxAOa.jpg"
const theBatman = "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg"
const babyDriver = "https://image.tmdb.org/t/p/w500/dN9LbVNNZFITwfaRjl4tmwGWkRg.jpg"
const avatar = "https://image.tmdb.org/t/p/w500/6EiRUJpuoeQPghrs3YNktfnqOVh.jpg"

const movies = [
  { name: "The Batman", image: theBatman, year: 2022, duration: "175 min" },
  { name: "The Gorge", image: theGorge, year: 2025, duration: "127 min" },
  { name: "Avatar", image: avatar, year: 2009, duration: "162 min" },
  { name: "Baby Driver", image: babyDriver, year: 2017, duration: "113 min" },
]

export default function Home() {
  const navigation = useNavigation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [name, setName] = useState('')
  const [image, setImage] = useState('')
  const [films, setFilms] = useState([])

  const getUserInfo = async () => {
    const token = await AsyncStorage.getItem('authToken')
  
    try {
      const respose = await axios.get('http://172.20.10.2:3000/api/users/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const name = respose.data.name.split(" ")[0]
    
      setName(name)
      setImage(respose.data.image)
  
      return respose.data
      
    } catch (error) {
      console.error("Errror en obtenir les dades del usuari: " + error)
    }
  }

  const getPopularFilms = async () => {
    try {
      const storedMovies = await AsyncStorage.getItem("popularMovies");
  
      if (storedMovies) {
        setFilms(JSON.parse(storedMovies));
        return;
      }
  
      let allMovies = [];
  
      for (let page = 1; page <= 501; page++) {
        const response = await axios.get(`http://172.20.10.2:3000/api/movies?page=${page}`);
        const movies = response.data.movies;
  
        // Evitar repeticions
        movies.forEach(movie => {
          if (!allMovies.some(existingMovie => existingMovie.id === movie.id || existingMovie.name === movie.name)) {
            allMovies.push(movie);
          }
        });
      }
  
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
  
      // Filtrar pel·lícules de l'últim mes
      const filteredMovies = allMovies.filter(movie => {
        const releaseDate = new Date(movie.release_year);
        return !isNaN(releaseDate.getTime()) && releaseDate >= lastMonth;
      });
  
      // Ordenar per popularitat
      const sortedMovies = filteredMovies.sort((a, b) => b.vote_average - a.vote_average);
  
      // Seleccionar les 5 més populars
      const topMovies = sortedMovies.slice(0, 5);
      setFilms(topMovies);
  
      // Guardar en AsyncStorage perquè no es carregui de nou
      await AsyncStorage.setItem("popularMovies", JSON.stringify(topMovies));
    } catch (error) {
      console.error("Error en obtenir les pel·lícules populars: " + error);
    }
  };
  
  useEffect(() => {
    getUserInfo();
    getPopularFilms();
  }, []);  
  
  return (
    <SafeAreaView style={[globalStyles.container, styles.mainContainer]}>
      <Sidebar isOpen={isSidebarOpen} closeMenu={() => setIsSidebarOpen(false)} />

      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.8} onPress={() => setIsSidebarOpen(true)}>
          <Icon name="menu" size={50} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          {image ? <Image style={styles.menuIconAvatar} source={{ uri: image }} /> : <Icon name="person-circle-outline" size={50} style={styles.menuIconAvatarNone} />}
        </TouchableOpacity>
      </View>

      <ScrollView style={globalStyles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.main}>

          <View>
            <Text style={[globalStyles.textBase, styles.welcomeback]}>
              Hello, <Text style={styles.welcomebackUser}>{name}</Text>!
            </Text>

            <Text style={[globalStyles.textBase, styles.newToday]}>
              See what's new today!  
            </Text>
          </View>

          <View style={styles.latest}>
            <Text style={[globalStyles.textBase, styles.latestTitle]}>Popular this month</Text>

            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              <View style={styles.latestFilms}>
                {films.map((film, index) => ( 
                  <View key={index} style={styles.filmsCard}>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('Film', { filmId: film.id })}>
                      <Image style={styles.filmCardImage} source={{ uri: film.cover }} />
                    </TouchableOpacity>
                    <Text style={[globalStyles.textBase, styles.filmCardName]}>{film.name}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>

          <View style={styles.latest}>
            <Text style={[globalStyles.textBase, styles.latestTitle]}>Favorite</Text>

            <View style={styles.favoriteFilms}>
              {movies.map((film, index) => (
                <TouchableOpacity key={index} activeOpacity={0.8} onPress={() => navigation.navigate('Film', { film })}>
                <View key={index} style={styles.favoriteCard}>
                  <Image style={styles.favoriteCardImage} source={{uri: film.image}} /> 
                  <View style={styles.favoriteCardInfo}> 
                    <Text style={[globalStyles.textBase, styles.favoriteCardInfoTitle]}>{film.name}</Text> 
                    <Text style={[globalStyles.textBase, styles.favoriteCardInfoYear]}>{film.year}</Text> 
                    <View style={styles.favoriteCardInfoDuration}>
                      <Icon name="time-outline" color="white" size={20} style={styles.favoriteCardInfoDurationClock} />
                      <Text style={[globalStyles.textBase, styles.favoriteCardInfoDurationText]}>{film.duration}</Text> 
                    </View> 
                  </View> 
                </View>
                </TouchableOpacity>
              ))} 
            </View>
          </View>
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
    paddingBottom: 10,
  },

  menuIconAvatar: {
    width: 50,
    height: 50,
    borderRadius: "50%",
    borderWidth: 1,
    borderColor: 'white',
  },

  menuIconAvatarNone: {
    color: "white",
    width: 50,
    height: 50,
  },

  main: {
    justifyContent: "center",
  },

  welcomeback: {
    fontSize: 25,
    fontWeight: "bold",
    marginTop: 20,
  },

  welcomebackUser: {
    color: "#E9A6A6",
  },

  newToday: {
    fontSize: 15,
    marginTop: 5,
  },

  latest: {
    marginTop: 20,
  },

  latestTitle: {
    fontSize: 22,
    fontWeight: "bold",
    paddingBottom: 10,
  },

  latestFilms: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
    height: 280
  },

  filmCardImage: {
    height: 225,
    width: 150,
    borderRadius: 10,
  },

  filmCardName: {
    fontSize: 14,
    marginTop: 10,
    width: 150,
  },

  favoriteCard: {
    flexDirection: "row",
    borderRadius: 10,
    backgroundColor: "#2c2942",
    padding: 15,
    paddingLeft: 20,
    borderRadius: 25,
    marginBottom: 10,
  },

  favoriteCardImage: {
    height: 120,
    width: 90,
    borderRadius: 10,
  },

  favoriteCardInfo: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    marginLeft: 15,
  },

  favoriteCardInfoTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },

  favoriteCardInfoYear: {
    fontSize: 14,
    fontWeight: "semibold",
    color: "#aba9b3",
  },

  favoriteCardInfoDuration: {
    flexDirection: "row",
    alignItems: "center",
  },

  favoriteCardInfoDurationClock: {
    marginRight: 5,
  },

  favoriteCardInfoDurationText: {
    fontSize: 14,
    fontWeight: "semibold",
  },
};
