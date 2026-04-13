import { useState } from "react";
import { Alert } from "react-native";
import { login } from "@react-native-kakao/user";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuth } from "../../../contexts/AuthContext";
import {
  pickNicknameFromSocialAuthData,
  postSocialAuthExchange,
} from "../../../lib/apis/auth/socialAuthExchange";
import { RootRoutes } from "../../../navigations/routes";

export const useKakaoLogin = () => {
  const { login: authLogin } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<Record<string, object | undefined>>>();
  const [isLoading, setIsLoading] = useState(false);

  const handleKakaoLogin = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      console.log("[Kakao 1/6] 시작");

      console.log("[Kakao 2/6] login() 호출 직전 (KakaoTalk 앱 로그인)...");
      const token = await login({
        // scopes + useKakaoAccountLogin 제거 → 카카오톡 앱 로그인 시도 (리다이렉트 이슈 우회)
      });
      console.log(
        "[Kakao 3/6] login() 완료 | token 존재:",
        !!token,
        "| keys:",
        token ? Object.keys(token) : [],
      );

      const accessTokenFromKakao =
        token?.accessToken ??
        (token as { access_token?: string })?.access_token;
      if (!accessTokenFromKakao || typeof accessTokenFromKakao !== "string") {
        console.error("[Kakao] token 구조:", JSON.stringify(token, null, 2));
        throw new Error(
          "카카오 로그인 응답에 accessToken이 없습니다. (SDK 초기화 및 네이티브 앱 키 확인)",
        );
      }
      console.log(
        "[Kakao 3/6] accessToken 추출 완료, 길이:",
        accessTokenFromKakao?.length,
      );
      console.log("[Kakao 3/6] accessToken (카카오):", accessTokenFromKakao);

      console.log("[Kakao 4/6] POST /auth/kakao");
      const { ok, status, data, rawText } = await postSocialAuthExchange(
        "kakao",
        accessTokenFromKakao,
      );

      const { accessToken, refreshToken, user, needsSignup, isNew } = data as {
        accessToken?: string;
        refreshToken?: string;
        user?: Record<string, unknown>;
        needsSignup?: boolean;
        isNew?: boolean;
        needsReactivation?: boolean;
      };

      console.log(
        "[Kakao 5/6] fetch 응답 | status:",
        status,
        "| ok:",
        ok,
        "| data keys:",
        typeof data === "object" ? Object.keys(data) : "not object",
        "| accessToken:",
        accessToken,
      );

      if (!ok) {
        const backendMsg =
          (typeof data.message === "string" && data.message) ||
          (typeof data.error === "string" && data.error) ||
          rawText.slice(0, 500) ||
          "";
        console.error("[Kakao] 서버 에러:", status, data);
        throw new Error(backendMsg || `서버 인증 실패 (${status})`);
      }

      if (data.needsReactivation) {
        navigation.navigate(RootRoutes.ACCOUNT_REACTIVATION, {
          provider: "kakao",
          oauthAccessToken: accessTokenFromKakao,
          deletedAt:
            typeof data.deletedAt === "string" ? data.deletedAt : undefined,
          reactivationDeadline:
            typeof data.reactivationDeadline === "string"
              ? data.reactivationDeadline
              : undefined,
          nickname: pickNicknameFromSocialAuthData(data),
        });
        return;
      }

      if (needsSignup) {
        console.log("[Kakao 6/6] needsSignup=true, authLogin(신규) 호출");
        const profile = (data.profile ?? {}) as Record<string, unknown>;
        await authLogin(
          accessTokenFromKakao,
          {
            socialId: String(profile.socialId ?? ""),
            nickname: String(profile.nickname ?? ""),
            email: String(profile.email ?? ""),
            profileImgUrl: String(profile.profileImgUrl ?? ""),
          },
          { isNewUser: true, signupProvider: "kakao" },
        );
        return;
      }

      if (!accessToken || !user) {
        throw new Error("서버 응답 형식이 올바르지 않습니다.");
      }

      console.log("[Kakao 6/6] 기존 유저 로그인 완료");
      const u = user as Record<string, unknown>;
      await authLogin(
        accessToken,
        {
          socialId: String(u.userId ?? u.socialId ?? ""),
          nickname: String(u.nickname ?? ""),
          email: String(u.email ?? ""),
          profileImgUrl: String(u.profileImgUrl ?? ""),
        },
        { isNewUser: isNew, refreshToken: refreshToken ?? undefined },
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const isCanceledByUser =
        message.toLowerCase().includes("canceled by user") ||
        message.toLowerCase().includes("cancelled by user") ||
        message.toLowerCase().includes("cancelled");

      if (isCanceledByUser) {
        return;
      }

      console.error("[Kakao Login Error]", error);
      console.error(
        "[Kakao 실패 위치] 2에서 끊김=SDK 에러 | 4에서 끊김=네트워크/백엔드 도달 못함 | 5에서 끊김=백엔드 응답 에러",
      );
      console.error(
        "[Kakao Error 상세]",
        "name:",
        error instanceof Error ? error.name : "-",
        "| message:",
        message,
        "| stack:",
        error instanceof Error ? error.stack?.slice(0, 200) : "-",
      );
      Alert.alert(
        "로그인 실패",
        `카카오 로그인에 실패했습니다. 다시 시도해 주세요.\n\n(오류: ${message})`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return { handleKakaoLogin, isLoading };
};
