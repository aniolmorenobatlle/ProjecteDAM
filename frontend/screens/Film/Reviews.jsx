import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { globalStyles } from "../../globalStyles";
import { API_URL } from "../../config";
import { useEffect, useState } from "react";
import axios from "axios";
import { useUserInfo } from "../../hooks/useUserInfo";
import Icon from "react-native-vector-icons/Ionicons";
import CustomModal from "../../components/CustomModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function Reviews({ filmId }) {
  const { userInfo } = useUserInfo();
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState("");
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editingContent, setEditingContent] = useState("");

  const fetchMovieReviews = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/api/movies/${filmId}/comments`
      );
      setReviews(response.data);
      setLoading(false);
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

  const handleDeleteReview = async () => {
    if (!selectedReviewId) return;

    try {
      const token = await AsyncStorage.getItem("authToken");

      if (!token) {
        Alert.alert("Error", "You must be logged in to delete a review.");
        return;
      }

      await axios.delete(
        `${API_URL}/api/movies/${filmId}/comments/${selectedReviewId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      handleCloseModalDelete();
      fetchMovieReviews();
    } catch (error) {
      Alert.alert(
        "Error",
        "There was an error deleting the review. Please try again."
      );
    }
  };

  const handleEditReview = async () => {
    if (!editingContent.trim()) {
      Alert.alert("Error", "The comment cannot be empty");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("authToken");

      if (!token) {
        Alert.alert("Error", "You must be logged in to edit a review.");
        return;
      }

      await axios.post(
        `${API_URL}/api/movies/${filmId}/comments/${editingReviewId}/edit`,
        {
          content: editingContent,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEditingReviewId(null);
      setEditingContent("");
      fetchMovieReviews();
    } catch (error) {
      Alert.alert(
        "Error",
        "There was an error editing the review. Please try again."
      );
      console.error("Error editing review:", error);
    }
  };

  const handleOpenModalDelete = (reviewId) => {
    setSelectedReviewId(reviewId);
    setDeleteModal(true);
  };

  const handleCloseModalDelete = () => {
    setDeleteModal(false);
    setSelectedReviewId(null);
  };

  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setEditingContent("");
  };

  useEffect(() => {
    if (filmId) {
      fetchMovieReviews();
    }
  }, [filmId]);

  if (!userInfo) {
    return (
      <View style={styles.reviews}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <KeyboardAwareScrollView
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      keyboardShouldPersistTaps="handled"
      extraScrollHeight={20}
      contentContainerStyle={{ flexGrow: 1 }}
    >
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
            <Text style={[globalStyles.textBase, styles.buttonText]}>
              Submit
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.line} />

        {(showAllReviews ? reviews : reviews.slice(0, 5)).map(
          (review, index) => (
            <View key={index} style={styles.reviewContainer}>
              <View style={styles.reviewHeader}>
                <Image
                  style={styles.reviewImageUser}
                  source={{
                    uri: review?.avatar
                      ? `${review?.avatar}&nocache=true`
                      : `${API_URL}/api/users/${review?.user_id}/avatar?nocache=true`,
                  }}
                />

                <Text style={[globalStyles.textBase, styles.reviewText]}>
                  Review by{" "}
                  <Text style={[globalStyles.textBase, styles.reviewTextUser]}>
                    {review.username}
                  </Text>
                </Text>

                {!loading && review.user_id === userInfo?.id && (
                  <View style={styles.reviewActions}>
                    {editingReviewId === review.id ? (
                      <>
                        <TouchableOpacity onPress={handleEditReview}>
                          <Icon
                            name="checkmark-outline"
                            size={20}
                            color="#E9A6A6"
                          />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleCancelEdit}>
                          <Icon
                            name="close-outline"
                            size={20}
                            color="#E9A6A6"
                          />
                        </TouchableOpacity>
                      </>
                    ) : (
                      <>
                        <TouchableOpacity
                          onPress={() => {
                            setEditingReviewId(review.id);
                            setEditingContent(review.comment);
                          }}
                        >
                          <Icon
                            name="pencil-outline"
                            size={20}
                            color="#E9A6A6"
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => handleOpenModalDelete(review.id)}
                        >
                          <Icon
                            name="trash-outline"
                            size={20}
                            color="#E9A6A6"
                          />
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                )}
              </View>

              {editingReviewId === review.id ? (
                <TextInput
                  style={[
                    globalStyles.textBase,
                    styles.textWriteReview,
                    {
                      marginLeft: 50,
                      marginTop: -8,
                      borderBottomWidth: 1,
                      borderBottomColor: "#E9A6A6",
                      paddingBottom: 5,
                    },
                  ]}
                  multiline={true}
                  maxLength={400}
                  value={editingContent}
                  onChangeText={setEditingContent}
                />
              ) : (
                <Text style={[globalStyles.textBase, styles.reviewResult]}>
                  {review.comment}
                </Text>
              )}
            </View>
          )
        )}

        <CustomModal visible={deleteModal} onClose={handleCloseModalDelete}>
          <Text style={styles.modalTitle}>
            Are you sure you want to delete this review?
          </Text>

          <View style={styles.buttonsContainerList}>
            <TouchableOpacity
              style={styles.confirmButtonList}
              onPress={() => handleDeleteReview()}
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButtonList}
              onPress={handleCloseModalDelete}
            >
              <Text style={styles.confirmButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </CustomModal>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = {
  reviews: {
    flex: 1,
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

  reviewActions: {
    flexDirection: "row",
    gap: 10,
    marginLeft: "auto",
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

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "white",
  },

  buttonsContainerList: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },

  confirmButton: {
    width: "100%",
    padding: 10,
    backgroundColor: "#E9A6A6",
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },

  confirmButtonText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
  },

  confirmButtonList: {
    width: "48%",
    padding: 10,
    backgroundColor: "#E9A6A6",
    borderRadius: 10,
    alignItems: "center",
  },

  cancelButtonList: {
    width: "48%",
    padding: 10,
    backgroundColor: "#9C4A8B",
    borderRadius: 10,
    alignItems: "center",
  },
};
