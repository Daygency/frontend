import { Text, View } from "react-native";
import { Pressable } from "react-native";
import styles from "./styles";
import Feather from "@expo/vector-icons/Feather";
import { MAIN } from "../../../../color";

const ChatHeader = () => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.title}>채팅</Text>
      <View style={styles.iconContainer}>
        <Pressable style={styles.iconButton}>
          <Feather name="search" size={23} color={MAIN.DEFAULT} />
        </Pressable>
      </View>
    </View>
  );
};

export default ChatHeader;

