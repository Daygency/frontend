import { View, Text } from "react-native";
import styles from "../styles";

const ScrapScene = () => {
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>스크랩한 글이 없습니다.</Text>
    </View>
  );
};

export default ScrapScene;
