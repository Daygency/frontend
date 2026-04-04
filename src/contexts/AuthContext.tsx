import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE, AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY } from "../lib/apis/api";
import { clearProfileCache } from "../lib/profileCache";
import { onAuthExpired } from "../lib/authEvents";
import { completeKakaoSignup } from "../lib/apis/auth/completeKakaoSignup";
import { syncFcmTokenToServer } from "../lib/fcmServerSync";
const USER_INFO_KEY = "@daygency_user_info";
const PENDING_SIGNUP_KEY = "@daygency_pending_signup";

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
    options?: { isNewUser?: boolean; refreshToken?: string },
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
        const [token, userJson, pendingSignup] = await Promise.all([
          AsyncStorage.getItem(AUTH_TOKEN_KEY),
          AsyncStorage.getItem(USER_INFO_KEY),
          AsyncStorage.getItem(PENDING_SIGNUP_KEY),
        ]);
        setIsLoggedIn(!!token);
        setUser(userJson ? (JSON.parse(userJson) as SocialUser) : null);
        setNeedsRoleSelection(pendingSignup === "true");
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
    options?: { isNewUser?: boolean; refreshToken?: string },
  ) => {
    const toStore: Promise<void>[] = [
      AsyncStorage.setItem(AUTH_TOKEN_KEY, accessToken),
      AsyncStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo)),
    ];
    if (options?.refreshToken) {
      toStore.push(
        AsyncStorage.setItem(REFRESH_TOKEN_KEY, options.refreshToken),
      );
    }
    await Promise.all(toStore);
    setUser(userInfo);
    setIsLoggedIn(true);

    if (options?.isNewUser) {
      await AsyncStorage.setItem(PENDING_SIGNUP_KEY, "true");
      setNeedsRoleSelection(true);
    }
  };

  const completeSignup = async (params: SignupParams) => {
    const { role, nickname, activityName } = params;
    try {
      const accessToken = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
      if (!accessToken) {
        throw new Error("로그인 정보가 없습니다. 다시 로그인해 주세요.");
      }

      const data = await completeKakaoSignup({
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

      await AsyncStorage.removeItem(PENDING_SIGNUP_KEY);
      setNeedsRoleSelection(false);
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
