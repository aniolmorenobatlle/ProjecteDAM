import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect, useState } from "react";

const API_URL = "http://172.20.10.2:3000";

export const useUserInfo = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUserInfo = async () => {
      const token = await AsyncStorage.getItem("authToken");

      try {
        const response = await axios.get(`${API_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserInfo(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error en obtenir les dades de l'usuari: ", err);
        setError(err);
        setLoading(false);
      }
    };

    getUserInfo();
  }, []);

  return { userInfo, loading, error };
};
