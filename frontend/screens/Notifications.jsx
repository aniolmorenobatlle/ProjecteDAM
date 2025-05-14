import { FlatList, Image, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { globalStyles } from "../globalStyles";

const paulDano =
  "https://image.tmdb.org/t/p/w500/zEJJsm0z07EPNl2Pi1h67xuCmcA.jpg";

const notifications = Array.from({ length: 100 }, (_, i) => ({
  id: (i + 1).toString(),
  username: `user${i + 1}`,
  message: "requested to follow you.",
  avatar: paulDano,
}));

export default function Notifications() {
  return (
    <SafeAreaView style={[globalStyles.container]}>
      <View style={styles.header}>
        <Text style={[globalStyles.textBase, styles.headerTitle]}>
          Notifications
        </Text>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.messageActivity}>
            <Image style={styles.avatar} source={{ uri: item.avatar }} />
            <Text style={[globalStyles.textBase, styles.notificationText]}>
              <Text style={{ fontWeight: "bold" }}>{item.username}</Text>{" "}
              {item.message}
            </Text>
            <View style={styles.offerButtons}>
              <Text style={styles.accept}>Accept</Text>
              <Text style={styles.decline}>Decline</Text>
            </View>
          </View>
        )}
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = {
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

  messageActivity: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    alignItems: "center",
    // backgroundColor: "#323048",
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

  offerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    paddingLeft: 10,
  },

  accept: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: 5,
    borderRadius: 5,
    textAlign: "center",
  },

  decline: {
    backgroundColor: "#F44336",
    color: "white",
    padding: 5,
    borderRadius: 5,
    textAlign: "center",
  },
};
