import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { globalStyles } from "../globalStyles";

const paulDano = "https://image.tmdb.org/t/p/w500/zEJJsm0z07EPNl2Pi1h67xuCmcA.jpg"
const zoeKravitz = "https://image.tmdb.org/t/p/w500/tiQ3TBSvU4YAyrWMmVk6MTrKBAi.jpg"
const robertPattinson = "https://image.tmdb.org/t/p/w500/8A4PS5iG7GWEAVFftyqMZKl3qcr.jpg"

const friendsActivity = [
  { avatar: paulDano, text: "Paul added The Batman to the watchlist", time: "1h" },
  { avatar: robertPattinson, text: "Robert added The Batman to the watchlist", time: "2h" },
  { avatar: zoeKravitz, text: "Zoe added The Batman to the watchlist", time: "3h" },
  { avatar: paulDano, text: "Paul added The Batman to the watchlist", time: "1h" },
  { avatar: robertPattinson, text: "Robert added The Batman to the watchlist", time: "2h" },
  { avatar: zoeKravitz, text: "Zoe added The Batman to the watchlist", time: "3h" },
  { avatar: paulDano, text: "Paul added The Batman to the watchlist", time: "1h" },
  { avatar: robertPattinson, text: "Robert added The Batman to the watchlist", time: "2h" },
  { avatar: zoeKravitz, text: "Zoe added The Batman to the watchlist", time: "3h" },
  { avatar: paulDano, text: "Paul added The Batman to the watchlist", time: "1h" },
  { avatar: robertPattinson, text: "Robert added The Batman to the watchlist", time: "2h" },
  { avatar: zoeKravitz, text: "Zoe added The Batman to the watchlist", time: "3h" },
  { avatar: paulDano, text: "Paul added The Batman to the watchlist", time: "1h" },
  { avatar: robertPattinson, text: "Robert added The Batman to the watchlist", time: "2h" },
  { avatar: zoeKravitz, text: "Zoe added The Batman to the watchlist", time: "3h" },
  { avatar: paulDano, text: "Paul added The Batman to the watchlist", time: "1h" },
  { avatar: robertPattinson, text: "Robert added The Batman to the watchlist", time: "2h" },
  { avatar: zoeKravitz, text: "Zoe added The Batman to the watchlist", time: "3h" },
  { avatar: paulDano, text: "Paul added The Batman to the watchlist", time: "1h" },
  { avatar: robertPattinson, text: "Robert added The Batman to the watchlist", time: "2h" },
  { avatar: zoeKravitz, text: "Zoe added The Batman to the watchlist", time: "3h" },
  { avatar: paulDano, text: "Paul added The Batman to the watchlist", time: "1h" },
  { avatar: robertPattinson, text: "Robert added The Batman to the watchlist", time: "2h" },
  { avatar: zoeKravitz, text: "Zoe added The Batman to the watchlist", time: "3h" },
  { avatar: paulDano, text: "Paul added The Batman to the watchlist", time: "1h" },
  { avatar: robertPattinson, text: "Robert added The Batman to the watchlist", time: "2h" },
  { avatar: zoeKravitz, text: "Zoe added The Batman to the watchlist", time: "3h" },
];

const chatActivity = [
  { avatar: paulDano, name: "Paul Dano", message: "Hey, have you seen The Batman?", time: "1h" },
  { avatar: robertPattinson, name: "Robert Pattinson", message: "Do you want to see some movie?", time: "2h" },
  { avatar: zoeKravitz, name: "Zoe Kravitz", message: "I'm going to watch The Batman tonight", time: "3h" },
  { avatar: paulDano, name: "Paul Dano", message: "Hey, have you seen The Batman?", time: "1h" },
  { avatar: robertPattinson, name: "Robert Pattinson", message: "Do you want to see some movie?", time: "2h" },
  { avatar: zoeKravitz, name: "Zoe Kravitz", message: "I'm going to watch The Batman tonight", time: "3h" },
  { avatar: paulDano, name: "Paul Dano", message: "Hey, have you seen The Batman?", time: "1h" },
  { avatar: robertPattinson, name: "Robert Pattinson", message: "Do you want to see some movie?", time: "2h" },
  { avatar: zoeKravitz, name: "Zoe Kravitz", message: "I'm going to watch The Batman tonight", time: "3h" },
  { avatar: paulDano, name: "Paul Dano", message: "Hey, have you seen The Batman?", time: "1h" },
  { avatar: robertPattinson, name: "Robert Pattinson", message: "Do you want to see some movie?", time: "2h" },
  { avatar: zoeKravitz, name: "Zoe Kravitz", message: "I'm going to watch The Batman tonight", time: "3h" },
  { avatar: paulDano, name: "Paul Dano", message: "Hey, have you seen The Batman?", time: "1h" },
  { avatar: robertPattinson, name: "Robert Pattinson", message: "Do you want to see some movie?", time: "2h" },
  { avatar: zoeKravitz, name: "Zoe Kravitz", message: "I'm going to watch The Batman tonight", time: "3h" },
  { avatar: paulDano, name: "Paul Dano", message: "Hey, have you seen The Batman?", time: "1h" },
  { avatar: robertPattinson, name: "Robert Pattinson", message: "Do you want to see some movie?", time: "2h" },
  { avatar: zoeKravitz, name: "Zoe Kravitz", message: "I'm going to watch The Batman tonight", time: "3h" },
  { avatar: paulDano, name: "Paul Dano", message: "Hey, have you seen The Batman?", time: "1h" },
  { avatar: robertPattinson, name: "Robert Pattinson", message: "Do you want to see some movie?", time: "2h" },
  { avatar: zoeKravitz, name: "Zoe Kravitz", message: "I'm going to watch The Batman tonight", time: "3h" },
  { avatar: paulDano, name: "Paul Dano", message: "Hey, have you seen The Batman?", time: "1h" },
  { avatar: robertPattinson, name: "Robert Pattinson", message: "Do you want to see some movie?", time: "2h" },
  { avatar: zoeKravitz, name: "Zoe Kravitz", message: "I'm going to watch The Batman tonight", time: "3h" },
]

