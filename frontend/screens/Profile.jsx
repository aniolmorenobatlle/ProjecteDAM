import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Modalize } from "react-native-modalize";
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
  { title: "Watchlist", number: 10 },
  { title: "Watched", number: 30 },
  { title: "Films", number: 330 },
  { title: "Reviews", number: 30 },
  { title: "Likes", number: 302 },
  { title: "Friends", number: 5 },
];

const favorites = [
  { image: theBatman },
  { image: avatar },
  { image: babyDriver },
];

const maxFavorites = 4;
const filledFavorites = [
  ...favorites,
  ...Array(maxFavorites - favorites.length).fill(null),
];

export default function Profile({ setIsModalizeOpen }) {
  const { userInfo, loading, error } = useUserInfo();
  const [showLoading, setShowLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalizeRef = useRef(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowLoading(false);
    }, 200);

    return () => clearTimeout(timeout);
  }, []);

  const userInfoModalize = userInfo
    ? [
        { title: "Full Name", result: userInfo.name, editable: "true" },
        { title: "Username", result: userInfo.username, editable: "true" },
        { title: "Email", result: userInfo.email, editable: "false" },
        {
          title: "Avatar",
          result: userInfo.avatar,
          editable: "true",
          image: "true",
        },
      ]
    : [];

  const openModalize = () => {
    modalizeRef.current?.open();
    setIsModalOpen(true);
    setIsModalizeOpen(true);
  };

  if (loading || showLoading)
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
        <Text style={{ color: "white" }}>Error: {error}</Text>
      </View>
    );

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={[globalStyles.container, styles.mainContainer]}
      scrollEnabled={!isModalOpen}
    >
      <Image source={{ uri: userInfo.poster }} style={styles.backgroundImage} />

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={openModalize}
        style={styles.editProfile}
      >
        <Icon name="cog-outline" size={40} />
      </TouchableOpacity>

      <Modalize
        modalStyle={styles.modalize}
        ref={modalizeRef}
        onOpened={() => {
          setIsModalizeOpen(true);
          setIsModalOpen(true);
        }}
        onClosed={() => {
          setIsModalizeOpen(false);
          setIsModalOpen(false);
        }}
      >
        <View style={styles.panelContent}>
          <View>
            <Text style={styles.profileTitle}>Profile</Text>

            <View style={styles.longLine}></View>

            <View
              style={styles.listInfoContainer}
              contentContainerStyle={{ alignItems: "center" }}
            >
              {userInfoModalize.map((info, index) => (
                <View key={index} style={{ width: "100%" }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <Text style={[globalStyles.textBase, styles.listInfoTitle]}>
                      {info.title}
                    </Text>

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 5,
                      }}
                    >
                      {info.image === "true" ? (
                        <Image
                          source={{ uri: info.result }}
                          style={{
                            width: 50,
                            height: 50,
                            borderRadius: 50,
                          }}
                        />
                      ) : (
                        <Text
                          style={[globalStyles.textBase, styles.listInfoResult]}
                        >
                          {info.result}
                        </Text>
                      )}

                      {info.editable === "true" && (
                        <Icon
                          name="chevron-forward-outline"
                          size={15}
                          color="rgba(255, 255, 255, 0.7)"
                        />
                      )}
                    </View>
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
              ))}
            </View>
          </View>

          <View>
            <Text style={styles.posterTitle}>Poster</Text>

            <View style={styles.longLine}></View>

            <View style={styles.posterContainer}>
              <Image
                source={{ uri: userInfo.poster }}
                style={styles.posterImage}
              />
              <Icon
                name="swap-horizontal-outline"
                size={30}
                style={styles.posterImageSwitch}
              />
            </View>
          </View>

          <View>
            <Text style={styles.favoriteTitle}>Favorite Films Of All Time</Text>

            <View style={styles.longLine}></View>

            <View style={styles.favoritesContainer}>
              <View style={styles.favorites}>
                {filledFavorites.map((favorite, index) => (
                  <View key={index} style={styles.favoriteFilmContainer}>
                    {favorite ? (
                      <View>
                        <Icon
                          name="close-outline"
                          size={20}
                          style={styles.favoriteFilmDelete}
                        />
                        <Image
                          style={styles.favoritesImage}
                          source={{ uri: favorite.image }}
                        />
                      </View>
                    ) : (
                      <View style={styles.noFavorite}>
                        <Icon
                          name="add-outline"
                          size={35}
                          style={styles.noFavoriteIcon}
                        />
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </View>
          </View>

          <View>
            <Text style={styles.favoriteTitle}>Favorite Films Of All Time</Text>

            <View style={styles.longLine}></View>

            <View style={styles.favoritesContainer}>
              <View style={styles.favorites}>
                {filledFavorites.map((favorite, index) => (
                  <View key={index} style={styles.favoriteFilmContainer}>
                    {favorite ? (
                      <View>
                        <Icon
                          name="close-outline"
                          size={20}
                          style={styles.favoriteFilmDelete}
                        />
                        <Image
                          style={styles.favoritesImage}
                          source={{ uri: favorite.image }}
                        />
                      </View>
                    ) : (
                      <View style={styles.noFavorite}>
                        <Icon
                          name="add-outline"
                          size={35}
                          style={styles.noFavoriteIcon}
                        />
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
      </Modalize>

      <View style={styles.contentContainer}>
        <View style={styles.avatarContainer}>
          {userInfo.avatar ? (
            <Image style={styles.avatar} source={{ uri: userInfo.avatar }} />
          ) : (
            <Icon
              name="person-circle-outline"
              size={100}
              style={styles.menuIconAvatarNone}
            />
          )}
          <Text style={[globalStyles.textBase, styles.name]}>
            {" "}
            {userInfo.name}
          </Text>
          <Text style={[globalStyles.textBase, styles.username]}>
            @{userInfo.username}
          </Text>
        </View>

        <View style={styles.stats}>
          <View style={styles.statsContainer}>
            <Text style={[globalStyles.textBase, styles.statsTotalFilmsNumber]}>
              445
            </Text>
            <Text style={[globalStyles.textBase, styles.statsTotalFilms]}>
              Total Films
            </Text>
          </View>
          <View style={styles.statsContainer}>
            <Text
              style={[globalStyles.textBase, styles.statsTotalFilmsYearNumber]}
            >
              33
            </Text>
            <Text style={[globalStyles.textBase, styles.statsTotalFilms]}>
              Films This Year
            </Text>
          </View>
          <View style={styles.statsContainer}>
            <Text
              style={[globalStyles.textBase, styles.statsTotalReviewNumber]}
            >
              30
            </Text>
            <Text style={[globalStyles.textBase, styles.statsTotalFilms]}>
              Review
            </Text>
          </View>
        </View>

        <View style={styles.favoritesContainer}>
          <Text style={[globalStyles.textBase, styles.favoritesTitle]}>
            {userInfo.name.split(" ")[0]}'s Top Favorite Films
          </Text>

          <View style={styles.favorites}>
            <Image style={styles.favoritesImage} source={{ uri: theBatman }} />
            <Image style={styles.favoritesImage} source={{ uri: avatar }} />
            <Image style={styles.favoritesImage} source={{ uri: theGorge }} />
            <Image style={styles.favoritesImage} source={{ uri: babyDriver }} />
          </View>
        </View>

        <View style={styles.line}></View>

        <View contentContainerStyle={{ alignItems: "center" }}>
          {lists.map((list, index) => (
            <View key={index} style={{ width: "100%" }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Text style={[globalStyles.textBase, styles.listInfoTitle]}>
                  {list.title}
                </Text>
                <Text style={[globalStyles.textBase, styles.listInfoNumber]}>
                  {list.number}
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
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = {
  mainContainer: {
    flex: 1,
  },

  backgroundImage: {
    flex: 1,
    justifyContent: "center",
    height: 250,
    width: "100%",
  },

  editProfile: {
    position: "absolute",
    top: 50,
    right: 15,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 50,
  },

  modalize: {
    backgroundColor: "#1F1D36",
  },

  profileTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  posterTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  favoriteTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    paddingHorizontal: 20,
    paddingTop: 30,
  },

  longLine: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    marginTop: 5,
  },

  listInfoContainer: {
    padding: 20,
    paddingBottom: 0,
  },

  listInfoResult: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 16,
  },

  posterContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },

  posterImage: {
    height: 170,
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 10,
    borderRadius: 10,
    objectFit: "cover",
    opacity: 0.8,
  },

  posterImageSwitch: {
    position: "absolute",
    top: "42%",
    left: "45%",
    width: 40,
    height: 40,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 50,
    textAlign: "center",
    lineHeight: 40,
  },

  favoriteFilmDelete: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 25,
    height: 25,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 50,
    textAlign: "center",
    lineHeight: 25,
    zIndex: 1,
  },

  noFavorite: {
    width: 82,
    height: 130,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },

  noFavoriteIcon: {
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    lineHeight: 130,
  },

  contentContainer: {
    paddingHorizontal: 15,
    marginTop: 60,
  },

  avatarContainer: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: "50%",
    borderWidth: 2,
    borderColor: "white",
    position: "absolute",
    top: -110,
  },

  menuIconAvatarNone: {
    color: "white",
    position: "absolute",
    top: -110,
  },

  name: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#E9A6A6",
  },

  username: {
    fontSize: 12,
  },

  stats: {
    marginVertical: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 30,
  },

  statsContainer: {
    justifyContent: "center",
    alignItems: "center",
  },

  statsTotalFilmsNumber: {
    fontSize: 30,
    color: "#E9A6A6",
    fontWeight: "bold",
  },

  statsTotalFilmsYearNumber: {
    fontSize: 30,
    color: "#9C4A8B",
    fontWeight: "bold",
  },

  statsTotalReviewNumber: {
    fontSize: 30,
    color: "#9C4A8B",
    fontWeight: "bold",
  },

  statsTotalFilms: {
    fontSize: 12,
  },

  favoritesContainer: {
    alignItems: "center",
    paddingHorizontal: 15,
  },

  favoritesTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },

  favorites: {
    flexDirection: "row",
    marginVertical: 10,
    gap: 10,
    justifyContent: "space-between",
  },

  favoritesImage: {
    width: 82,
    height: 130,
    borderRadius: 10,
  },

  line: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginVertical: 20,
    marginHorizontal: -15,
  },

  shortLine: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginVertical: 10,
  },

  listInfoNumber: {
    color: "#9C4A8B",
  },
};
