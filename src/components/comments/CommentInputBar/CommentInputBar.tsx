import { useEffect, useState } from "react";
import { Keyboard, Pressable, Text, TextInput, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { GRAY, MAIN, BLACK } from "../../../color";
import styles from "./styles";

interface CommentInputBarProps {
  placeholder?: string;
  onSubmit?: (content: string) => void | Promise<void>;
  editMode?: { commentId: string; initialContent: string } | null;
  onCancelEdit?: () => void;
}

const CommentInputBar = ({
  placeholder = "댓글을 입력해주세요",
  onSubmit,
  editMode = null,
  onCancelEdit,
}: CommentInputBarProps) => {
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasText = text.trim().length > 0;

  useEffect(() => {
    if (editMode) {
      setText(editMode.initialContent);
      return;
    }
    setText("");
  }, [editMode?.commentId, editMode?.initialContent, editMode]);

  const handleSubmit = async () => {
    const content = text.trim();
    if (!content || isSubmitting) return;
    Keyboard.dismiss();
    if (!editMode) {
      setText("");
    }
    setIsSubmitting(true);
    try {
      await onSubmit?.(content);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      {editMode ? (
        <View style={styles.editBanner}>
          <Text style={styles.editBannerText}>댓글 수정 중</Text>
          <Pressable hitSlop={8} onPress={onCancelEdit}>
            <Text style={styles.editCancelText}>취소</Text>
          </Pressable>
        </View>
      ) : null}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder={editMode ? "수정할 댓글을 입력하세요" : placeholder}
          placeholderTextColor={GRAY.DARK_2}
          multiline
          autoCorrect={false}
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="sentences"
          textContentType="none"
          importantForAutofill="no"
        />
        <Pressable
          style={[
            styles.sendButton,
            (!hasText || isSubmitting) && styles.sendButtonDisabled,
          ]}
          hitSlop={10}
          disabled={!hasText || isSubmitting}
          onPress={handleSubmit}
        >
          <MaterialCommunityIcons
            name="send"
            size={22}
            color={hasText && !isSubmitting ? BLACK : GRAY.DARK_2}
          />
        </Pressable>
      </View>
    </View>
  );
};

export default CommentInputBar;
