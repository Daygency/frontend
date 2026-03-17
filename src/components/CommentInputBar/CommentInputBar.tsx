import { TextInput, View, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { GRAY } from "../../color";
import styles from "./styles";

interface CommentInputBarProps {
  placeholder?: string;
  paddingBottom?: number;
}

const CommentInputBar = ({
  placeholder = "댓글을 입력해주세요",
  paddingBottom = 10,
}: CommentInputBarProps) => {
  return (
    <View style={[styles.container, { paddingBottom }]}>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={GRAY.DARK_2}
          multiline
        />
      </View>
      <Pressable style={styles.sendButton} hitSlop={10}>
        <MaterialCommunityIcons name="send" size={22} color="#000" />
      </Pressable>
    </View>
  );
};

export default CommentInputBar;
