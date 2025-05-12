import { Image, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { globalStyles } from "../globalStyles";

const paulDano =
  "https://image.tmdb.org/t/p/w500/zEJJsm0z07EPNl2Pi1h67xuCmcA.jpg";
const zoeKravitz =
  "https://image.tmdb.org/t/p/w500/tiQ3TBSvU4YAyrWMmVk6MTrKBAi.jpg";
const robertPattinson =
  "https://image.tmdb.org/t/p/w500/8A4PS5iG7GWEAVFftyqMZKl3qcr.jpg";

const friendsActivity = [
  {
    avatar: paulDano,
    text: "Paul added The Batman to the watchlist",
    time: "1h",
  },
  {
    avatar: robertPattinson,
    text: "Robert added The Batman to the watchlist",
    time: "2h",
  },
  {
    avatar: zoeKravitz,
    text: "Zoe added The Batman to the watchlist",
    time: "3h",
  },
  {
    avatar: paulDano,
    text: "Paul added The Batman to the watchlist",
    time: "1h",
  },
  {
    avatar: robertPattinson,
    text: "Robert added The Batman to the watchlist",
    time: "2h",
  },
  {
    avatar: zoeKravitz,
    text: "Zoe added The Batman to the watchlist",
    time: "3h",
  },
  {
    avatar: paulDano,
    text: "Paul added The Batman to the watchlist",
    time: "1h",
  },
  {
    avatar: robertPattinson,
    text: "Robert added The Batman to the watchlist",
    time: "2h",
  },
  {
    avatar: zoeKravitz,
    text: "Zoe added The Batman to the watchlist",
    time: "3h",
  },
  {
    avatar: paulDano,
    text: "Paul added The Batman to the watchlist",
    time: "1h",
  },
  {
    avatar: robertPattinson,
    text: "Robert added The Batman to the watchlist",
    time: "2h",
  },
  {
    avatar: zoeKravitz,
    text: "Zoe added The Batman to the watchlist",
    time: "3h",
  },
  {
    avatar: paulDano,
    text: "Paul added The Batman to the watchlist",
    time: "1h",
  },
  {
    avatar: robertPattinson,
    text: "Robert added The Batman to the watchlist",
    time: "2h",
  },
  {
    avatar: zoeKravitz,
    text: "Zoe added The Batman to the watchlist",
    time: "3h",
  },
  {
    avatar: paulDano,
    text: "Paul added The Batman to the watchlist",
    time: "1h",
  },
  {
    avatar: robertPattinson,
    text: "Robert added The Batman to the watchlist",
    time: "2h",
  },
  {
    avatar: zoeKravitz,
    text: "Zoe added The Batman to the watchlist",
    time: "3h",
  },
  {
    avatar: paulDano,
    text: "Paul added The Batman to the watchlist",
    time: "1h",
  },
  {
    avatar: robertPattinson,
    text: "Robert added The Batman to the watchlist",
    time: "2h",
  },
  {
    avatar: zoeKravitz,
    text: "Zoe added The Batman to the watchlist",
    time: "3h",
  },
  {
    avatar: paulDano,
    text: "Paul added The Batman to the watchlist",
    time: "1h",
  },
  {
    avatar: robertPattinson,
    text: "Robert added The Batman to the watchlist",
    time: "2h",
  },
  {
    avatar: zoeKravitz,
    text: "Zoe added The Batman to the watchlist",
    time: "3h",
  },
  {
    avatar: paulDano,
    text: "Paul added The Batman to the watchlist",
    time: "1h",
  },
  {
    avatar: robertPattinson,
    text: "Robert added The Batman to the watchlist",
    time: "2h",
  },
  {
    avatar: zoeKravitz,
    text: "Zoe added The Batman to the watchlist",
    time: "3h",
  },
];

export default function Notifications() {
  return (
    <SafeAreaView style={[globalStyles.container, styles.mainContainer]}>
      <View style={styles.header}>
        <Text style={[globalStyles.textBase, styles.headerTitle]}>
          Notifications
        </Text>
      </View>

      <ScrollView vertical={true} style={styles.body}>
        {friendsActivity.map((activity, index) => (
          <View key={index} style={styles.messageActivity}>
            <Image style={styles.avatar} source={{ uri: activity.avatar }} />
            <Text style={[globalStyles.textBase, styles.notificationText]}>
              {activity.text}
            </Text>
            <Text style={[globalStyles.textBase, styles.notificationTime]}>
              {activity.time}
            </Text>
          </View>
        ))}
      </ScrollView>
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

  notificationTime: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.5)",
    paddingLeft: 10,
  },
};
