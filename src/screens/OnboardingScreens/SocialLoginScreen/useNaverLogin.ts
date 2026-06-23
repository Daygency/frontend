/**
 * @react-native-seoul/naver-login 정식 사용:
 * `login()` → successResponse.accessToken 만 서버로 전달합니다.
 * (SDK는 인가 code를 JS에 노출하지 않음 — 백엔드는 accessToken 검증 API 필요)
 */
import { useRef, useState } from "react";
import { Alert } from "react-native";
import NaverLogin from "@react-native-seoul/naver-login";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuth } from "../../../contexts/AuthContext";
import {
  pickNameFromSocialAuthData,
  postSocialAuthExchange,
} from "../../../lib/apis/auth/socialAuthExchange";
import { RootRoutes } from "../../../navigations/routes";
import { NAVER_URL_SCHEME } from "../../../lib/naver/naverConfig";

const NAVER_LOGIN_TIMEOUT_MS = 120_000;

function withTimeout<T>(promise: Promise<T>, ms: number, message: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(message)), ms);
    promise.then(
      (v) => {
        clearTimeout(t);
        resolve(v);
      },
      (e) => {
        clearTimeout(t);
        reject(e);
      },
    );
  });
}

function parseAuthErrorBody(text: string, status: number): string {
  const trimmed = text?.trim() ?? "";
  if (!trimmed) return `서버 응답이 비어 있습니다 (${status})`;
  try {
    const data = JSON.parse(trimmed) as Record<string, unknown>;
    const m = data.message;
    if (typeof m === "string" && m) return m;
    if (Array.isArray(m) && m.length) return m.map(String).join("\n");
    if (typeof data.error === "string" && data.error) return data.error;
  } catch {
    /* not JSON */
  }
  return trimmed.slice(0, 500) || `서버 인증 실패 (${status})`;
}

export const useNaverLogin = () => {
  const { login: authLogin, enterBrowse } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<Record<string, object | undefined>>>();
  const [isLoading, setIsLoading] = useState(false);
  const busyRef = useRef(false);

  const handleNaverLogin = async () => {
    if (busyRef.current) return;
    busyRef.current = true;
    setIsLoading(true);
    try {
      if (
        NaverLogin == null ||
        typeof NaverLogin.login !== "function"
      ) {
        Alert.alert(
          "네이버 로그인을 사용할 수 없음",
          "네이티브 모듈이 없습니다. dev client로 빌드한 앱으로 실행해 주세요.\n\nnpx expo run:ios 또는 run:android",
        );
        return;
      }

      if (__DEV__) {
        console.log(
          "[Naver] iOS URL Scheme (콘솔과 동일해야 함):",
          NAVER_URL_SCHEME,
        );
      }

      const naverResult = await withTimeout(
        NaverLogin.login(),
        NAVER_LOGIN_TIMEOUT_MS,
        `네이버 로그인 시간 초과. URL Scheme "${NAVER_URL_SCHEME}" 를 네이버 개발자센터에 등록했는지 확인하세요.`,
      );

      if (!naverResult.isSuccess || !naverResult.successResponse?.accessToken) {
        const fail = naverResult.failureResponse;
        if (fail?.isCancel) return;
        throw new Error(fail?.message ?? "네이버 로그인에 실패했습니다.");
      }

      const tokenFromSdk = naverResult.successResponse.accessToken;

      const { ok, status, data, rawText } = await postSocialAuthExchange(
        "naver",
        tokenFromSdk,
      );

      if (!ok) {
        const detail = parseAuthErrorBody(rawText, status);
        if (__DEV__) {
          console.warn("[Naver] POST /auth/naver", status, rawText?.slice(0, 600));
        }
        throw new Error(detail);
      }

      const {
        accessToken,
        refreshToken,
        user,
        needsSignup,
        isNew,
        naverAccessToken: naverTokenFromServer,
        oauthAccessToken,
        profile,
      } = data as {
        accessToken?: string;
        refreshToken?: string;
        user?: Record<string, unknown>;
        needsSignup?: boolean;
        isNew?: boolean;
        naverAccessToken?: string;
        oauthAccessToken?: string;
        profile?: Record<string, unknown>;
      };

      const pendingOauthToken =
        naverTokenFromServer ?? oauthAccessToken ?? tokenFromSdk;

      if (data.needsReactivation) {
        enterBrowse();
        navigation.navigate(RootRoutes.ACCOUNT_REACTIVATION, {
          provider: "naver",
          oauthAccessToken: pendingOauthToken,
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
          pendingOauthToken,
          {
            socialId: String(p.socialId ?? ""),
            name: String(p.name ?? ""),
            email: String(p.email ?? ""),
            profileImgUrl: String(p.profileImgUrl ?? ""),
          },
          { isNewUser: true, signupProvider: "naver" },
        );
        return;
      }

      if (!accessToken || !user) {
        throw new Error("서버 응답 형식이 올바르지 않습니다.");
      }

      const u = user as Record<string, unknown>;
      await authLogin(
        accessToken,
        {
          socialId: String(u.userId ?? u.socialId ?? ""),
          name: String(u.name ?? ""),
          email: String(u.email ?? ""),
          profileImgUrl: String(u.profileImgUrl ?? ""),
        },
        { isNewUser: Boolean(isNew), refreshToken: refreshToken ?? undefined },
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("[Naver Login Error]", error);
      Alert.alert(
        "로그인 실패",
        `네이버 로그인에 실패했습니다.\n\n(오류: ${message})`,
      );
    } finally {
      busyRef.current = false;
      setIsLoading(false);
    }
  };

  return { handleNaverLogin, isLoading };
};
