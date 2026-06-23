import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import messaging from "@react-native-firebase/messaging";
import { RED, WHITE } from "../../color";
import { useAuth } from "../../contexts/AuthContext";
import { withdrawAccount } from "../../lib/apis/auth/accountApi";
import { unregisterPushDevice } from "../../lib/apis/notifications/notificationsApi";
import {
  isFcmMessagingAvailable,
  isPushSupportedNative,
} from "../../lib/pushNotifications";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { resetNavigationToBrowseHome } from "../../lib/navigation/resetToBrowseHome";
import styles from "./styles";

const WITHDRAW_PRECAUTIONS = [
  "탈퇴 시 계정은 소프트 삭제되며, 같은 소셜 계정으로 다시 로그인하면 유예 기간(7일) 내에는 복구될 수 있습니다.",
  "탈퇴일로부터 7일이 지나면 서버에서 계정이 영구 삭제되며, 이후 동일 소셜로 가입하면 새 계정이 됩니다.",
  "탈퇴 후 회원님의 정보는 전자상거래 소비자보호법에 따른 데이전시 개인정보처리방침에 따라 관리됩니다.",
  "작성했던 게시글 및 댓글/답글은 탈퇴 시 자동 삭제되지 않습니다. 삭제를 원하시면 탈퇴 전에 직접 삭제해 주세요.",
];

const WithdrawConfirmScreen = () => {
  const { logout } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<Record<string, object | undefined>>>();
  const insets = useSafeAreaInsets();
  const floatingBottomPad = insets.bottom + 4;
  const scrollBottomPad = insets.bottom + 88;
  const [precautionsChecked, setPrecautionsChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleDeleteAccount = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const res = await withdrawAccount();
      if (!res.ok) {
        Alert.alert(
          "탈퇴 실패",
          res.message?.trim() ||
            `처리할 수 없습니다. (${res.status || "오류"})`,
        );
        return;
      }
      try {
        if (isPushSupportedNative() && (await isFcmMessagingAvailable())) {
          const t = await messaging().getToken();
          if (t) await unregisterPushDevice({ fcmToken: t });
        }
      } catch {
        /* 탈퇴는 계속 진행 */
      }
      await logout();
      resetNavigationToBrowseHome(navigation);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: scrollBottomPad },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>탈퇴하시겠어요?</Text>

        <View style={styles.bulletList}>
          {WITHDRAW_PRECAUTIONS.map((text, index) => (
            <Text key={index} style={styles.bulletItem}>
              {text}
            </Text>
          ))}
        </View>

        <Pressable
          style={styles.checkboxRow}
          onPress={() => setPrecautionsChecked(!precautionsChecked)}
        >
          <MaterialCommunityIcons
            name={
              precautionsChecked ? "checkbox-marked" : "checkbox-blank-outline"
            }
            size={24}
            color={precautionsChecked ? RED.DEFAULT : "#888"}
          />
          <Text style={styles.checkboxLabel}>
            주의사항을 모두 확인하였습니다.
          </Text>
        </Pressable>
      </ScrollView>

      <View
        style={[styles.floatingBottomBar, { paddingBottom: floatingBottomPad }]}
      >
        <Pressable
          style={[
            styles.deleteButton,
            !precautionsChecked && styles.deleteButtonDisabled,
            submitting && precautionsChecked && { opacity: 0.65 },
          ]}
          onPress={
            precautionsChecked && !submitting ? handleDeleteAccount : undefined
          }
          disabled={!precautionsChecked || submitting}
        >
          {submitting ? (
            <ActivityIndicator color={WHITE} />
          ) : (
            <Text
              style={[
                styles.deleteButtonText,
                !precautionsChecked && styles.deleteButtonTextDisabled,
              ]}
            >
              계정 삭제하기
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
};

export default WithdrawConfirmScreen;
