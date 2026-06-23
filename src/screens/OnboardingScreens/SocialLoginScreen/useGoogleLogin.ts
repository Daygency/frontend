import { useRef, useState } from "react";
import { Alert } from "react-native";
import {
  GoogleSignin,
  isErrorWithCode,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuth } from "../../../contexts/AuthContext";
import {
  pickNameFromSocialAuthData,
  postSocialAuthExchange,
} from "../../../lib/apis/auth/socialAuthExchange";
import { GOOGLE_WEB_CLIENT_ID } from "../../../lib/google/googleConfig";
import { RootRoutes } from "../../../navigations/routes";

export const useGoogleLogin = () => {
  const { login: authLogin, enterBrowse } = useAuth();
  const navigation =
    useNavigation<NativeStackNavigationProp<Record<string, object | undefined>>>();
  const [isLoading, setIsLoading] = useState(false);
  const busyRef = useRef(false);

  const handleGoogleLogin = async () => {
    if (busyRef.current) return;
    if (!GOOGLE_WEB_CLIENT_ID) {
      Alert.alert(
        "구글 로그인 설정 필요",
        "EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID 가 .env 에 설정되어 있어야 합니다.",
      );
      return;
    }

    busyRef.current = true;
    setIsLoading(true);
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const signInResult = await GoogleSignin.signIn();
      if (signInResult.type === "cancelled") return;
      if (signInResult.type !== "success") {
        throw new Error("구글 로그인에 실패했습니다.");
      }

      const tokens = await GoogleSignin.getTokens();
      const accessToken = tokens.accessToken?.trim();
      if (!accessToken) {
        throw new Error("구글 accessToken을 받지 못했습니다.");
      }

      const { ok, status, data, rawText } = await postSocialAuthExchange(
        "google",
        accessToken,
      );

      if (!ok) {
        const backendMsg =
          (typeof data.message === "string" && data.message) ||
          (typeof data.error === "string" && data.error) ||
          rawText.slice(0, 500) ||
          "";
        throw new Error(backendMsg || `서버 인증 실패 (${status})`);
      }

      const {
        accessToken: appAccessToken,
        refreshToken,
        user,
        needsSignup,
        isNew,
        profile,
      } = data as {
        accessToken?: string;
        refreshToken?: string;
        user?: Record<string, unknown>;
        needsSignup?: boolean;
        isNew?: boolean;
        profile?: Record<string, unknown>;
      };

      if (data.needsReactivation) {
        enterBrowse();
        navigation.navigate(RootRoutes.ACCOUNT_REACTIVATION, {
          provider: "google",
          oauthAccessToken: accessToken,
          deletedAt:
            typeof data.deletedAt === "string" ? data.deletedAt : undefined,
          reactivationDeadline:
            typeof data.reactivationDeadline === "string"
              ? data.reactivationDeadline
              : undefined,
          name: pickNameFromSocialAuthData(data),
        });
        return;
      }

      if (needsSignup) {
        const p = profile ?? {};
        await authLogin(
          accessToken,
          {
            socialId: String(p.socialId ?? ""),
            name: String(p.name ?? ""),
            email: String(p.email ?? ""),
            profileImgUrl: String(p.profileImgUrl ?? ""),
          },
          { isNewUser: true, signupProvider: "google" },
        );
        return;
      }

      if (!appAccessToken || !user) {
        throw new Error("서버 응답 형식이 올바르지 않습니다.");
      }

      const u = user as Record<string, unknown>;
      await authLogin(
        appAccessToken,
        {
          socialId: String(u.userId ?? u.socialId ?? ""),
          name: String(u.name ?? ""),
          email: String(u.email ?? ""),
          profileImgUrl: String(u.profileImgUrl ?? ""),
        },
        { isNewUser: Boolean(isNew), refreshToken: refreshToken ?? undefined },
      );
    } catch (error) {
      if (isErrorWithCode(error)) {
        if (error.code === statusCodes.SIGN_IN_CANCELLED) return;
        if (error.code === statusCodes.IN_PROGRESS) return;
        if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          Alert.alert(
            "구글 로그인 불가",
            "Google Play 서비스가 필요합니다. 기기를 확인해 주세요.",
          );
          return;
        }
      }

      const message = error instanceof Error ? error.message : String(error);
      console.error("[Google Login Error]", error);
      Alert.alert(
        "로그인 실패",
        `구글 로그인에 실패했습니다.\n\n(오류: ${message})`,
      );
    } finally {
      busyRef.current = false;
      setIsLoading(false);
    }
  };

  return { handleGoogleLogin, isLoading };
};
