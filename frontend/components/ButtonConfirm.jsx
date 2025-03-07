import { Text, View } from 'react-native';


export default function ButtonConfirm({ text }) {
  return (
    <View style={styles.mainButton}>   
      <Text style={styles.text}>{ text }</Text>
    </View>
  );
}

const styles = {
  mainButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 100,
    height: 50,
    backgroundColor: "#E9A6A6",
    borderRadius: 30,
  },

  text: {
    fontSize: 16,
    color: "#000",
  }
}
