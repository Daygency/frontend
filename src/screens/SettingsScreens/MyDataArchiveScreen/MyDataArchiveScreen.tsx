import { useCallback, useLayoutEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  FlatList,
  Linking,
  Pressable,
  Text,
  View,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as LegacyFileSystem from "expo-file-system/legacy";
import { GRAY } from "../../../color";
import ShadowCardButton from "../../../components/cards/ShadowCardButton";
import FabButton from "../../../components/ui/FabButton";
import EmptyState, { contentContainerWhenEmpty } from "../../../components/ui/EmptyState";
import {
  deleteMyDocument,
  getMyDocuments,
  uploadMyDocument,
} from "../../../lib/apis/userDocuments/userDocumentsApi";
import type { UserDocumentItem } from "../../../lib/apis/userDocuments/types";
import { resolveProfileImageUrlForDisplay } from "../../../lib/chat/resolveProfileImageUrl";
import styles from "./styles";

type DocumentRow = {
  id: string;
  fileId: string | null;
  title: string;
  date: string;
  meta: string;
  url: string;
  canDelete: boolean;
};

const DocumentCard = ({
  title,
  meta,
  onMorePress,
  isManageMode,
  isSelected,
  onSelect,
  cardSlideAnim,
  circleOpacityAnim,
}: {
  title: string;
  meta: string;
  onMorePress: () => void;
  isManageMode?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
  cardSlideAnim?: Animated.AnimatedInterpolation<number>;
  circleOpacityAnim?: Animated.Value;
}) => (
  <View style={[styles.cardRow, isManageMode && styles.cardRowManage]}>
    {isManageMode && circleOpacityAnim && (
      <Animated.View style={{ opacity: circleOpacityAnim }}>
        <Pressable
          hitSlop={8}
          onPress={onSelect}
          style={[styles.selectCircle, isSelected && styles.selectCircleSelected]}
        >
          {isSelected && (
            <MaterialCommunityIcons name="check" size={16} color="#fff" />
          )}
        </Pressable>
      </Animated.View>
    )}
    <Animated.View
      style={[
        styles.cardWrapper,
        isManageMode &&
          cardSlideAnim && { transform: [{ translateX: cardSlideAnim }] },
      ]}
    >
      <ShadowCardButton styles={{ container: [styles.card, isManageMode && styles.cardManage] }}>
        <View style={styles.cardContent}>
          <View style={styles.textContainer}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {title}
            </Text>
            <Text style={styles.cardMeta} numberOfLines={1}>
              {meta}
            </Text>
          </View>
          {!isManageMode && (
            <Pressable hitSlop={10} onPress={onMorePress} style={styles.moreButton}>
              <MaterialCommunityIcons
                name="dots-vertical"
                size={24}
                color={GRAY.DARK_100}
              />
            </Pressable>
          )}
        </View>
      </ShadowCardButton>
    </Animated.View>
  </View>
);

const ANIM_DURATION = 250;

const MyDataArchiveScreen = () => {
  const navigation = useNavigation<any>();
  const { bottom } = useSafeAreaInsets();
  const [documents, setDocuments] = useState<DocumentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isManageMode, setIsManageMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const slideAnim = useRef(new Animated.Value(0)).current;
  const circleOpacityAnim = useRef(new Animated.Value(0)).current;
  const bottomBarAnim = useRef(new Animated.Value(0)).current;
  const fabOpacityAnim = useRef(new Animated.Value(1)).current;

  const loadDocuments = useCallback(async () => {
    setLoading(true);
    const items = await getMyDocuments();
    setDocuments((items ?? []).map(mapDocumentItem));
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadDocuments();
    }, [loadDocuments]),
  );

  const toggleRef = useRef(() => {});
  toggleRef.current = () => {
    const entering = !isManageMode;
    if (entering) {
      setIsManageMode(true);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 36,
          duration: ANIM_DURATION,
          useNativeDriver: false,
        }),
        Animated.timing(circleOpacityAnim, {
          toValue: 1,
          duration: ANIM_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(bottomBarAnim, {
          toValue: 1,
          duration: ANIM_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(fabOpacityAnim, {
          toValue: 0,
          duration: ANIM_DURATION,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: ANIM_DURATION,
          useNativeDriver: false,
        }),
        Animated.timing(circleOpacityAnim, {
          toValue: 0,
          duration: ANIM_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(bottomBarAnim, {
          toValue: 0,
          duration: ANIM_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(fabOpacityAnim, {
          toValue: 1,
          duration: ANIM_DURATION,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsManageMode(false);
        setSelectedIds(new Set());
      });
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable hitSlop={10} onPress={() => toggleRef.current()}>
          <Text style={{ fontSize: 16, color: "#000" }}>
            {isManageMode ? "취소" : "관리"}
          </Text>
        </Pressable>
      ),
    });
  }, [navigation, isManageMode]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const openDocument = async (item: DocumentRow) => {
    const url = resolveProfileImageUrlForDisplay(item.url);
    if (!url) {
      Alert.alert("알림", "파일 주소를 불러오지 못했습니다.");
      return;
    }
    const supported = await Linking.canOpenURL(url);
    if (!supported) {
      Alert.alert("알림", "이 파일 형식은 기기에서 열 수 없습니다.");
      return;
    }
    await Linking.openURL(url);
  };

  const showDocumentMenu = (item: DocumentRow) => {
    const actions: {
      text: string;
      style?: "destructive" | "cancel";
      onPress?: () => void;
    }[] = [{ text: "열기", onPress: () => void openDocument(item) }];

    if (item.canDelete && item.fileId) {
      actions.push({
        text: "삭제",
        style: "destructive",
        onPress: () => confirmDelete([item.fileId!]),
      });
    }
    actions.push({ text: "취소", style: "cancel" });

    Alert.alert(item.title, undefined, actions);
  };

  const confirmDelete = (fileIds: string[]) => {
    Alert.alert(
      "삭제",
      `선택한 ${fileIds.length}개 파일을 보관함에서 삭제할까요?`,
      [
        { text: "취소", style: "cancel" },
        {
          text: "삭제",
          style: "destructive",
          onPress: async () => {
            let failed = 0;
            for (const fileId of fileIds) {
              const ok = await deleteMyDocument(fileId);
              if (!ok) failed += 1;
            }
            if (failed > 0) {
              Alert.alert("알림", `${failed}개 파일 삭제에 실패했습니다.`);
            }
            await loadDocuments();
            setSelectedIds(new Set());
          },
        },
      ],
    );
  };

  const handleUpload = async () => {
    if (uploading) return;
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf", "video/*"],
        copyToCacheDirectory: true,
      });
      if (result.canceled || !result.assets?.length) return;

      setUploading(true);
      const asset = result.assets[0];
      const uploaded = await uploadMyDocument(asset.uri, {
        name: asset.name,
        type: asset.mimeType ?? undefined,
      });
      setUploading(false);

      if (!uploaded) {
        Alert.alert("업로드 실패", "파일을 보관함에 저장하지 못했습니다.");
        return;
      }
      await loadDocuments();
    } catch {
      setUploading(false);
      Alert.alert("오류", "파일을 선택하는 중 오류가 발생했습니다.");
    }
  };

  const saveSelectedToDevice = async () => {
    const selected = documents.filter((doc) => selectedIds.has(doc.id));
    if (selected.length === 0) {
      Alert.alert("알림", "저장할 파일을 선택해 주세요.");
      return;
    }

    let saved = 0;
    for (const item of selected) {
      const url = resolveProfileImageUrlForDisplay(item.url);
      if (!url) continue;
      const safeName = sanitizeFileName(item.title);
      const dest = `${LegacyFileSystem.documentDirectory ?? ""}${safeName}`;
      try {
        await LegacyFileSystem.downloadAsync(url, dest);
        saved += 1;
      } catch {
        // fallback: open externally
        try {
          await Linking.openURL(url);
          saved += 1;
        } catch {
          // skip
        }
      }
    }

    Alert.alert(
      "저장 완료",
      saved > 0
        ? `${saved}개 파일을 저장했습니다.`
        : "파일을 저장하지 못했습니다.",
    );
  };

  const deleteSelected = () => {
    const fileIds = documents
      .filter((doc) => selectedIds.has(doc.id) && doc.canDelete && doc.fileId)
      .map((doc) => doc.fileId!);

    if (fileIds.length === 0) {
      Alert.alert(
        "알림",
        "보관함에 직접 올린 파일만 삭제할 수 있습니다.",
      );
      return;
    }
    confirmDelete(fileIds);
  };

  const bottomBarTranslateY = bottomBarAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0],
  });

  const cardSlideAnim = slideAnim.interpolate({
    inputRange: [0, 36],
    outputRange: [-36, 0],
  });

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="small" color="#1F2A44" />
        </View>
      ) : (
        <FlatList
          data={documents}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <DocumentCard
              title={item.title}
              meta={item.meta}
              onMorePress={() => showDocumentMenu(item)}
              isManageMode={isManageMode}
              isSelected={selectedIds.has(item.id)}
              onSelect={() => toggleSelect(item.id)}
              cardSlideAnim={cardSlideAnim}
              circleOpacityAnim={circleOpacityAnim}
            />
          )}
          contentContainerStyle={contentContainerWhenEmpty(
            documents.length === 0,
            [styles.listContent, isManageMode && styles.listContentManage],
          )}
          ListEmptyComponent={
            <EmptyState
              message={
                "보관된 자료가 없습니다.\n+ 버튼으로 파일을 추가하거나, 지원서·게시글 첨부 파일이 여기 모입니다."
              }
            />
          }
        />
      )}
      <Animated.View
        style={{
          position: "absolute",
          right: 20,
          bottom: 24 + bottom,
          opacity: fabOpacityAnim,
          width: 56,
          height: 56,
        }}
        pointerEvents={isManageMode ? "none" : "auto"}
      >
        {uploading ? (
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: "#1F2A44",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ActivityIndicator color="#fff" />
          </View>
        ) : (
          <FabButton
            onPress={() => void handleUpload()}
            containerStyle={{ right: 0, bottom: 0 }}
          />
        )}
      </Animated.View>
      {isManageMode && (
        <Animated.View
          style={[
            styles.bottomBar,
            {
              paddingBottom: 16 + bottom,
              opacity: bottomBarAnim,
              transform: [{ translateY: bottomBarTranslateY }],
            },
          ]}
        >
          <Pressable style={styles.bottomBarButton} onPress={() => void saveSelectedToDevice()}>
            <MaterialCommunityIcons
              name="content-save-outline"
              size={24}
              color={GRAY.DARK_100}
            />
            <Text style={styles.bottomBarLabel}>파일 저장</Text>
          </Pressable>
          <Pressable style={styles.bottomBarButton} onPress={deleteSelected}>
            <MaterialCommunityIcons
              name="delete-outline"
              size={24}
              color={GRAY.DARK_100}
            />
            <Text style={styles.bottomBarLabel}>휴지통</Text>
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
};

function mapDocumentItem(item: UserDocumentItem): DocumentRow {
  return {
    id: item.id,
    fileId: item.fileId,
    title: item.title?.trim() || "제목 없음",
    date: formatDate(item.createdAt),
    meta: `${formatDate(item.createdAt)} · ${item.sourceLabel ?? "자료"}`,
    url: item.url,
    canDelete: Boolean(item.canDelete),
  };
}

function formatDate(value?: string): string {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

function sanitizeFileName(name: string): string {
  const trimmed = name.trim() || "document";
  return trimmed.replace(/[^\w.\-가-힣]/g, "_");
}

export default MyDataArchiveScreen;
