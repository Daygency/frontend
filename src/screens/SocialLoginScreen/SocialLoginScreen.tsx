import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Platform,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../contexts/AuthContext";
import { WHITE, GRAY, MAIN } from "../../color";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  login as kakaoLogin,
  loginWithKakaoAccount,
} from "@react-native-seoul/kakao-login";
import { useState } from "react";

const SocialLoginScreen = () => {
  const { top, bottom } = useSafeAreaInsets();
  const { login, enterBrowse } = useAuth();
  const [isKakaoLoading, setIsKakaoLoading] = useState(false);

  const handleKakaoLogin = async () => {
    if (isKakaoLoading) return;
    setIsKakaoLoading(true);
    try {
      let token;
      try {
        token = await kakaoLogin();
      } catch {
        token = await loginWithKakaoAccount();
      }

      // 서버에 카카오 토큰 전송 → 검증 후 AccessToken 수신
      const API_BASE =
        Platform.OS === "android" ? "http://10.0.2.2:3000" : "http://localhost:3000";
      const res = await fetch(`${API_BASE}/auth/kakao`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token.accessToken }),
      });
      if (!res.ok) throw new Error("서버 인증 실패");
      const { accessToken } = await res.json();
      await login(accessToken);
    } catch (error) {
      console.error("[Kakao Login Error]", error);
      const message =
        error instanceof Error ? error.message : String(error);
      Alert.alert(
        "로그인 실패",
        `카카오 로그인에 실패했습니다. 다시 시도해 주세요.\n\n(오류: ${message})`
      );
    } finally {
      setIsKakaoLoading(false);
    }
  };

  const handleNaverLogin = () => {
    // TODO: 네이버 소셜 로그인 연동
    login("naver_dummy_token");
  };

  const handleGoogleLogin = () => {
    // TODO: 구글 소셜 로그인 연동
    login("google_dummy_token");
  };

  const handleBrowse = () => {
    // 둘러보기 - 비로그인으로 메인 홈 진입
    enterBrowse();
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingTop: top, paddingBottom: bottom, paddingVertical: 24 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.logoWrap}>
        <Image
          source={require("../../../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.logoText}>DAYGENCY</Text>
      </View>
      <Text style={styles.tagline}>
        계정에 로그인하여 데이전시를 시작하세요
      </Text>

      <View style={styles.buttonContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.socialButton,
            styles.kakaoButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleKakaoLogin}
          disabled={isKakaoLoading}
        >
          {isKakaoLoading ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            <MaterialCommunityIcons name="chat" size={22} color="#000" />
          )}
          <Text style={[styles.buttonText, styles.kakaoButtonText]}>
            {isKakaoLoading ? "로그인 중..." : "카카오로 시작하기"}
          </Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.socialButton,
            styles.naverButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleNaverLogin}
        >
          <Text style={styles.naverLogo}>N</Text>
          <Text style={[styles.buttonText, styles.naverButtonText]}>
            네이버로 시작하기
          </Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.socialButton,
            styles.googleButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleGoogleLogin}
        >
          <View style={styles.googleIconContainer}>
            <Text style={styles.googleG}>G</Text>
          </View>
          <Text style={[styles.buttonText, styles.googleButtonText]}>
            구글로 시작하기
          </Text>
        </Pressable>

        <View style={styles.divider} />

        <Pressable
          style={({ pressed }) => [
            styles.browseButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleBrowse}
        >
          <Text style={styles.browseButtonText}>둘러보기</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  contentContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  logoWrap: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 64,
    height: 64,
  },
  logoText: {
    fontSize: 20,
    fontWeight: "600",
    color: MAIN.DEFAULT,
  },
  tagline: {
    fontSize: 13,
    color: MAIN.DEFAULT,
    marginBottom: 4,
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    marginTop: 48,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  kakaoButton: {
    backgroundColor: "#FEE500",
  },
  naverButton: {
    backgroundColor: "#03C75A",
  },
  googleButton: {
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: GRAY.MEDIUM_2,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  kakaoButtonText: {
    color: "#000",
  },
  naverButtonText: {
    color: WHITE,
  },
  googleButtonText: {
    color: "#000",
  },
  naverLogo: {
    fontSize: 18,
    fontWeight: "800",
    color: WHITE,
    width: 24,
    height: 24,
    textAlign: "center",
    lineHeight: Platform.OS === "ios" ? 24 : 22,
  },
  googleIconContainer: {
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  googleG: {
    fontSize: 18,
    fontWeight: "800",
    color: "#4285F4",
  },
  divider: {
    height: 1,
    backgroundColor: GRAY.MEDIUM_2,
    marginVertical: 24,
  },
  browseButton: {
    backgroundColor: GRAY.DEFAULT_1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  browseButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: MAIN.DEFAULT,
  },
});

export default SocialLoginScreen;
