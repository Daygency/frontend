import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Modal,
  Pressable,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "../../../../../contexts/AuthContext";
import { useRequireLogin } from "../../../../../hooks/useRequireLogin";
import {
  getChatRoomMemberSettings,
  leaveChatRoom,
  setChatRoomNotificationsMuted,
} from "../../../../../lib/apis/chat/chatApi";
import { createReport } from "../../../../../lib/apis/report/reportApi";
import type { ReportCategory } from "../../../../../lib/apis/report/types";
import { confirmReportSubmission } from "../../../../../lib/report/confirmReportSubmission";
import { messageForReportHttpStatus } from "../../../../../lib/report/reportErrorMessage";
import ReportCategoryModal from "../../../../../components/modals/ReportCategoryModal";
import { RED } from "../../../../../color";
import styles from "./styles";

const CARD_WIDTH = 210;
const CARD_MARGIN = 12;
const ROW_HEIGHT = 46;

type ChatRoomActionsModalProps = {
  visible: boolean;
  chatRoomId: string;
  peerUserId?: string;
  name?: string;
  /** 롱프레스한 화면 좌표 — 이 지점 근처에 팝오버를 띄움 */
  anchor?: { x: number; y: number };
  onClose: () => void;
  /** 채팅방 나가기 성공 시 — 목록에서 제거/재조회 트리거 */
  onLeft?: () => void;
};

const ChatRoomActionsModal = ({
  visible,
  chatRoomId,
  peerUserId = "",
  name,
  anchor,
  onClose,
  onLeft,
}: ChatRoomActionsModalProps) => {
  const { user } = useAuth();
  const { requireLogin } = useRequireLogin();
  const insets = useSafeAreaInsets();
  const myUserId = String(user?.socialId ?? "");

  const [notificationsMuted, setNotificationsMuted] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [togglingMute, setTogglingMute] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [reportSubmitting, setReportSubmitting] = useState(false);

  /**
   * 같은 채팅방을 다시 롱프레스할 때마다 스피너가 깜빡이는 것을 막기 위해,
   * 한 번 받아온 값은 캐시해두고 재조회 중에는 캐시된 값을 그대로 보여준다.
   */
  const settingsCacheRef = useRef<Map<string, boolean>>(new Map());

  useEffect(() => {
    if (!visible || !chatRoomId) return;
    let cancelled = false;
    const cached = settingsCacheRef.current.get(chatRoomId);
    if (cached !== undefined) {
      setNotificationsMuted(cached);
      setLoadingSettings(false);
    } else {
      setLoadingSettings(true);
    }
    (async () => {
      const settings = await getChatRoomMemberSettings(chatRoomId);
      if (cancelled) return;
      if (settings) {
        setNotificationsMuted(settings.notificationsMuted);
        settingsCacheRef.current.set(chatRoomId, settings.notificationsMuted);
      }
      setLoadingSettings(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [visible, chatRoomId]);

  useEffect(() => {
    if (!visible) {
      setReportModalVisible(false);
    }
  }, [visible]);

  /**
   * 부모가 onClose와 동시에 anchor/name을 undefined로 넘기면(props 초기화),
   * 닫히는 fade 애니메이션 도중 위치가 재계산되어 아래로 튀었다가 사라지는 것처럼 보임.
   * 마지막으로 받은 값을 유지해 닫히는 동안에도 위치가 고정되도록 함.
   */
  const lastAnchorRef = useRef(anchor);
  if (anchor) lastAnchorRef.current = anchor;
  const effectiveAnchor = anchor ?? lastAnchorRef.current;

  const lastNameRef = useRef(name);
  if (name) lastNameRef.current = name;
  const effectiveName = name ?? lastNameRef.current;

  const cardPosition = useMemo(() => {
    const { height: winH } = Dimensions.get("window");
    const ay = effectiveAnchor?.y ?? winH / 2;
    const estimatedHeight = 3 * ROW_HEIGHT + (effectiveName ? 34 : 8);

    // 가로 위치는 눌린 지점과 무관하게 왼쪽에 고정
    const left = CARD_MARGIN;

    let top = ay + 14;
    const bottomLimit = winH - insets.bottom - CARD_MARGIN;
    if (top + estimatedHeight > bottomLimit) {
      top = ay - estimatedHeight - 14;
    }
    top = Math.max(insets.top + CARD_MARGIN, top);

    return { left, top };
  }, [effectiveAnchor, insets.top, insets.bottom, effectiveName]);

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
    settingsCacheRef.current.set(chatRoomId, result.notificationsMuted);
  };

  const performLeave = async () => {
    if (!chatRoomId || leaving) return;
    setLeaving(true);
    const ok = await leaveChatRoom(chatRoomId);
    setLeaving(false);
    if (!ok) {
      Alert.alert("실패", "채팅방을 나가지 못했습니다. 다시 시도해 주세요.");
      return;
    }
    onLeft?.();
  };

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
      onClose();
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
      onClose();
    });
  };

  return (
    <>
      <Modal
        visible={visible && !reportModalVisible}
        transparent
        animationType="fade"
        onRequestClose={onClose}
      >
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View
          style={[
            styles.card,
            { left: cardPosition.left, top: cardPosition.top },
          ]}
        >
          {!!effectiveName && (
            <Text style={styles.title} numberOfLines={1}>
              {effectiveName}
            </Text>
          )}

          <Pressable
            style={({ pressed }) => [
              styles.optionRow,
              pressed && styles.optionRowPressed,
            ]}
            onPress={handleToggleMute}
            disabled={loadingSettings || togglingMute}
          >
            <MaterialCommunityIcons
              name={notificationsMuted ? "bell-outline" : "bell-off-outline"}
              size={19}
              color="#000"
            />
            <Text style={styles.optionText}>
              {notificationsMuted ? "알림 켜기" : "알림 끄기"}
            </Text>
            {(togglingMute || loadingSettings) && (
              <ActivityIndicator size="small" color="#000" />
            )}
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.optionRow,
              pressed && styles.optionRowPressed,
            ]}
            onPress={handleReportPress}
          >
            <MaterialCommunityIcons name="flag-outline" size={19} color="#000" />
            <Text style={styles.optionText}>신고</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.optionRow,
              styles.optionRowLast,
              pressed && styles.optionRowPressed,
            ]}
            onPress={handleLeaveChat}
            disabled={leaving}
          >
            <MaterialCommunityIcons name="door-open" size={19} color={RED.DEFAULT} />
            <Text style={[styles.optionText, styles.optionTextDanger]}>
              채팅방 나가기
            </Text>
            {leaving && <ActivityIndicator size="small" color={RED.DEFAULT} />}
          </Pressable>
        </View>
      </Modal>

      <ReportCategoryModal
        visible={visible && reportModalVisible}
        onClose={() => {
          if (!reportSubmitting) setReportModalVisible(false);
        }}
        onSelect={submitReport}
        submitting={reportSubmitting}
      />
    </>
  );
};

export default ChatRoomActionsModal;
