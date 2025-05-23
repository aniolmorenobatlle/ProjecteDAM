import { useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Sidebar from "../components/Sidebar";
import { globalStyles } from "../globalStyles";
import { useUserInfo } from "../hooks/useUserInfo";
import Header from "./Home/Header";
import TrendingMovies from "./Home/TrendingMovies";
import Favorites from "./Home/Favorites";

export default function Home() {
  const { userInfo, loading, error } = useUserInfo();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (loading) {
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
  }

  if (error) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#1F1D36",
        }}
      >
        <Text style={{ color: "white", fontSize: 16 }}>
          {error?.message === "401"
            ? "Unauthorized: Redirecting to login..."
            : `Error: ${error?.message || "Error desconegut"}`}
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[globalStyles.container, styles.mainContainer]}>
      <Sidebar
        isOpen={isSidebarOpen}
        closeMenu={() => setIsSidebarOpen(false)}
      />

      <Header onMenuPress={() => setIsSidebarOpen(true)} userInfo={userInfo} />

      <ScrollView
        style={globalStyles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.main}>
          <View>
            <Text style={[globalStyles.textBase, styles.welcomeback]}>
              Hello,{" "}
              <Text style={styles.welcomebackUser}>
                {userInfo.name.split(" ")[0]}
              </Text>
              !
            </Text>
            <Text style={[globalStyles.textBase, styles.newToday]}>
              See what's new today!
            </Text>
          </View>

          <TrendingMovies />

          <Favorites userInfo={userInfo} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = {
  mainContainer: {
    paddingHorizontal: 15,
  },

  main: {
    gap: 20,
    justifyContent: "center",
  },

  welcomeback: {
    fontSize: 25,
    fontWeight: "bold",
  },

  welcomebackUser: {
    color: "#E9A6A6",
  },

  newToday: {
    fontSize: 15,
    marginTop: 5,
  },
};
