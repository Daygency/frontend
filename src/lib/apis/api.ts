import { Platform } from "react-native";

// 실제 기기에서 테스트 시: .env에 EXPO_PUBLIC_API_BASE=http://본인PC_IP:3000 설정
const envBase = process.env.EXPO_PUBLIC_API_BASE?.trim();
export const API_BASE =
  envBase ||
  (Platform.OS === "android" ? "http://10.0.2.2:3000" : "http://localhost:3000");

export const AUTH_TOKEN_KEY = "@daygency_auth_token";
