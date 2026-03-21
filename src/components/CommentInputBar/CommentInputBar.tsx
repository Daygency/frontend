import { useState } from "react";
import { TextInput, View, Pressable } from "react-native";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { GRAY } from "../../color";
import styles from "./styles";

interface CommentInputBarProps {
  placeholder?: string;
  paddingBottom?: number;
}

const CommentInputBar = ({
  placeholder = "댓글을 입력해주세요",
  paddingBottom = 0,
}: CommentInputBarProps) => {
  const [text, setText] = useState("");
  const hasText = text.trim().length > 0;

  return (
    <View style={[styles.container, { paddingBottom }]}>
      <Pressable style={styles.addButton} hitSlop={10}>
        <Feather name="plus" size={22} color="#666" />
      </Pressable>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder={placeholder}
        placeholderTextColor={GRAY.DARK_2}
        multiline
      />
      <Pressable
        style={[styles.sendButton, !hasText && styles.sendButtonDisabled]}
        hitSlop={10}
      >
        <MaterialCommunityIcons
          name="send"
          size={22}
          color={hasText ? "#000" : GRAY.DARK_2}
        />
      </Pressable>
    </View>
  );
};

export default CommentInputBar;
