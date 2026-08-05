import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "../../../contexts/AuthContext";
import { useRequireLogin } from "../../../hooks/useRequireLogin";
import {
  getChatRoomMemberSettings,
  leaveChatRoom,
  setChatRoomNotificationsMuted,
} from "../../../lib/apis/chat/chatApi";
import { createReport } from "../../../lib/apis/report/reportApi";
import type { ReportCategory } from "../../../lib/apis/report/types";
import { confirmReportSubmission } from "../../../lib/report/confirmReportSubmission";
import { messageForReportHttpStatus } from "../../../lib/report/reportErrorMessage";
import ReportCategoryModal from "../../../components/modals/ReportCategoryModal";
import { MAIN } from "../../../color";
import styles from "./styles";

export type ChatRoomOptionsParams = {
  chatRoomId: string;
  peerUserId: string;
  name?: string;
};

const ChatRoomOptionsScreen = () => {
  const navigation = useNavigation<any>();
  const route =
    useRoute<RouteProp<{ ChatRoomOptions: ChatRoomOptionsParams }, "ChatRoomOptions">>();
  const { user } = useAuth();
  const { requireLogin } = useRequireLogin();
  const { top } = useSafeAreaInsets();

  const chatRoomId = String(route.params?.chatRoomId ?? "").trim();
  const peerUserId = String(route.params?.peerUserId ?? "").trim();
  const myUserId = String(user?.socialId ?? "");

  const [notificationsMuted, setNotificationsMuted] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [togglingMute, setTogglingMute] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [reportSubmitting, setReportSubmitting] = useState(false);

  useEffect(() => {
    if (!chatRoomId) {
      setLoadingSettings(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoadingSettings(true);
      const settings = await getChatRoomMemberSettings(chatRoomId);
      if (cancelled) return;
      if (settings) {
        setNotificationsMuted(settings.notificationsMuted);
      }
      setLoadingSettings(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [chatRoomId]);

  const handleToggleMute = async () => {
    if (!chatRoomId || togglingMute || loadingSettings) return;
    const next = !notificationsMuted;
    setTogglingMute(true);
    const result = await setChatRoomNotificationsMuted(chatRoomId, next);
    setTogglingMute(false);
    if (!result) {
      Alert.alert("실패", "알림 설정을 변경하지 못했습니다.");
      return;
    }
    setNotificationsMuted(result.notificationsMuted);
    Alert.alert(
      result.notificationsMuted ? "알림 해제됨" : "알림 켜짐",
      result.notificationsMuted
        ? "이 채팅방의 새 메시지 알림을 받지 않습니다."
        : "이 채팅방의 새 메시지 알림을 다시 받습니다.",
    );
  };

  const performLeave = useCallback(async () => {
    if (!chatRoomId || leaving) return;
    setLeaving(true);
    const ok = await leaveChatRoom(chatRoomId);
    setLeaving(false);
    if (!ok) {
      Alert.alert("실패", "채팅방을 나가지 못했습니다. 다시 시도해 주세요.");
      return;
    }
    navigation.pop(2);
  }, [chatRoomId, leaving, navigation]);

  const handleLeaveChat = () => {
    Alert.alert(
      "채팅방 나가기",
      "채팅방을 나가면 대화 목록에서 사라집니다. 나가시겠습니까?",
      [
        { text: "취소", style: "cancel" },
        {
          text: "나가기",
          style: "destructive",
          onPress: () => {
            void performLeave();
          },
        },
      ],
    );
  };

  const handleReportPress = () => {
    if (!myUserId) {
      requireLogin();
      return;
    }
    if (!peerUserId) {
      Alert.alert("알림", "신고할 상대 정보를 찾을 수 없습니다.");
      return;
    }
    if (peerUserId === myUserId) {
      Alert.alert("알림", "본인을 신고할 수 없습니다.");
      return;
    }
    setReportModalVisible(true);
  };

  const submitReport = (category: ReportCategory) => {
    if (!chatRoomId || !peerUserId) return;
    confirmReportSubmission(async () => {
      setReportSubmitting(true);
      const result = await createReport({
        reportedUserId: peerUserId,
        category,
        targetType: "CHAT",
        targetId: chatRoomId,
      });
      setReportSubmitting(false);
      setReportModalVisible(false);
      if (!result.ok) {
        Alert.alert(
          "알림",
          messageForReportHttpStatus(result.status, result.message),
        );
        return;
      }
      Alert.alert("접수 완료", "신고가 접수되었습니다.");
    });
  };

  if (!chatRoomId) {
    return (
      <View style={[styles.container, { paddingTop: top, justifyContent: "center", alignItems: "center", paddingHorizontal: 24 }]}>
        <Text style={{ textAlign: "center", color: "#666" }}>
          채팅방 정보가 없습니다.
        </Text>
        <Pressable onPress={() => navigation.goBack()} style={{ marginTop: 16 }}>
          <Text style={{ color: MAIN.DEFAULT, fontWeight: "600" }}>돌아가기</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={10}
          style={styles.backButton}
        >
          <MaterialCommunityIcons name="chevron-left" size={28} color="#000" />
        </Pressable>
      </View>

      <View style={styles.content}>
        <Pressable
          style={styles.optionItem}
          onPress={handleToggleMute}
          disabled={loadingSettings || togglingMute}
        >
          <Text style={styles.optionText}>
            {notificationsMuted ? "알림 켜기" : "알림 해제"}
          </Text>
          {togglingMute || loadingSettings ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            <MaterialCommunityIcons
              name={notificationsMuted ? "bell-outline" : "bell-off-outline"}
              size={22}
              color="#000"
            />
          )}
        </Pressable>
        <Pressable style={styles.optionItem} onPress={handleReportPress}>
          <Text style={styles.optionText}>신고</Text>
          <MaterialCommunityIcons name="flag-outline" size={22} color="#000" />
        </Pressable>
        <Pressable
          style={[styles.optionItem, styles.optionItemLast]}
          onPress={handleLeaveChat}
          disabled={leaving}
        >
          <Text style={[styles.optionText, styles.optionTextDanger]}>
            채팅방 나가기
          </Text>
          {leaving ? (
            <ActivityIndicator size="small" color="#EC1313" />
          ) : (
            <MaterialCommunityIcons name="door-open" size={22} color="#EC1313" />
          )}
        </Pressable>
      </View>

      <ReportCategoryModal
        visible={reportModalVisible}
        onClose={() => {
          if (!reportSubmitting) setReportModalVisible(false);
        }}
        onSelect={submitReport}
        submitting={reportSubmitting}
      />
    </View>
  );
};

export default ChatRoomOptionsScreen;
