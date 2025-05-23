import { View, Text, Image } from "react-native";

export default function WhereToWatch({ streaming }) {
  return (
    <View style={{ flexDirection: "row", gap: 10 }}>
      {streaming.length > 0 ? (
        streaming.map((streaming, index) => (
          <Image
            key={index}
            style={styles.streamingImage}
            source={{ uri: streaming.logo }}
          />
        ))
      ) : (
        <Text
          style={{
            fontSize: 16,
            color: "rgba(255, 255, 255, 0.5)",
          }}
        >
          There's no streaming site yet!
        </Text>
      )}
    </View>
  );
}

const styles = {
  streamingImage: {
    width: 60,
    height: 60,
    objectFit: "contain",
    borderRadius: 50,
  },
};
