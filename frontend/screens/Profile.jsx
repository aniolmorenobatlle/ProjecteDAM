import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { globalStyles } from "../globalStyles";
import { useUserInfo } from "../hooks/useUserInfo";
import CustomModalize from "./ProfileScreen/CustomModalize";
import FirstTabModalize from "./ProfileScreen/FirstTabModalize";
import MainProfile from "./ProfileScreen/MainProfile";
import SecondTabModalize from "./ProfileScreen/SecondTabModalize";

export default function Profile({ setIsModalizeOpen }) {
  const { userInfo, loading, error } = useUserInfo();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalizeRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [newName, setNewName] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [poster, setPoster] = useState(userInfo?.poster);
  const [favorites, setFavorites] = useState([]);
  const [filledFavorites, setFilledFavorites] = useState([]);

  useEffect(() => {
    if (userInfo) {
      setNewName(userInfo.name);
      setNewUsername(userInfo.username);
      setPoster(userInfo.poster);
    }
  }, [userInfo]);

  const openModalize = () => {
    modalizeRef.current?.open();
    setIsModalOpen(true);
    setIsModalizeOpen(true);
  };

  if (loading)
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
    <View style={[globalStyles.container, { flex: 1 }]}>
      <MainProfile
        setIsModalizeOpen={setIsModalizeOpen}
        userInfo={userInfo}
        openModalize={openModalize}
        poster={poster}
        isModalOpen={isModalOpen}
      />

      <CustomModalize
        modalizeRef={modalizeRef}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        setIsModalizeOpen={setIsModalizeOpen}
        userInfo={userInfo}
        setIndex={setIndex}
        title="Edit your Profile"
      >
        {index === 0 ? (
          <FirstTabModalize
            userInfo={userInfo}
            newName={newName}
            setNewName={setNewName}
            newUsername={newUsername}
            setNewUsername={setNewUsername}
            poster={poster}
            filledFavorites={filledFavorites}
            setFavorites={setFavorites}
            setIndex={setIndex}
          />
        ) : (
          <SecondTabModalize
            userInfo={userInfo}
            selectedPoster={selectedPoster}
            setSelectedPoster={setSelectedPoster}
            setPoster={setPoster}
            setIndex={setIndex}
          />
        )}
      </CustomModalize>
    </View>
  );
}
