import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  AUTH_TOKEN_KEY,
  PENDING_SIGNUP_OAUTH_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
} from "../lib/apis/api";
import { clearProfileCache } from "../lib/profileCache";
import { onAuthExpired } from "../lib/authEvents";
import { completeKakaoSignup } from "../lib/apis/auth/completeKakaoSignup";
import { completeNaverSignup } from "../lib/apis/auth/completeNaverSignup";
import { syncFcmTokenToServer } from "../lib/fcmServerSync";
const USER_INFO_KEY = "@daygency_user_info";
const PENDING_SIGNUP_KEY = "@daygency_pending_signup";
const PENDING_SIGNUP_PROVIDER_KEY = "@daygency_pending_signup_provider";

export type SignupProvider = "kakao" | "naver";

export type SocialUser = {
  socialId: string;
  nickname: string;
  email: string;
  profileImgUrl: string;
};

export type UserRole = "artist" | "planner";

export type SignupParams = {
  role: UserRole;
  nickname?: string; // 미입력 시 소셜 프로필 값 사용
  activityName?: string;
};

type AuthContextType = {
  isLoggedIn: boolean;
  isBrowsing: boolean;
  isLoading: boolean;
  needsRoleSelection: boolean;
  user: SocialUser | null;
  login: (
    accessToken: string,
    user: SocialUser,
    options?: {
      isNewUser?: boolean;
      refreshToken?: string;
      signupProvider?: SignupProvider;
    },
  ) => Promise<void>;
  completeSignup: (params: SignupParams) => Promise<void>;
  logout: () => Promise<void>;
  enterBrowse: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isBrowsing, setIsBrowsing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [needsRoleSelection, setNeedsRoleSelection] = useState(false);
  const [user, setUser] = useState<SocialUser | null>(null);

  useEffect(() => {
    const unsub = onAuthExpired(() => {
      setUser(null);
      setIsLoggedIn(false);
      setIsBrowsing(false);
      setNeedsRoleSelection(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const [token, userJson, pendingSignup, pendingOauth] =
          await Promise.all([
            AsyncStorage.getItem(AUTH_TOKEN_KEY),
            AsyncStorage.getItem(USER_INFO_KEY),
            AsyncStorage.getItem(PENDING_SIGNUP_KEY),
            AsyncStorage.getItem(PENDING_SIGNUP_OAUTH_TOKEN_KEY),
          ]);

        const parsedUser = userJson
          ? (JSON.parse(userJson) as SocialUser)
          : null;

        if (pendingSignup === "true") {
          // 이전 버전: OAuth 토큰이 AUTH_TOKEN_KEY에 저장된 경우 마이그레이션
          if (!pendingOauth && token) {
            await AsyncStorage.setItem(PENDING_SIGNUP_OAUTH_TOKEN_KEY, token);
            await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
          }
          setUser(parsedUser);
          setNeedsRoleSelection(true);
          setIsLoggedIn(false);
        } else {
          setUser(parsedUser);
          setNeedsRoleSelection(false);
          setIsLoggedIn(!!token);
        }
      } catch {
        setIsLoggedIn(false);
        setUser(null);
        setNeedsRoleSelection(false);
      } finally {
        setIsLoading(false);
      }
    };
    loadAuthState();
  }, []);

  const login = async (
    accessToken: string,
    userInfo: SocialUser,
    options?: {
      isNewUser?: boolean;
      refreshToken?: string;
      signupProvider?: SignupProvider;
    },
  ) => {
    if (options?.isNewUser) {
      await Promise.all([
        AsyncStorage.setItem(PENDING_SIGNUP_OAUTH_TOKEN_KEY, accessToken),
        AsyncStorage.removeItem(AUTH_TOKEN_KEY),
        AsyncStorage.removeItem(REFRESH_TOKEN_KEY),
        AsyncStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo)),
        AsyncStorage.setItem(PENDING_SIGNUP_KEY, "true"),
        AsyncStorage.setItem(
          PENDING_SIGNUP_PROVIDER_KEY,
          options.signupProvider ?? "kakao",
        ),
      ]);
      setUser(userInfo);
      setNeedsRoleSelection(true);
      setIsLoggedIn(false);
      return;
    }

    const toStore: Promise<void>[] = [
      AsyncStorage.setItem(AUTH_TOKEN_KEY, accessToken),
      AsyncStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo)),
      AsyncStorage.removeItem(PENDING_SIGNUP_OAUTH_TOKEN_KEY),
      AsyncStorage.removeItem(PENDING_SIGNUP_KEY),
      AsyncStorage.removeItem(PENDING_SIGNUP_PROVIDER_KEY),
    ];
    if (options?.refreshToken) {
      toStore.push(
        AsyncStorage.setItem(REFRESH_TOKEN_KEY, options.refreshToken),
      );
    }
    await Promise.all(toStore);
    setUser(userInfo);
    setNeedsRoleSelection(false);
    setIsLoggedIn(true);
  };

  const completeSignup = async (params: SignupParams) => {
    const { role, nickname, activityName } = params;
    try {
      const accessToken = await AsyncStorage.getItem(
        PENDING_SIGNUP_OAUTH_TOKEN_KEY,
      );
      if (!accessToken) {
        throw new Error("소셜 로그인 정보가 없습니다. 다시 로그인해 주세요.");
      }

      const signupProvider =
        (await AsyncStorage.getItem(PENDING_SIGNUP_PROVIDER_KEY)) ?? "kakao";

      const data =
        signupProvider === "naver"
          ? await completeNaverSignup({
              accessToken,
              activityName: (activityName ?? "").trim(),
              ...(nickname?.trim() ? { nickname: nickname.trim() } : {}),
              role: role === "planner" ? "admin" : "user",
            })
          : await completeKakaoSignup({
              accessToken,
              role,
              ...(nickname?.trim() ? { nickname: nickname.trim() } : {}),
              ...(activityName?.trim() ? { activityName: activityName.trim() } : {}),
            });

      // 토큰 발급 시 새 토큰으로 갱신 (auth-api.md: accessToken + refreshToken)
      if (data?.accessToken) {
        await AsyncStorage.setItem(AUTH_TOKEN_KEY, data.accessToken);
      }
      if (data?.refreshToken) {
        await AsyncStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
      }
      if (data?.user) {
        const u = data.user;
        const userInfo: SocialUser = {
          socialId: String(u.userId ?? u.socialId ?? ""),
          nickname: String(u.nickname ?? ""),
          email: String(u.email ?? ""),
          profileImgUrl: String(u.profileImgUrl ?? ""),
        };
        await AsyncStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
        setUser(userInfo);
      }

      await Promise.all([
        AsyncStorage.removeItem(PENDING_SIGNUP_KEY),
        AsyncStorage.removeItem(PENDING_SIGNUP_PROVIDER_KEY),
        AsyncStorage.removeItem(PENDING_SIGNUP_OAUTH_TOKEN_KEY),
      ]);
      setNeedsRoleSelection(false);
      setIsLoggedIn(true);
      void syncFcmTokenToServer();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      Alert.alert("가입 실패", message);
      throw error;
    }
  };

  const logout = async () => {
    await Promise.all([
      AsyncStorage.removeItem(AUTH_TOKEN_KEY),
      AsyncStorage.removeItem(REFRESH_TOKEN_KEY),
      AsyncStorage.removeItem(USER_INFO_KEY),
      AsyncStorage.removeItem(PENDING_SIGNUP_KEY),
      AsyncStorage.removeItem(PENDING_SIGNUP_PROVIDER_KEY),
      AsyncStorage.removeItem(PENDING_SIGNUP_OAUTH_TOKEN_KEY),
      clearProfileCache(),
    ]);
    setUser(null);
    setIsLoggedIn(false);
    setIsBrowsing(false);
    setNeedsRoleSelection(false);
  };

  const enterBrowse = () => {
    setIsBrowsing(true);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isBrowsing,
        isLoading,
        needsRoleSelection,
        user,
        login,
        completeSignup,
        logout,
        enterBrowse,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
