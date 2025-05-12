import { React, useEffect } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Modalize } from "react-native-modalize";
import { screenHeight } from "../../config";

export default function CustomModalize({
  userInfo,
  modalizeRef,
  setIsModalOpen,
  setIsModalizeOpen,
  setIndex,
  children,
  title = "Edit your Profile",
}) {
  const handleClose = () => {
    modalizeRef.current?.close();
    setIsModalizeOpen(false);
    setIsModalOpen(false);
    setIndex(0);
  };

  // Desactiva console.error per aquesta pantalla
  useEffect(() => {
    const originalConsoleError = console.error;
    console.error = () => {};

    return () => {
      console.error = originalConsoleError;
    };
  }, []);

  return (
    <Modalize
      ref={modalizeRef}
      modalStyle={{ backgroundColor: "#1F1D36" }}
      modalHeight={screenHeight * 0.85}
      panGestureEnabled={false}
      onOpened={() => {
        setIsModalizeOpen(true);
        setIsModalOpen(true);
      }}
      onClosed={() => {
        setIsModalizeOpen(false);
        setIsModalOpen(false);
        setIndex(0);
      }}
      withHandle={false}
    >
      <View>
        <View style={styles.headerModal}>
          <TouchableOpacity
            style={styles.btnCloseContainer}
            activeOpacity={0.8}
            onPress={handleClose}
          >
            <Text style={styles.cancel}>Close</Text>
          </TouchableOpacity>
          <Text style={styles.searchFilm}>{title}</Text>
          {userInfo.avatar ? (
            <Image
              source={{ uri: `${userInfo.avatar}&nocache=true` }}
              style={styles.searchAvatar}
            />
          ) : (
            <Image
              source={{ uri: userInfo.avatar_binary }}
              style={styles.searchAvatar}
            />
          )}
        </View>

        {children}
      </View>
    </Modalize>
  );
}

const styles = {
  headerModal: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },

  cancel: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 16,
  },

  searchFilm: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  searchAvatar: {
    width: 35,
    height: 35,
    borderRadius: 50,
  },

  btnCloseContainer: {
    padding: 10,
  },
};
