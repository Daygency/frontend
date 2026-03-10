import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AUTH_TOKEN_KEY = "@daygency_auth_token";
const USER_INFO_KEY = "@daygency_user_info";
const PENDING_SIGNUP_KEY = "@daygency_pending_signup";

export type SocialUser = {
  socialId: string;
  nickname: string;
  email: string;
  profileImgUrl: string;
};

export type UserRole = "artist" | "planner";

type AuthContextType = {
  isLoggedIn: boolean;
  isBrowsing: boolean;
  isLoading: boolean;
  needsRoleSelection: boolean;
  user: SocialUser | null;
  login: (token: string, user: SocialUser, options?: { isNewUser?: boolean }) => Promise<void>;
  completeSignup: (role: UserRole) => Promise<void>;
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
    token: string,
    userInfo: SocialUser,
    options?: { isNewUser?: boolean }
  ) => {
    await Promise.all([
      AsyncStorage.setItem(AUTH_TOKEN_KEY, token),
      AsyncStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo)),
    ]);
    setUser(userInfo);
    setIsLoggedIn(true);

    if (options?.isNewUser) {
      await AsyncStorage.setItem(PENDING_SIGNUP_KEY, "true");
      setNeedsRoleSelection(true);
    }
  };

  const completeSignup = async (role: UserRole) => {
    try {
      await AsyncStorage.removeItem(PENDING_SIGNUP_KEY);
      setNeedsRoleSelection(false);
      // TODO: 서버에 role 전송 (프로필 생성 API 호출)
      // await fetch(.../auth/complete-signup, { body: { role } });
    } catch {
      // ignore
    }
  };

  const logout = async () => {
    await Promise.all([
      AsyncStorage.removeItem(AUTH_TOKEN_KEY),
      AsyncStorage.removeItem(USER_INFO_KEY),
      AsyncStorage.removeItem(PENDING_SIGNUP_KEY),
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
