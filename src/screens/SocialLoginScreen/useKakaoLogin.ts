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
      const token = await login({
        scopes: ["profile_nickname", "profile_image"],
        useKakaoAccountLogin: true,
      });

      const API_BASE =
        Platform.OS === "android"
          ? "http://10.0.2.2:3000"
          : "http://localhost:3000";
      const res = await fetch(`${API_BASE}/auth/kakao`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken: token.accessToken }),
      });
      if (!res.ok) throw new Error("서버 인증 실패");

      const data = await res.json();
      const { accessToken, user } = data;
      const u = user ?? {};
      await authLogin(accessToken, {
        socialId: String(u.socialId ?? ""),
        nickname: String(u.nickname ?? ""),
        email: String(u.email ?? ""),
        profileImgUrl: String(u.profileImgUrl ?? ""),
      });
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
