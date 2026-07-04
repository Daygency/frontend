import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { GRAY, MAIN, RED } from "../../../color";
import { RootRoutes } from "../../../navigations/routes";
import {
  ChatCachedFile,
  clearChatCachedFiles,
  deleteChatCachedFile,
  getChatCachedFiles,
  openChatCachedFile,
} from "../../../lib/chat/chatFileCache";
import styles from "./styles";

const PREVIEWABLE_DOCUMENT_EXTENSIONS = [
  ".pdf",
  ".ppt",
  ".pptx",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
];

const formatFileSize = (size: number) => {
  if (size < 1024) return `${size}B`;
  if (size < 1024 * 1024) return `${Math.round(size / 1024)}KB`;
  return `${(size / (1024 * 1024)).toFixed(1)}MB`;
};

const isPreviewableDocument = (item: ChatCachedFile) => {
  const mime = item.fileMime?.toLowerCase() ?? "";
  if (
    [
      "pdf",
      "powerpoint",
      "presentation",
      "msword",
      "wordprocessingml",
      "excel",
      "spreadsheetml",
    ].some((keyword) => mime.includes(keyword))
  ) {
    return true;
  }
  const name = item.fileName.toLowerCase();
  return PREVIEWABLE_DOCUMENT_EXTENSIONS.some((ext) => name.endsWith(ext));
};

const ChatFileArchiveScreen = () => {
  const navigation = useNavigation<any>();
  const [files, setFiles] = useState<ChatCachedFile[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFiles = useCallback(async () => {
    setLoading(true);
    const items = await getChatCachedFiles();
    setFiles(items);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadFiles();
    }, [loadFiles]),
  );

  const openFile = async (item: ChatCachedFile) => {
    if (isPreviewableDocument(item) && item.sourceUrl) {
      navigation.navigate(RootRoutes.PDF_VIEWER, {
        url: item.sourceUrl,
        title: item.fileName,
      });
      return;
    }

    try {
      await openChatCachedFile(item);
    } catch {
      Alert.alert("열기 실패", "파일을 열 수 없습니다.");
    }
  };

  const confirmDelete = (item: ChatCachedFile) => {
    Alert.alert("삭제", "이 파일을 보관함에서 삭제할까요?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          await deleteChatCachedFile(item.id);
          await loadFiles();
        },
      },
    ]);
  };

  const confirmClear = () => {
    if (files.length === 0) return;
    Alert.alert("전체 삭제", "보관함의 모든 파일을 삭제할까요?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          await clearChatCachedFiles();
          await loadFiles();
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.empty}>
        <ActivityIndicator color={MAIN.DEFAULT} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={files}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          files.length === 0 ? { flexGrow: 1 } : null,
        ]}
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialCommunityIcons
              name="archive-outline"
              size={34}
              color={GRAY.DARK_2}
            />
            <Text style={styles.emptyText}>
              아직 로컬에 저장된 채팅 파일이 없습니다.
            </Text>
          </View>
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <Pressable style={styles.item} onPress={() => openFile(item)}>
            <View style={styles.iconWrap}>
              <MaterialCommunityIcons
                name="file-outline"
                size={24}
                color={MAIN.DEFAULT}
              />
            </View>
            <View style={styles.fileText}>
              <Text style={styles.fileName} numberOfLines={2}>
                {item.fileName}
              </Text>
              <Text style={styles.fileMeta}>
                {formatFileSize(item.size)} ·{" "}
                {new Date(item.accessedAt).toLocaleDateString("ko-KR")}
              </Text>
            </View>
            <Pressable
              style={styles.deleteButton}
              hitSlop={8}
              onPress={() => confirmDelete(item)}
            >
              <MaterialCommunityIcons
                name="trash-can-outline"
                size={22}
                color={RED.DEFAULT}
              />
            </Pressable>
          </Pressable>
        )}
      />
      {files.length > 0 ? (
        <Pressable style={styles.footerButton} onPress={confirmClear}>
          <Text style={styles.footerButtonText}>전체 삭제</Text>
        </Pressable>
      ) : null}
    </View>
  );
};

export default ChatFileArchiveScreen;
