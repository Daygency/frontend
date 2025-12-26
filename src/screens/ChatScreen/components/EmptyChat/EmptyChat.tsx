import { View, Text } from "react-native";
import styles from "./styles";

const EmptyChat = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>채팅이 없습니다</Text>
    </View>
  );
};

export default EmptyChat;

