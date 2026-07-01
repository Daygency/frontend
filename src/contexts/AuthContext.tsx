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
import { clearProfileCache, saveProfileCache } from "../lib/profileCache";
import { getMyProfile } from "../lib/apis/portfolio/profileApi";
import { onAuthExpired } from "../lib/authEvents";
import { completeKakaoSignup } from "../lib/apis/auth/completeKakaoSignup";
import { completeGoogleSignup } from "../lib/apis/auth/completeGoogleSignup";
import { completeNaverSignup } from "../lib/apis/auth/completeNaverSignup";
import { syncFcmTokenToServer } from "../lib/fcmServerSync";
const USER_INFO_KEY = "@daygency_user_info";
const PENDING_SIGNUP_KEY = "@daygency_pending_signup";
const PENDING_SIGNUP_PROVIDER_KEY = "@daygency_pending_signup_provider";

export type SignupProvider = "kakao" | "naver" | "google";

export type SocialUser = {
  socialId: string;
  name: string;
  email: string;
  profileImgUrl: string;
};

export type UserRole = "artist" | "planner";

export type SignupParams = {
  role: UserRole;
  name?: string; // 미입력 시 null
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
  /** 비로그인 시 둘러보기 종료 후 로그인 화면으로 전환 */
  requireLogin: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isBrowsing, setIsBrowsing] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [needsRoleSelection, setNeedsRoleSelection] = useState(false);
  const [user, setUser] = useState<SocialUser | null>(null);

  useEffect(() => {
    const unsub = onAuthExpired(() => {
      setUser(null);
      setIsLoggedIn(false);
      setIsBrowsing(true);
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
          setIsBrowsing(false);
        } else if (token) {
          setUser(parsedUser);
          setNeedsRoleSelection(false);
          setIsLoggedIn(true);
        } else {
          setUser(null);
          setNeedsRoleSelection(false);
          setIsLoggedIn(false);
          setIsBrowsing(true);
        }
      } catch {
        setIsLoggedIn(false);
        setUser(null);
        setNeedsRoleSelection(false);
        setIsBrowsing(true);
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
    setIsBrowsing(false);
  };

  const completeSignup = async (params: SignupParams) => {
    const { role, name, activityName } = params;
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
              ...(name?.trim() ? { name: name.trim() } : {}),
              role: role === "planner" ? "admin" : "user",
            })
          : signupProvider === "google"
            ? await completeGoogleSignup({
                accessToken,
                role,
                ...(name?.trim() ? { name: name.trim() } : {}),
                ...(activityName?.trim()
                  ? { activityName: activityName.trim() }
                  : {}),
              })
            : await completeKakaoSignup({
                accessToken,
                role,
                ...(name?.trim() ? { name: name.trim() } : {}),
                ...(activityName?.trim()
                  ? { activityName: activityName.trim() }
                  : {}),
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
        const signedUpName = name?.trim() ?? "";
        const userInfo: SocialUser = {
          socialId: String(u.userId ?? u.socialId ?? ""),
          name: String(u.name ?? signedUpName ?? ""),
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
      setIsBrowsing(false);
      void getMyProfile().then((profile) => {
        if (profile) void saveProfileCache(profile);
      });
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
    setIsBrowsing(true);
    setNeedsRoleSelection(false);
  };

  const enterBrowse = () => {
    setIsBrowsing(true);
  };

  const requireLogin = () => {
    if (isLoggedIn) return;
    setIsBrowsing(false);
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
        requireLogin,
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
