import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AUTH_TOKEN_KEY = "@daygency_auth_token";

type AuthContextType = {
  isLoggedIn: boolean;
  isBrowsing: boolean;
  isLoading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  enterBrowse: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isBrowsing, setIsBrowsing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
        setIsLoggedIn(!!token);
      } catch {
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };
    loadAuthState();
  }, []);

  const login = async (token: string) => {
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
    setIsLoggedIn(true);
  };

  const logout = async () => {
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    setIsLoggedIn(false);
    setIsBrowsing(false);
  };

  const enterBrowse = () => {
    setIsBrowsing(true);
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, isBrowsing, isLoading, login, logout, enterBrowse }}
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
