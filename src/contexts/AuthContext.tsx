import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AUTH_TOKEN_KEY = "@daygency_auth_token";
const USER_INFO_KEY = "@daygency_user_info";

export type SocialUser = {
  socialId: string;
  nickname: string;
  email: string;
  profileImgUrl: string;
};

type AuthContextType = {
  isLoggedIn: boolean;
  isBrowsing: boolean;
  isLoading: boolean;
  user: SocialUser | null;
  login: (token: string, user: SocialUser) => Promise<void>;
  logout: () => Promise<void>;
  enterBrowse: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isBrowsing, setIsBrowsing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<SocialUser | null>(null);

  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const [token, userJson] = await Promise.all([
          AsyncStorage.getItem(AUTH_TOKEN_KEY),
          AsyncStorage.getItem(USER_INFO_KEY),
        ]);
        setIsLoggedIn(!!token);
        setUser(userJson ? (JSON.parse(userJson) as SocialUser) : null);
      } catch {
        setIsLoggedIn(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    loadAuthState();
  }, []);

  const login = async (token: string, userInfo: SocialUser) => {
    await Promise.all([
      AsyncStorage.setItem(AUTH_TOKEN_KEY, token),
      AsyncStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo)),
    ]);
    setUser(userInfo);
    setIsLoggedIn(true);
  };

  const logout = async () => {
    await Promise.all([
      AsyncStorage.removeItem(AUTH_TOKEN_KEY),
      AsyncStorage.removeItem(USER_INFO_KEY),
    ]);
    setUser(null);
    setIsLoggedIn(false);
    setIsBrowsing(false);
  };

  const enterBrowse = () => {
    setIsBrowsing(true);
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, isBrowsing, isLoading, user, login, logout, enterBrowse }}
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
