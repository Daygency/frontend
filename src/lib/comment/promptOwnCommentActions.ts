import { Alert } from "react-native";

export function promptOwnCommentActions(options: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  Alert.alert("댓글", undefined, [
    { text: "수정", onPress: options.onEdit },
    { text: "삭제", style: "destructive", onPress: options.onDelete },
    { text: "취소", style: "cancel" },
  ]);
}
