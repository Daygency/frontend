import { Platform } from "react-native";

// 실제 기기에서 테스트 시: .env에 EXPO_PUBLIC_API_BASE=http://본인PC_IP:3000 설정
const envBase = process.env.EXPO_PUBLIC_API_BASE?.trim();
export const API_BASE =
  envBase ||
  (Platform.OS === "android" ? "http://10.0.2.2:3000" : "http://localhost:3000");

/** README: 전공 마스터 — 기본 `GET {API_BASE}/major` (Swagger `/api` 사용 시 API_BASE에 `/api` 포함) */
export const MAJOR_LIST_PATH =
  process.env.EXPO_PUBLIC_MAJOR_PATH?.trim() || "/major";

export const AUTH_TOKEN_KEY = "@daygency_auth_token";
export const REFRESH_TOKEN_KEY = "@daygency_refresh_token";
/** 가입 완료 전 소셜 OAuth access token (앱 JWT와 분리) */
export const PENDING_SIGNUP_OAUTH_TOKEN_KEY =
  "@daygency_pending_signup_oauth_token";
