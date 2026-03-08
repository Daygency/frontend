import { View, Text } from "react-native";
import styles from "../styles";

const MyReviewsScene = () => {
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>작성한 후기가 없습니다.</Text>
    </View>
  );
};

export default MyReviewsScene;
