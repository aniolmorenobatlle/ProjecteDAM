import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { globalStyles } from "../../globalStyles";
import { API_URL } from "../../config";
import { useEffect, useState } from "react";
import axios from "axios";
import { useUserInfo } from "../../hooks/useUserInfo";

export default function Reviews({ filmId }) {
  const { userInfo } = useUserInfo();
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState("");
  const [showAllReviews, setShowAllReviews] = useState(false);

  const fetchMovieReviews = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/movies/${filmId}/comments`
      );
      setReviews(response.data);
    } catch (error) {}
  };

  const handleAddComment = async () => {
    if (!comment.trim()) {
      Alert.alert("Error", "The comment cannot be empty");
      return;
    }

    try {
      await axios.post(`${API_URL}/api/movies/${filmId}/comments`, {
        user_id: userInfo.id,
        content: comment,
      });

      setComment("");
      fetchMovieReviews();
    } catch (error) {
      Alert.alert(
        "Error",
        "There was an error submitting your comment. Please try again."
      );
      console.error("Error submitting comment:", error);
    }
  };

  useEffect(() => {
    if (filmId) {
      fetchMovieReviews();
    }
  }, [filmId]);

  return (
    <View style={styles.reviews}>
      <View style={styles.reviewTitles}>
        <Text style={[globalStyles.textBase]}>All reviews</Text>
        <Text
          style={[globalStyles.textBase, styles.seeAll]}
          onPress={() => setShowAllReviews(!showAllReviews)}
        >
          {showAllReviews ? "See less" : "See all"}
        </Text>
      </View>

      <View style={styles.addReview}>
        <TextInput
          style={[globalStyles.textBase, styles.textWriteReview]}
          placeholder="Write your review here"
          placeholderTextColor="#E9A6A6"
          multiline={true}
          maxLength={400}
          value={comment}
          onChangeText={setComment}
        />
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.buttonAddReview}
          onPress={handleAddComment}
        >
          <Text style={[globalStyles.textBase, styles.buttonText]}>Submit</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.line} />

      {(showAllReviews ? reviews : reviews.slice(0, 5)).map((review, index) => (
        <View key={index} style={styles.reviewContainer}>
          <View style={styles.reviewHeader}>
            <Image
              style={styles.reviewImageUser}
              source={{
                uri: review?.avatar
                  ? `${review?.avatar}&nocache=${Date.now()}`
                  : `${API_URL}/api/users/${review?.user_id}/avatar?nocache=${Date.now()}`,
              }}
            />

            <Text style={[globalStyles.textBase, styles.reviewText]}>
              Review by{" "}
              <Text style={[globalStyles.textBase, styles.reviewTextUser]}>
                {review.username}
              </Text>
            </Text>
          </View>
          <Text style={[globalStyles.textBase, styles.reviewResult]}>
            {review.comment}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = {
  reviews: {
    marginTop: 20,
  },

  reviewTitles: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  seeAll: {
    fontSize: 14,
    color: "#E9A6A6",
  },

  reviewContainer: {
    marginTop: 10,
    backgroundColor: "#323048",
    borderRadius: 10,
    padding: 10,
  },

  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  reviewImageUser: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },

  reviewText: {
    color: "rgba(255, 255, 255, 0.5)",
    marginLeft: 10,
    fontSize: 12,
  },

  reviewTextUser: {
    color: "#E9A6A6",
    opacity: 1,
    fontSize: 12,
  },

  reviewResult: {
    color: "#fff",
    marginLeft: 60,
    fontSize: 14,
    marginTop: -8,
  },

  addReview: {
    flex: 1,
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
    alignItems: "stretch",
  },

  textWriteReview: {
    flex: 1,
    backgroundColor: "#323048",
    borderRadius: 10,
    padding: 10,
    color: "white",
    fontSize: 14,
  },

  buttonAddReview: {
    backgroundColor: "#E9A6A6",
    borderRadius: 10,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: 40,
  },

  buttonText: {
    color: "#000",
    fontSize: 12,
    fontWeight: "bold",
  },

  line: {
    borderBottomColor: "gray",
    borderBottomWidth: 1,
    marginTop: 20,
    marginBottom: 10,
  },
};
