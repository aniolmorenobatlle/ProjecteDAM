import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "../config";

export const useUserInfo = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unauthenticated, setUnauthenticated] = useState(false);

  useEffect(() => {
    const getUserInfo = async () => {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        setUnauthenticated(true);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserInfo(response.data);
      } catch (error) {
        if (error.response?.status === 401) {
          await AsyncStorage.removeItem("authToken");
          setUnauthenticated(true);
        }
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    getUserInfo();
  }, []);

  return { userInfo, loading, error, unauthenticated };
};
