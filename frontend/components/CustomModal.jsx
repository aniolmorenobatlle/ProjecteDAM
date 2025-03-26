import React from "react";
import { Modal, View } from "react-native";

const CustomModal = ({ visible, onClose, children }) => (
  <Modal
    visible={visible}
    animationType="fade"
    transparent={true}
    onRequestClose={onClose}
  >
    <View style={styles.modalBackground}>
      <View style={styles.modalContainer}>{children}</View>
    </View>
  </Modal>
);

const styles = {
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  modalContainer: {
    width: "90%",
    backgroundColor: "#323048",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    elevation: 5, // Ombra en Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84, // Ombra en iOS
  },
};

export default CustomModal;
