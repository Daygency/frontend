import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../contexts/AuthContext";
import {
  postSocialAuthExchange,
  type SocialAuthProvider,
} from "../../lib/apis/auth/socialAuthExchange";
import { RootRoutes } from "../../navigations/routes";
import { WHITE } from "../../color";
import styles from "./styles";

export type AccountReactivationParams = {
  provider: SocialAuthProvider;
  oauthAccessToken: string;
  deletedAt?: string;
  reactivationDeadline?: string;
  name?: string;
};

type RootStackParamList = {
  [RootRoutes.ACCOUNT_REACTIVATION]: AccountReactivationParams;
};

function formatIsoDate(iso?: string): string | null {
  if (!iso?.trim()) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const AccountReactivationScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route =
    useRoute<RouteProp<RootStackParamList, typeof RootRoutes.ACCOUNT_REACTIVATION>>();
  const { login: authLogin } = useAuth();
  const insets = useSafeAreaInsets();
  const [submitting, setSubmitting] = useState(false);

  const {
    provider,
    oauthAccessToken,
    deletedAt,
    reactivationDeadline,
    name,
  } = route.params ?? {};

  const safeProvider: SocialAuthProvider =
    provider === "naver" ? "naver" : "kakao";

  const handleConfirm = async () => {
    if (submitting || !oauthAccessToken) return;
    setSubmitting(true);
    try {
      const { ok, status, data } = await postSocialAuthExchange(
        safeProvider,
        oauthAccessToken,
        { confirmReactivation: true },
      );

      if (!ok) {
        const msg =
          (typeof data.message === "string" && data.message) ||
          `복구 요청에 실패했습니다. (${status})`;
        Alert.alert("복구 실패", msg);
        return;
      }

      if (data.needsReactivation) {
        Alert.alert(
          "복구 실패",
          "서버에서 아직 복구를 완료하지 못했습니다. 잠시 후 다시 시도해 주세요.",
        );
        return;
      }

      const accessToken = data.accessToken as string | undefined;
      const refreshToken = data.refreshToken as string | undefined;
      const user = data.user as Record<string, unknown> | undefined;
      const needsSignup = Boolean(data.needsSignup);

      if (needsSignup) {
        Alert.alert(
          "안내",
          "가입이 필요한 상태입니다. 로그인 화면으로 돌아가 다시 시도해 주세요.",
        );
        navigation.navigate(RootRoutes.LOGIN);
        return;
      }

      if (!accessToken || !user) {
        Alert.alert(
          "복구 실패",
          "서버 응답 형식이 올바르지 않습니다. 앱을 최신 버전으로 업데이트했는지 확인해 주세요.",
        );
        return;
      }

      const u = user;
      await authLogin(
        accessToken,
        {
          socialId: String(u.userId ?? u.socialId ?? ""),
          name: String(u.name ?? ""),
          email: String(u.email ?? ""),
          profileImgUrl: String(u.profileImgUrl ?? ""),
        },
        {
          isNewUser: Boolean(data.isNew),
          refreshToken: refreshToken ?? undefined,
        },
      );
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      Alert.alert("복구 실패", msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (navigation.canGoBack()) navigation.goBack();
    else navigation.navigate(RootRoutes.LOGIN);
  };

  const proceedToSignup = async (profile: Record<string, unknown>) => {
    await authLogin(
      oauthAccessToken,
      {
        socialId: String(profile.socialId ?? ""),
        name: String(profile.name ?? ""),
        email: String(profile.email ?? ""),
        profileImgUrl: String(profile.profileImgUrl ?? ""),
      },
      { isNewUser: true, signupProvider: safeProvider },
    );
  };

  const handleCreateNew = () => {
    if (submitting || !oauthAccessToken) return;

    Alert.alert(
      "새 계정 만들기",
      "이전 계정 데이터는 복구할 수 없게 됩니다. 새로 가입하시겠습니까?",
      [
        { text: "취소", style: "cancel" },
        {
          text: "새로 만들기",
          style: "destructive",
          onPress: async () => {
            setSubmitting(true);
            try {
              const { ok, status, data } = await postSocialAuthExchange(
                safeProvider,
                oauthAccessToken,
                { declineReactivation: true },
              );

              if (!ok) {
                const msg =
                  (typeof data.message === "string" && data.message) ||
                  `새 계정 준비에 실패했습니다. (${status})`;
                Alert.alert("안내", msg);
                return;
              }

              if (data.needsSignup) {
                const profile = (data.profile ?? {}) as Record<string, unknown>;
                await proceedToSignup(profile);
                return;
              }

              Alert.alert(
                "안내",
                "새 계정으로 진행할 수 없습니다. 잠시 후 다시 시도해 주세요.",
              );
            } catch (e) {
              const msg = e instanceof Error ? e.message : String(e);
              Alert.alert("안내", msg);
            } finally {
              setSubmitting(false);
            }
          },
        },
      ],
    );
  };

  const deletedLabel = formatIsoDate(deletedAt);
  const deadlineLabel = formatIsoDate(reactivationDeadline);
  const floatingBottomPad = insets.bottom + 4;
  const scrollBottomPad = insets.bottom + 160;

  const displayName = name?.trim() || "이 계정";

  if (!oauthAccessToken?.trim()) {
    return (
      <View style={[styles.container, { padding: 24, justifyContent: "center" }]}>
        <Text style={styles.body}>
          복구 정보가 없습니다. 로그인 화면에서 다시 시도해 주세요.
        </Text>
        <Pressable style={[styles.primaryButton, { marginTop: 20 }]} onPress={handleCancel}>
          <Text style={styles.primaryButtonText}>로그인으로</Text>
        </Pressable>
      </View>
    );
  }

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
        <Text style={styles.title}>계정을 복구할까요?</Text>
        <Text style={styles.body}>
          이전에 탈퇴한 계정({displayName})으로 로그인하셨습니다. 유예 기간
          안에 복구하면 이전 데이터를 이어서 사용할 수 있습니다.
        </Text>
        {deletedLabel ? (
          <Text style={styles.meta}>탈퇴 처리일: {deletedLabel}</Text>
        ) : null}
        {deadlineLabel ? (
          <Text style={styles.meta}>
            복구 가능 기한(참고): {deadlineLabel}
          </Text>
        ) : null}
        <Text style={[styles.meta, { marginTop: 16 }]}>
          복구하지 않으면 로그인이 완료되지 않습니다. 새 계정으로 시작하려면
          아래 「새로 만들기」를 선택하세요.
        </Text>
      </ScrollView>

      <View
        style={[styles.floatingBottomBar, { paddingBottom: floatingBottomPad }]}
      >
        <Pressable
          style={[
            styles.primaryButton,
            submitting && styles.primaryButtonDisabled,
          ]}
          onPress={submitting ? undefined : handleConfirm}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color={WHITE} />
          ) : (
            <Text style={styles.primaryButtonText}>계정 복구하기</Text>
          )}
        </Pressable>
        <Pressable
          style={styles.secondaryButton}
          onPress={submitting ? undefined : handleCreateNew}
          disabled={submitting}
        >
          <Text style={styles.secondaryButtonText}>새로 만들기</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default AccountReactivationScreen;
