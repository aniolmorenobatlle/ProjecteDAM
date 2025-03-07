import { TextInput, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function InputLogin({ text, icon, type, value, onChange }) {
  return (
    <View style={styles.mainButton}>
      <Icon
        name={icon}
        size={30}
        style={styles.logo}
      />
      <TextInput
        style={styles.textInput}
        placeholder={text}
        placeholderTextColor="#fff"
        keyboardType={type === 'email-address' ? 'email-address' : 'default'}
        secureTextEntry={type === 'password'}
        autoCapitalize='none'
        value={value}
        onChangeText={onChange}
      />
    </View>
  );
}

const styles = {
  mainButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: 300,
    height: 50,
    backgroundColor: "rgba(196, 196, 196, 0.60)",
    borderRadius: 20,
    paddingHorizontal: 10,
  },

  logo: {
    marginRight: 10,
    color: "#fff",
    opacity: 0.5
  },

  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#fff",
    opacity: 0.7,
    backgroundColor: "transparent",
    paddingVertical: 0,
  }
}