export default function Notifications() {
  const [activeButton, setActiveButton] = React.useState("friends");

  const handleButtonPress = (buttonName) => {
    setActiveButton(buttonName);
  }

  return (
    <SafeAreaView style={[globalStyles.container, styles.mainContainer]}>
      <View style={styles.header}>
        <Text style={[globalStyles.textBase, styles.headerTitle]}>Notifications</Text>
      </View>

      <View style={styles.superiorNav}>
        <TouchableOpacity 
          activeOpacity={0.8} 
          style={[styles.navButton, activeButton === "friends" ? styles.navButtonActive : {}]}
          onPress={() => handleButtonPress("friends")}
        >
          <Text style={[globalStyles.textBase, styles.superiorNavTitle]}>Friends activity</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          activeOpacity={0.8} 
          style={[styles.navButton, activeButton === "chat" ? styles.navButtonActive : {}]}
          onPress={() => handleButtonPress("chat")}
        >
          <Text style={[globalStyles.textBase, styles.superiorNavTitle]}>Chat</Text>
        </TouchableOpacity>
      </View>

      {activeButton === "friends" && (
        <ScrollView vertical={true} style={styles.body}>
          {friendsActivity.map((activity, index) => (
            <View key={index} style={styles.messageActivity}>
              <Image style={styles.avatar} source={{uri: activity.avatar}} />
              <Text style={[globalStyles.textBase, styles.notificationText]}>{activity.text}</Text>
              <Text style={[globalStyles.textBase, styles.notificationTime]}>{activity.time}</Text>
            </View>
          ))}
        </ScrollView>
      )}

      {activeButton === "chat" && (
        <ScrollView vertical={true} style={styles.body}>
        {chatActivity.map((activity, index) => (
          <View key={index} style={styles.messageActivity}>
            <Image style={styles.avatar} source={{uri: activity.avatar}} />
            <View style={styles.chatTexts}>
              <Text style={[globalStyles.textBase, styles.chatTextUser]}>{activity.name}</Text>
              <Text style={[globalStyles.textBase, styles.chatTextMessage]}>{activity.message}</Text>
            </View>
            <Text style={[globalStyles.textBase, styles.notificationTime]}>{activity.time}</Text>
          </View>
        ))}
      </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = {
  mainContainer: {
    paddingHorizontal: 15,
  },

  header: {
    alignItems: "center",
    paddingBottom: 10,
  },

  headerTitle: {
    fontSize: 25,
    fontWeight: "bold",
  },

  superiorNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
    alignItems: "center",
    width: "100%",
  },

  navButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },

  navButtonActive: {
    backgroundColor: "#9C4A8B",
  },

  superiorNavTitle: {
    fontSize: 18,
    textAlign: "center",
  },

  body: {
    marginHorizontal: -15,
  },

  messageActivity: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    alignItems: "center",
    backgroundColor: "#323048",
    borderTopWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },

  notificationText: {
    flex: 1,
    paddingLeft: 10,
    fontSize: 14,
  },

  chatTexts: {
    flex: 1,
    paddingLeft: 10,
  },

  chatTextUser: {
    fontSize: 16,
    fontWeight: "bold",
  },

  chatTextMessage: {
    fontSize: 12,
  },

  notificationTime: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.5)",
    paddingLeft: 10,
  },
};

