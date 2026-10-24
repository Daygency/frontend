import {
  View,
  Text,
  Pressable,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "../../../contexts/AuthContext";
import { useKakaoLogin } from "./useKakaoLogin";
import { useNaverLogin } from "./useNaverLogin";
import { useGoogleLogin } from "./useGoogleLogin";
import { WHITE, FIXED_WHITE } from "../../../color";
import { styles } from "./styles";

const WHITE_LOGO = require("../../../../assets/daygency_logo_white.png");
const GOOGLE_LOGO = require("../../../../assets/google.png");

type SocialLoginScreenProps = {
  onClose?: () => void;
};

const SocialLoginScreen = ({ onClose }: SocialLoginScreenProps) => {
  const { top, bottom } = useSafeAreaInsets();
  const { enterBrowse } = useAuth();
  const handleClose = onClose ?? enterBrowse;
  const { handleKakaoLogin, isLoading: isKakaoLoading } = useKakaoLogin();
  const { handleNaverLogin, isLoading: isNaverLoading } = useNaverLogin();
  const { handleGoogleLogin, isLoading: isGoogleLoading } = useGoogleLogin();

  const authBusy = isKakaoLoading || isNaverLoading || isGoogleLoading;

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <Pressable
        style={[styles.closeButton, { top: top + 4 }]}
        onPress={handleClose}
        hitSlop={12}
        accessibilityLabel="닫기"
        accessibilityRole="button"
      >
        <MaterialCommunityIcons name="close" size={28} color={FIXED_WHITE} />
      </Pressable>

      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingTop: top + 48, paddingBottom: bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoWrap}>
          <Image
            source={WHITE_LOGO}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

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
            disabled={authBusy}
          >
            {isGoogleLoading ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <Image source={GOOGLE_LOGO} style={styles.googleLogo} />
            )}
            <Text style={[styles.buttonText, styles.googleButtonText]}>
              {isGoogleLoading ? "로그인 중..." : "구글로 시작하기"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

export default SocialLoginScreen;
