import { Pressable, Text, View } from "react-native";
import styles from "./styles";

type Props = {
  author: string;
  onCancel: () => void;
};

const CommentReplyTargetBar = ({ author, onCancel }: Props) => (
  <View style={styles.container}>
    <Text style={styles.targetText}>{author}님에게 답글 작성 중</Text>
    <Pressable hitSlop={8} onPress={onCancel}>
      <Text style={styles.cancelText}>취소</Text>
    </Pressable>
  </View>
);

export default CommentReplyTargetBar;
