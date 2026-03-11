import { useState } from "react";
import { Platform, Alert } from "react-native";
import { login } from "@react-native-kakao/user";
import { useAuth } from "../../contexts/AuthContext";

export const useKakaoLogin = () => {
  const { login: authLogin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleKakaoLogin = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      // scopes + useKakaoAccountLogin → 카카오계정 로그인 + 개인정보 선택 동의 화면 표시
      const token = await login({
        scopes: ["profile_nickname", "profile_image"],
        useKakaoAccountLogin: true,
      });
      console.log("[Kakao] login() 성공, token 있음:", !!token?.accessToken);

      const accessTokenFromKakao = token?.accessToken;
      if (!accessTokenFromKakao || typeof accessTokenFromKakao !== "string") {
        throw new Error(
          "카카오 로그인 응답에 accessToken이 없습니다. (SDK 초기화 및 네이티브 앱 키 확인)",
        );
      }

      const API_BASE =
        Platform.OS === "android"
          ? "http://10.0.2.2:3000"
          : "http://localhost:3000";
      console.log("[Kakao] 서버로 요청 전송:", `${API_BASE}/auth/kakao`);
      const res = await fetch(`${API_BASE}/auth/kakao`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessTokenFromKakao}`,
        },
        body: JSON.stringify({
          accessToken: accessTokenFromKakao,
          access_token: accessTokenFromKakao,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const backendMsg =
          data?.message ?? data?.error ?? (typeof data === "string" ? data : "");
        console.error("[Kakao] 서버 에러:", res.status, data);
        throw new Error(
          backendMsg || `서버 인증 실패 (${res.status})`
        );
      }

      const { accessToken, user, needsSignup, isNew } = data;

      if (needsSignup) {
        const profile = data.profile ?? {};
        await authLogin(
          accessTokenFromKakao,
          {
            socialId: String(profile.socialId ?? ""),
            nickname: String(profile.nickname ?? ""),
            email: String(profile.email ?? ""),
            profileImgUrl: String(profile.profileImgUrl ?? ""),
          },
          { isNewUser: true },
        );
        return;
      }

      if (!accessToken || !user) {
        throw new Error("서버 응답 형식이 올바르지 않습니다.");
      }

      const u = user;
      await authLogin(
        accessToken,
        {
          socialId: String(u.userId ?? u.socialId ?? ""),
          nickname: String(u.nickname ?? ""),
          email: String(u.email ?? ""),
          profileImgUrl: String(u.profileImgUrl ?? ""),
        },
        { isNewUser: isNew },
      );
    } catch (error) {
      console.error("[Kakao Login Error]", error);
      const message = error instanceof Error ? error.message : String(error);
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
