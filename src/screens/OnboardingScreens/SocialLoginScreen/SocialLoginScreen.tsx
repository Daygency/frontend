import {
  View,
  Text,
  Pressable,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "../../../contexts/AuthContext";
import { useKakaoLogin } from "./useKakaoLogin";
import { useNaverLogin } from "./useNaverLogin";
import { styles } from "./styles";

const SocialLoginScreen = () => {
  const { top, bottom } = useSafeAreaInsets();
  const { login, enterBrowse } = useAuth();
  const { handleKakaoLogin, isLoading: isKakaoLoading } = useKakaoLogin();
  const { handleNaverLogin, isLoading: isNaverLoading } = useNaverLogin();

  const authBusy = isKakaoLoading || isNaverLoading;

  const handleGoogleLogin = async () => {
    await login("google_dummy_token", {
      socialId: "",
      nickname: "",
      email: "",
      profileImgUrl: "",
    });
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
          source={require("../../../../assets/logo.png")}
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
          disabled={authBusy}
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
          disabled={authBusy}
        >
          {isNaverLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.naverLogo}>N</Text>
          )}
          <Text style={[styles.buttonText, styles.naverButtonText]}>
            {isNaverLoading ? "로그인 중..." : "네이버로 시작하기"}
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
          onPress={enterBrowse}
        >
          <Text style={styles.browseButtonText}>둘러보기</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default SocialLoginScreen;
