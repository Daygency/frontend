import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Platform,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../contexts/AuthContext";
import { WHITE, GRAY, MAIN } from "../../color";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const SocialLoginScreen = () => {
  const { top, bottom } = useSafeAreaInsets();
  const { login, enterBrowse } = useAuth();

  const handleKakaoLogin = () => {
    // TODO: 카카오 소셜 로그인 연동
    login("kakao_dummy_token");
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
        >
          <MaterialCommunityIcons name="chat" size={22} color="#000" />
          <Text style={[styles.buttonText, styles.kakaoButtonText]}>
            카카오로 시작하기
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
