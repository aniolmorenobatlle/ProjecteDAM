import { TouchableOpacity, View, Text, Image } from "react-native";
import { globalStyles } from "../../../globalStyles";
import { useNavigation } from "@react-navigation/native";

export default function Cast({ cast }) {
  const navigation = useNavigation();

  return (
    <View style={styles.cast}>
      {cast.length > 0 ? (
        cast.map((cast, index) => {
          const nameParts = cast.name.split(" ");
          const firstName = nameParts[0];
          const lastName =
            nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

          return (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate("ActorInfo", {
                  actorId: cast.id,
                  name: cast.name,
                })
              }
              key={index}
              style={{
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Image
                style={styles.castImage}
                source={{
                  uri: cast.profile_path,
                }}
              />
              <View style={styles.castNameContainer}>
                <Text style={[globalStyles.textBase, styles.castName]}>
                  {firstName}
                </Text>
                {lastName && (
                  <Text style={[globalStyles.textBase, styles.castName]}>
                    {lastName}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })
      ) : (
        <Text style={{ fontSize: 16, color: "gray" }}>
          The cast is not available
        </Text>
      )}
    </View>
  );
}

const styles = {
  cast: {
    flexDirection: "row",
    gap: 15,
  },

  castImage: {
    width: 60,
    height: 60,
    borderRadius: 50,
  },

  castNameContainer: {
    marginTop: 5,
    alignItems: "center",
  },

  castName: {
    fontSize: 10,
  },
};
