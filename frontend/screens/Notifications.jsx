import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { globalStyles } from "../globalStyles";
import { API_URL } from "../config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { useUserInfo } from "../hooks/useUserInfo";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

export default function Notifications() {
  const navigation = useNavigation();
  const { userInfo, loading, error } = useUserInfo();

  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const response = await axios.get(
        `${API_URL}/api/users/requests/${userInfo.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setNotifications(
          Array.isArray(response.data.notifications)
            ? response.data.notifications
            : []
        );
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      alert("Error fetching notifications");
    }
  };

  const handleAccept = async (requestId, senderId) => {
    try {
      const token = await AsyncStorage.getItem("authToken");

      const response = await axios.post(
        `${API_URL}/api/users/accept-request/${requestId}`,
        {
          senderId: senderId,
          reciverId: userInfo.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) =>
            notification.request_id === requestId
              ? { ...notification, is_friend: true }
              : notification
          )
        );
      }
    } catch (error) {
      console.error("Error accepting request:", error);
      Alert.alert("Error", "Error accepting request");
    }
  };

  const handleDecline = async (requestId, sender_id) => {
    try {
      const token = await AsyncStorage.getItem("authToken");

      const response = await axios.post(
        `${API_URL}/api/users/reject-request/${requestId}`,
        {
          senderId: sender_id,
          reciverId: userInfo.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setNotifications((prevNotifications) =>
          prevNotifications.filter(
            (notification) => notification.request_id !== requestId
          )
        );
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
      Alert.alert("Error", "Error rejecting request");
    }
  };

  useEffect(() => {
    if (userInfo && userInfo.id) {
      fetchNotifications();
    }
  }, [userInfo]);

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
    <SafeAreaView style={[globalStyles.container]}>
      <View style={styles.header}>
        <Text style={[globalStyles.textBase, styles.headerTitle]}>
          Notifications
        </Text>
      </View>
      {notifications.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ color: "gray" }}>No notifications yet</Text>
        </View>
      ) : (
        <FlatList
          data={notifications.filter((item) => item.status !== "rejected")}
          keyExtractor={(item, index) =>
            item.request_id?.toString() || index.toString()
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate("UserProfile", { userId: item.sender_id })
              }
              style={styles.messageActivity}
            >
              <Image
                style={styles.avatar}
                source={{
                  uri: item?.avatar
                    ? `${item?.avatar}&nocache=true`
                    : `${API_URL}/api/users/${item?.sender_id}/avatar?nocache=true`,
                }}
              />

              <Text style={[globalStyles.textBase, styles.notificationText]}>
                <Text style={{ fontWeight: "bold" }}>{item.username}</Text>{" "}
                requested to follow you.
              </Text>

              {item.is_friend === false ? (
                <View style={styles.offerButtons}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() =>
                      handleAccept(item.request_id, item.sender_id)
                    }
                  >
                    <Text style={styles.accept}>Accept</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() =>
                      handleDecline(item.request_id, item.sender_id)
                    }
                  >
                    <Text style={styles.decline}>Decline</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.offerButtons}>
                  <Text style={styles.accepted}>Accepted</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.body}
          showsVerticalScrollIndicator={false}
        />
      )}
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

  accepted: {
    backgroundColor: "#E9A6A6",
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

  declined: {
    backgroundColor: "#8E4A65",
    color: "white",
    padding: 5,
    borderRadius: 5,
    textAlign: "center",
  },
};
